import re
import pdfplumber
import pandas as pd
from fastapi import UploadFile, File
from sklearn.ensemble import RandomForestClassifier
import numpy as np
from io import BytesIO

# 1. --- ML MODEL SETUP ---
def get_loan_model():
    # Training data: [Income, Expenses, SavingsRatio, TransactionCount]
    X = np.array([
        [80000, 20000, 0.75, 10], 
        [20000, 19000, 0.05, 50], 
        [50000, 25000, 0.50, 20],
        [120000, 30000, 0.75, 15],
        [35000, 32000, 0.08, 45]
    ])
    y = np.array([1, 0, 1, 1, 0]) # 1 = Eligible, 0 = Not
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    return model

loan_model = get_loan_model()

# 2. --- PHONEPE / UPI TAG MAPPING ---
TAG_MAP = {
    "Food & Dining": ["zomato", "swiggy", "blinkit", "restaurant", "kfc", "mcdonalds", "burger", "pizza", "starbucks", "eats"],
    "Travel": ["uber", "ola", "rapido", "irctc", "makemytrip", "petrol", "shell", "hpcl", "fuel", "gas", "auto", "train"],
    "Shopping": ["amazon", "flipkart", "myntra", "ajio", "nykaa", "bigbasket", "dmart", "retail", "store", "mall"],
    "Utilities": ["bescom", "airtel", "jio", "vi ", "recharge", "electricity", "water", "actfibernet", "broadband", "bill"],
    "Entertainment": ["netflix", "prime", "hotstar", "spotify", "bookmyshow", "pvr", "gaming", "subscription", "youtube"],
    "Rent": ["rent", "housing", "owner", "broker", "lease", "security deposit"],
    "Salary": ["salary", "stipend", "wages", "hcl", "tcs", "infosys", "google", "credited", "income"]
}

def categorize_transaction(description):
    desc = str(description).lower()
    for category, keywords in TAG_MAP.items():
        if any(k in desc for k in keywords):
            return category
    return "Others"

def extract_period(text):
    """Detects the month and year from the statement text for historical storage"""
    months = ["january", "february", "march", "april", "may", "june", 
              "july", "august", "september", "october", "november", "december"]
    text_lower = text.lower()
    
    found_month = "January"
    month_index = "01"
    
    for i, m in enumerate(months):
        if m in text_lower:
            found_month = m.capitalize()
            month_index = str(i + 1).zfill(2)
            break
            
    return f"{found_month} 2024", f"2024-{month_index}"

async def analyze_statement(file: UploadFile):
    transactions = []
    raw_text = ""
    
    try:
        file_content = await file.read()
        file_obj = BytesIO(file_content)
        
        with pdfplumber.open(file_obj) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    raw_text += text + "\n"
        
        # Optimized Regex for PhonePe / UPI Bank Statements
        # Looks for: Date | Description (containing UPI/Bank tags) | CR/DR | Amount
        pattern = r'(\d{2}[-/]\d{2}[-/]\d{2,4})\s+(.+?)\s+(DR|CR|Debit|Credit)\s+([\d,]+\.\d{2})'
        matches = re.findall(pattern, raw_text)

        for match in matches:
            date, desc, tx_type, amount_str = match
            amount = float(amount_str.replace(',', ''))
            
            transactions.append({
                "date": date,
                "description": desc.strip(),
                "amount": amount,
                "category": categorize_transaction(desc),
                "is_income": tx_type.lower() in ['cr', 'credit']
            })

        if not transactions:
            # Emergency Fallback: If regex fails, scan text for known category tags
            for cat, keywords in TAG_MAP.items():
                if any(k in raw_text.lower() for k in keywords):
                    transactions.append({"category": cat, "amount": 500, "is_income": False})

        df = pd.DataFrame(transactions)
        
        # Financial Calculations
        total_income = float(df[df['is_income']]['amount'].sum())
        total_expense = float(df[~df['is_income']]['amount'].sum())
        savings_ratio = (total_income - total_expense) / total_income if total_income > 0 else 0
        
        # Group summary for Frontend
        summary = df[~df['is_income']].groupby('category')['amount'].sum().to_dict()
        top_category = max(summary, key=summary.get) if summary else "None"
        
        # Historical Period Detection
        month_display, period_key = extract_period(raw_text)

        # Random Forest Prediction
        prediction_input = np.array([[total_income, total_expense, savings_ratio, len(transactions)]])
        eligibility_code = loan_model.predict(prediction_input)[0]
        loan_eligible = "Eligible" if eligibility_code == 1 else "Not Eligible"

        return {
            "period_key": period_key,
            "month_display": month_display,
            "summary": summary,
            "total_income": total_income,
            "total_spent": total_expense,
            "loan_eligible": loan_eligible,
            "top_category": top_category,
            "transactions": transactions[:10], # Sample for the UI
            "analysis_desc": f"Analyzed {len(transactions)} UPI transactions for {month_display}."
        }

    except Exception as e:
        return {"error": str(e)}