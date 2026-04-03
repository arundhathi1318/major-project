import os
import uuid
import pdfplumber
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from google import genai
import re

clean_text = re.sub(r'[\*\#\_\`\~]', '', response.text)  # strip markdown chars
clean_text = re.sub(r'\n{3,}', '\n\n', clean_text).strip()  # collapse blank lines
from analysisengine import (
    chunk_text,
    get_embeddings,
    store_rag_document,
    retrieve_rag_document,
    semantic_search,
)

# ===============================
# LOAD ENV VARIABLES
# ===============================

load_dotenv()

# ===============================
# GEMINI CLIENT INIT
# ===============================

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# ===============================
# GLOBAL STORAGE
# ===============================

GOV_DOC_ID: Optional[str] = None

# ===============================
# LOAD GOV RULES PDF AT STARTUP
# ===============================

@asynccontextmanager
async def lifespan(app: FastAPI):

    global GOV_DOC_ID

    pdf_path = "docs/govt_rules.pdf"

    if os.path.exists(pdf_path):

        try:

            text = ""

            with pdfplumber.open(pdf_path) as pdf:

                for page in pdf.pages:

                    extracted = page.extract_text()

                    if extracted:

                        text += extracted + "\n"


            if text.strip():

                chunks = chunk_text(text)

                embeddings = get_embeddings(chunks)

                rag_docs = []

                for chunk, emb in zip(chunks, embeddings):

                    rag_docs.append({

                        "text": chunk,
                        "embedding": emb

                    })


                GOV_DOC_ID = str(uuid.uuid4())

                store_rag_document(GOV_DOC_ID, rag_docs)

                print(f"✅ {pdf_path} loaded successfully into RAG")

            else:

                print("⚠️ govt_rules.pdf contains no readable text")

        except Exception as e:

            print("❌ Failed loading govt_rules.pdf:", e)

    else:

        print("⚠️ govt_rules.pdf not found — RAG disabled")


    yield


# ===============================
# FASTAPI INIT
# ===============================

app = FastAPI(lifespan=lifespan)

# ===============================
# CORS CONFIG
# ===============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# ===============================
# REQUEST MODEL
# ===============================

class ChatRequest(BaseModel):

    user_context: dict
    message: str


# ===============================
# CHAT ENDPOINT (SELECTIVE RAG)
# ===============================

@app.post("/chat")

async def chat(request: ChatRequest):

    rag_context = "NO_MATCH_FOUND"

    finance_keywords = [

        "tax",
        "gst",
        "policy",
        "subsidy",
        "deduction",
        "section 80c",
        "government",
        "scheme",
        "interest rule"

    ]

    # ===============================
    # SELECTIVE DOCUMENT RETRIEVAL
    # ===============================

    if GOV_DOC_ID and any(

        word in request.message.lower()

        for word in finance_keywords

    ):

        docs = retrieve_rag_document(GOV_DOC_ID)

        fragments = semantic_search(

            request.message,
            docs,
            top_k=3

        )

        if fragments:

            rag_context = "\n\n".join(fragments)


    # ===============================
    # PROMPT DESIGN (GROUNDING LOGIC)
    # ===============================

    prompt = """

You are FinPilot, a professional AI financial assistant.

Follow these answer priority rules strictly:

PRIORITY 1:
If DOCUMENT CONTEXT contains relevant financial policy or taxation information,
use ONLY that information.

PRIORITY 2:
If DOCUMENT CONTEXT = NO_MATCH_FOUND,
use USER DATA for personalized advice.

PRIORITY 3:
If neither applies,
answer using safe general financial knowledge.

Never hallucinate government policies.
keep the response under 100 words or lesss only .

-----------------------------------

USER DATA:

{request.user_context}

-----------------------------------

DOCUMENT CONTEXT:

{rag_context}

-----------------------------------

USER QUESTION:

{request.message}

Provide a short and accurate response.
Do NOT use markdown symbols like *, #, -, or bullet formatting.
Write output as clean plain sentences.
"""

    # ===============================
    # GEMINI RESPONSE GENERATION
    # ===============================

    try:

        response = client.models.generate_content(

            model="gemini-2.5-flash",

            contents=prompt

        )

        clean_text = response.text.replace("*", "").replace("#", "")

        return {
            "response": clean_text
        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )