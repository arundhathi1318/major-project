import React, { createContext, useContext, useState, useCallback } from 'react';
import type { FinancialData, PersonalProfile, IncomeDetails, ExpenseCategory, Loan, SavingsDetails } from '@/types/finance';

// Type for the AI Analysis results from the PDF/Backend
export interface StatementAnalysis {
  isAnalyzed: boolean;
  loanEligible: string;
  totalParsed: number;
  topCategory: string;
  summaryText: string;
}

interface ExtendedFinancialData extends FinancialData {
  analysis?: StatementAnalysis;
}

// Default empty categories (Amounts start at 0)
const cleanExpenseCategories: ExpenseCategory[] = [
  { id: '1', name: 'Housing', icon: '🏠', amount: 0 },
  { id: '2', name: 'Utilities', icon: '⚡', amount: 0 },
  { id: '3', name: 'Food & Groceries', icon: '🍽', amount: 0 },
  { id: '4', name: 'Transport', icon: '🚕', amount: 0 },
  { id: '5', name: 'Shopping', icon: '🛍', amount: 0 },
  { id: '6', name: 'Healthcare', icon: '🏥', amount: 0 },
  { id: '7', name: 'Entertainment', icon: '🎬', amount: 0 },
  { id: '8', name: 'Miscellaneous', icon: '🧾', amount: 0 },
];

const emptyFinancialData: ExtendedFinancialData = {
  profile: {
    fullName: '', age: 0, gender: 'other', city: '', country: '',
    maritalStatus: 'single', familyType: 'single', dependents: 0, employmentType: 'student',
  },
  income: { primaryIncome: 0, secondaryIncome: 0, incomeFrequency: 'monthly' },
  expenses: cleanExpenseCategories,
  loans: [],
  savings: { currentSavings: 0, hasEmergencyFund: false, goals: [] },
  analysis: { isAnalyzed: false, loanEligible: 'Not Evaluated', totalParsed: 0, topCategory: 'None', summaryText: '' }
};

interface FinanceContextType {
  data: ExtendedFinancialData;
  isOnboarded: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateProfile: (profile: Partial<PersonalProfile>) => void;
  updateIncome: (income: Partial<IncomeDetails>) => void;
  updateExpense: (categoryId: string, amount: number) => void;
  updateExpenseByName: (name: string, amount: number) => void; 
  setAnalysisData: (analysis: StatementAnalysis) => void;
  addExpenseCategory: (name: string, icon: string) => void;
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  removeLoan: (id: string) => void;
  updateLoan: (id: string, loan: Partial<Loan>) => void;
  updateSavings: (savings: Partial<SavingsDetails>) => void;
  completeOnboarding: () => void;
  resetData: () => void;
  getTotalExpenses: () => number;
  getTotalEMI: () => number;
  getNetSavings: () => number;
  getFinancialHealthScore: () => number;
  // Monthly tracking
  activeMonth: string;
  setActiveMonth: (month: string) => void;
  updateHistoryFromPDF: (periodKey: string, summary: Record<string, number>, analysisData: StatementAnalysis) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  // Initialize from LocalStorage or start with empty data
  const [data, setData] = useState<ExtendedFinancialData>(() => {
    const saved = localStorage.getItem('finpilot-data');
    return saved ? JSON.parse(saved) : emptyFinancialData;
  });

  const [isOnboarded, setIsOnboarded] = useState(() => 
    localStorage.getItem('finpilot-onboarded') === 'true'
  );

  const [currentStep, setCurrentStep] = useState(1);

  // Monthly history tracking
  const [activeMonth, setActiveMonth] = useState("2024-01");
  const [monthlyHistory, setMonthlyHistory] = useState<Record<string, ExtendedFinancialData>>(() => {
    const saved = localStorage.getItem('finpilot-history');
    return saved ? JSON.parse(saved) : { "2024-01": emptyFinancialData };
  });

  const saveData = useCallback((newData: ExtendedFinancialData) => {
    setData(newData);
    localStorage.setItem('finpilot-data', JSON.stringify(newData));
  }, []);

  const setAnalysisData = useCallback((analysis: StatementAnalysis) => {
    saveData({ ...data, analysis });
  }, [data, saveData]);

  // Matches PDF parsed names (e.g., "Zomato" -> "Food & Groceries")
  const updateExpenseByName = useCallback((name: string, amount: number) => {
    const newExpenses = data.expenses.map(exp => 
      exp.name.toLowerCase().includes(name.toLowerCase()) ? { ...exp, amount } : exp
    );
    saveData({ ...data, expenses: newExpenses });
  }, [data, saveData]);

  const updateProfile = useCallback((profile: Partial<PersonalProfile>) => {
    saveData({ ...data, profile: { ...data.profile, ...profile } });
  }, [data, saveData]);

  const updateIncome = useCallback((income: Partial<IncomeDetails>) => {
    saveData({ ...data, income: { ...data.income, ...income } });
  }, [data, saveData]);

  const updateExpense = useCallback((categoryId: string, amount: number) => {
    const newExpenses = data.expenses.map(exp => exp.id === categoryId ? { ...exp, amount } : exp);
    saveData({ ...data, expenses: newExpenses });
  }, [data, saveData]);

  const addLoan = useCallback((loan: Omit<Loan, 'id'>) => {
    const newLoan: Loan = { ...loan, id: Date.now().toString() };
    saveData({ ...data, loans: [...data.loans, newLoan] });
  }, [data, saveData]);

  const removeLoan = useCallback((id: string) => {
    saveData({ ...data, loans: data.loans.filter(l => l.id !== id) });
  }, [data, saveData]);

  const updateLoan = useCallback((id: string, loan: Partial<Loan>) => {
    const newLoans = data.loans.map(l => l.id === id ? { ...l, ...loan } : l);
    saveData({ ...data, loans: newLoans });
  }, [data, saveData]);

  const updateSavings = useCallback((savings: Partial<SavingsDetails>) => {
    saveData({ ...data, savings: { ...data.savings, ...savings } });
  }, [data, saveData]);

  const completeOnboarding = useCallback(() => {
    setIsOnboarded(true);
    localStorage.setItem('finpilot-onboarded', 'true');
  }, []);

  const resetData = useCallback(() => {
    localStorage.clear();
    setData(emptyFinancialData);
    setIsOnboarded(false);
    setCurrentStep(1);
    window.location.reload();
  }, []);

  // Calculation Logic (Used by Dashboard, Savings, and Tips pages)
  const getTotalExpenses = useCallback(() => 
    data.expenses.reduce((sum, exp) => sum + exp.amount, 0), [data.expenses]
  );
  
  const getTotalEMI = useCallback(() => 
    data.loans.reduce((sum, loan) => sum + loan.emiAmount, 0), [data.loans]
  );

  const getNetSavings = useCallback(() => {
    const totalIncome = Number(data.income.primaryIncome) + Number(data.income.secondaryIncome);
    return totalIncome - getTotalExpenses() - getTotalEMI();
  }, [data.income, getTotalExpenses, getTotalEMI]);

  const getFinancialHealthScore = useCallback(() => {
    const totalIncome = Number(data.income.primaryIncome) + Number(data.income.secondaryIncome);
    if (totalIncome === 0) return 0;
    
    const savingsRate = getNetSavings() / totalIncome;
    const emiRatio = getTotalEMI() / totalIncome;
    const hasEmergencyFund = data.savings.hasEmergencyFund ? 15 : 0;

    // Base score logic
    let score = 50 + (savingsRate * 50) - (emiRatio * 30) + hasEmergencyFund;
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [data, getNetSavings, getTotalEMI]);

  // Update monthly history from PDF analysis
  const updateHistoryFromPDF = useCallback((periodKey: string, summary: Record<string, number>, analysisData: StatementAnalysis) => {
    setMonthlyHistory(prev => {
      const currentData = prev[periodKey] || emptyFinancialData;
      const updated = {
        ...prev,
        [periodKey]: {
          ...currentData,
          analysis: analysisData,
          expenses: currentData.expenses.map(e => ({
            ...e,
            amount: summary[e.name] || e.amount
          }))
        }
      };
      localStorage.setItem('finpilot-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        data, isOnboarded, currentStep, setCurrentStep,
        updateProfile, updateIncome, updateExpense, updateExpenseByName, setAnalysisData,
        addLoan, removeLoan, updateLoan, updateSavings, resetData,
        completeOnboarding, getTotalExpenses, getTotalEMI, getNetSavings, getFinancialHealthScore,
        addExpenseCategory: (name, icon) => {
            const newCat = { id: Date.now().toString(), name, icon, amount: 0 };
            saveData({...data, expenses: [...data.expenses, newCat]});
        },
        activeMonth,
        setActiveMonth,
        updateHistoryFromPDF
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
}