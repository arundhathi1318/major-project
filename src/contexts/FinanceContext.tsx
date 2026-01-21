import React, { createContext, useContext, useState, useCallback } from 'react';
import type { FinancialData, PersonalProfile, IncomeDetails, ExpenseCategory, Loan, SavingsDetails } from '@/types/finance';

const defaultExpenseCategories: ExpenseCategory[] = [
  { id: '1', name: 'Food & Groceries', icon: '🍽', amount: 0 },
  { id: '2', name: 'Rent / Housing', icon: '🏠', amount: 0 },
  { id: '3', name: 'Utilities', icon: '⚡', amount: 0 },
  { id: '4', name: 'Travel & Transport', icon: '🚕', amount: 0 },
  { id: '5', name: 'Shopping', icon: '🛍', amount: 0 },
  { id: '6', name: 'Entertainment', icon: '🎬', amount: 0 },
  { id: '7', name: 'Healthcare', icon: '🏥', amount: 0 },
  { id: '8', name: 'Mobile & Internet', icon: '📱', amount: 0 },
  { id: '9', name: 'Education', icon: '📚', amount: 0 },
  { id: '10', name: 'Family Expenses', icon: '👨‍👩‍👧', amount: 0 },
  { id: '11', name: 'Miscellaneous', icon: '🧾', amount: 0 },
];

const defaultFinancialData: FinancialData = {
  profile: {
    fullName: '',
    age: 25,
    gender: 'prefer-not-to-say',
    city: '',
    country: '',
    maritalStatus: 'single',
    familyType: 'single',
    dependents: 0,
    employmentType: 'salaried',
  },
  income: {
    primaryIncome: 0,
    secondaryIncome: 0,
    incomeFrequency: 'monthly',
  },
  expenses: defaultExpenseCategories,
  loans: [],
  savings: {
    currentSavings: 0,
    hasEmergencyFund: false,
    goals: [],
  },
};

interface FinanceContextType {
  data: FinancialData;
  isOnboarded: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateProfile: (profile: Partial<PersonalProfile>) => void;
  updateIncome: (income: Partial<IncomeDetails>) => void;
  updateExpense: (categoryId: string, amount: number) => void;
  addExpenseCategory: (name: string, icon: string) => void;
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  removeLoan: (id: string) => void;
  updateLoan: (id: string, loan: Partial<Loan>) => void;
  updateSavings: (savings: Partial<SavingsDetails>) => void;
  completeOnboarding: () => void;
  getTotalExpenses: () => number;
  getTotalEMI: () => number;
  getNetSavings: () => number;
  getFinancialHealthScore: () => number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FinancialData>(() => {
    const saved = localStorage.getItem('finpilot-data');
    return saved ? JSON.parse(saved) : defaultFinancialData;
  });
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('finpilot-onboarded') === 'true';
  });
  const [currentStep, setCurrentStep] = useState(1);

  const saveData = useCallback((newData: FinancialData) => {
    setData(newData);
    localStorage.setItem('finpilot-data', JSON.stringify(newData));
  }, []);

  const updateProfile = useCallback((profile: Partial<PersonalProfile>) => {
    saveData({ ...data, profile: { ...data.profile, ...profile } });
  }, [data, saveData]);

  const updateIncome = useCallback((income: Partial<IncomeDetails>) => {
    saveData({ ...data, income: { ...data.income, ...income } });
  }, [data, saveData]);

  const updateExpense = useCallback((categoryId: string, amount: number) => {
    const newExpenses = data.expenses.map(exp =>
      exp.id === categoryId ? { ...exp, amount } : exp
    );
    saveData({ ...data, expenses: newExpenses });
  }, [data, saveData]);

  const addExpenseCategory = useCallback((name: string, icon: string) => {
    const newCategory: ExpenseCategory = {
      id: Date.now().toString(),
      name,
      icon,
      amount: 0,
    };
    saveData({ ...data, expenses: [...data.expenses, newCategory] });
  }, [data, saveData]);

  const addLoan = useCallback((loan: Omit<Loan, 'id'>) => {
    const newLoan: Loan = { ...loan, id: Date.now().toString() };
    saveData({ ...data, loans: [...data.loans, newLoan] });
  }, [data, saveData]);

  const removeLoan = useCallback((id: string) => {
    saveData({ ...data, loans: data.loans.filter(l => l.id !== id) });
  }, [data, saveData]);

  const updateLoan = useCallback((id: string, loan: Partial<Loan>) => {
    const newLoans = data.loans.map(l =>
      l.id === id ? { ...l, ...loan } : l
    );
    saveData({ ...data, loans: newLoans });
  }, [data, saveData]);

  const updateSavings = useCallback((savings: Partial<SavingsDetails>) => {
    saveData({ ...data, savings: { ...data.savings, ...savings } });
  }, [data, saveData]);

  const completeOnboarding = useCallback(() => {
    setIsOnboarded(true);
    localStorage.setItem('finpilot-onboarded', 'true');
  }, []);

  const getTotalExpenses = useCallback(() => {
    return data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [data.expenses]);

  const getTotalEMI = useCallback(() => {
    return data.loans.reduce((sum, loan) => sum + loan.emiAmount, 0);
  }, [data.loans]);

  const getNetSavings = useCallback(() => {
    const totalIncome = data.income.primaryIncome + data.income.secondaryIncome;
    const totalExpenses = getTotalExpenses();
    const totalEMI = getTotalEMI();
    return totalIncome - totalExpenses - totalEMI;
  }, [data.income, getTotalExpenses, getTotalEMI]);

  const getFinancialHealthScore = useCallback(() => {
    const totalIncome = data.income.primaryIncome + data.income.secondaryIncome;
    if (totalIncome === 0) return 0;

    const totalExpenses = getTotalExpenses();
    const totalEMI = getTotalEMI();
    const savingsRate = (totalIncome - totalExpenses - totalEMI) / totalIncome;
    const emiRatio = totalEMI / totalIncome;
    const hasEmergencyFund = data.savings.hasEmergencyFund ? 15 : 0;

    let score = 50;
    score += savingsRate * 50;
    score -= emiRatio * 30;
    score += hasEmergencyFund;

    return Math.max(0, Math.min(100, Math.round(score)));
  }, [data.income, data.savings.hasEmergencyFund, getTotalExpenses, getTotalEMI]);

  return (
    <FinanceContext.Provider
      value={{
        data,
        isOnboarded,
        currentStep,
        setCurrentStep,
        updateProfile,
        updateIncome,
        updateExpense,
        addExpenseCategory,
        addLoan,
        removeLoan,
        updateLoan,
        updateSavings,
        completeOnboarding,
        getTotalExpenses,
        getTotalEMI,
        getNetSavings,
        getFinancialHealthScore,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
