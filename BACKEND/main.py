import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from analysisengine import analyze_statement

app = FastAPI()

# --- CORS CONFIGURATION ---
# Allows frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GEMINI AI SETUP ---
# Make sure to replace with your actual API key
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY" 
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

class ChatRequest(BaseModel):
    user_context: dict
    message: str

# --- ENDPOINTS ---

@app.post("/analyze-statement")
async def handle_analyze_statement(file: UploadFile = File(...)):
    """API endpoint to parse PDF and return structured JSON"""
    return await analyze_statement(file)

@app.post("/chat")
async def chat_with_finpilot(request: ChatRequest):
    """Conversational AI using the RAG pattern (Knowledge Base injection)"""
    u = request.user_context
    
    # Injecting user's real financial data into the AI's system prompt
    knowledge_base = f"""
    You are FinPilot, a professional AI financial assistant.
    USER CONTEXT:
    - Name: {u.get('profile', {}).get('fullName', 'User')}
    - Period: {u.get('month_display', 'Current Month')}
    - Monthly Income: ₹{u.get('total_income', 0)}
    - Total Expenses: ₹{u.get('total_spent', 0)}
    - Top Spending: {u.get('top_category', 'N/A')}
    - Loan Eligibility: {u.get('loan_eligible', 'Unknown')} (Calculated via Random Forest)
    
    INSTRUCTIONS:
    1. Be concise, friendly, and use the user's specific numbers.
    2. If the user isn't eligible for a loan, give them 2 steps to improve.
    3. Analyze PhonePe/UPI spending trends based on the context.
    """

    try:
        full_query = f"{knowledge_base}\n\nUser Question: {request.message}"
        response = model.generate_content(full_query)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Port 8000 is the standard for FastAPI
    uvicorn.run(app, host="0.0.0.0", port=8000)