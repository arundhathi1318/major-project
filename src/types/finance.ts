export interface PersonalProfile {
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  city: string;
  country: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  familyType: 'single' | 'couple' | 'family-with-children';
  dependents: number;
  employmentType: 'student' | 'salaried' | 'self-employed' | 'freelancer';
}

export interface IncomeDetails {
  primaryIncome: number;
  secondaryIncome: number;
  incomeFrequency: 'monthly' | 'irregular';
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  amount: number;
}

export interface Loan {
  id: string;
  type: 'education' | 'home' | 'personal' | 'vehicle' | 'credit-card';
  emiAmount: number;
  interestRate?: number;
  remainingTenure: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  type: 'travel' | 'education' | 'home' | 'marriage' | 'retirement' | 'other';
  targetAmount: number;
  currentAmount: number;
  timeframe: 'short-term' | 'mid-term' | 'long-term';
  targetDate?: string;
}

export interface SavingsDetails {
  currentSavings: number;
  hasEmergencyFund: boolean;
  goals: FinancialGoal[];
}

export interface FinancialData {
  profile: PersonalProfile;
  income: IncomeDetails;
  expenses: ExpenseCategory[];
  loans: Loan[];
  savings: SavingsDetails;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
