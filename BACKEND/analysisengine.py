import re
import pdfplumber
import numpy as np
from io import BytesIO
from google import genai
import os

# Initialize the new Client
from dotenv import load_dotenv

load_dotenv() # This loads the variables from .env
client = genai.Client(api_key=os.getenv("VITE_GEMINI_KEY"))

RAG_STORE = {}

def cosine_similarity(v1, v2):
    v1 = np.array(v1, dtype=float)
    v2 = np.array(v2, dtype=float)
    if np.linalg.norm(v1) == 0 or np.linalg.norm(v2) == 0:
        return 0
    return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))

def chunk_text(text, chunk_size=800, overlap=100):
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = words[i:i + chunk_size]
        chunks.append(" ".join(chunk))
        i += chunk_size - overlap
    return chunks
def get_embeddings(texts):
    if not texts:
        return []
    
    all_embeddings = []
    # Gemini API limit is 100 items per batch
    batch_size = 100
    
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        try:
            result = client.models.embed_content(
                model='text-embedding-004',
                contents=batch
            )
            # Add this batch's embeddings to our main list
            all_embeddings.extend([e.values for e in result.embeddings])
            print(f"Processed batch {i//batch_size + 1}")
        except Exception as e:
            print(f"Error processing batch: {e}")
            
    return all_embeddings

def semantic_search(query, rag_documents, top_k=3):
    if not rag_documents:
        return []
        
    # Embed the single query
    query_emb_resp = client.models.embed_content(
        model='text-embedding-004',
        contents=query
    )
    query_embedding = query_emb_resp.embeddings[0].values

    scored = []
    for item in rag_documents:
        score = cosine_similarity(query_embedding, item["embedding"])
        scored.append((score, item["text"]))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [text for score, text in scored[:top_k]]

def store_rag_document(doc_id, rag_docs):
    RAG_STORE[doc_id] = rag_docs

def retrieve_rag_document(doc_id):
    return RAG_STORE.get(doc_id, [])