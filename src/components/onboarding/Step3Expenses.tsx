import { useState, useRef } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Receipt, Plus, X, FileUp, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function Step3Expenses() {
  const { data, updateExpense, setAnalysisData, addExpenseCategory } = useFinance();
  const { expenses, analysis } = data;
  
  const [isUploading, setIsUploading] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📌');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const updateExpenseFromAnalysis = (summary: Record<string, number>) => {
    Object.entries(summary).forEach(([categoryName, amount]) => {
      const expense = expenses.find(exp => exp.name.toLowerCase() === categoryName.toLowerCase());
      if (expense) {
        updateExpense(expense.id, amount);
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setIsUploading(true);
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('http://localhost:8000/analyze-statement', {
      method: 'POST',
      body: formData,
    });
    const result = await res.json();

    // 1. Update the individual expense fields in the global context
    updateExpenseFromAnalysis(result.summary);

    // 2. Save the AI analysis (Loan eligibility, etc.)
    setAnalysisData({
      isAnalyzed: true,
      loanEligible: result.loan_eligible,
      totalParsed: result.total_spent,
      topCategory: result.top_category,
      summaryText: result.analysis_desc
    });

    toast.success("Statement Parsed! All categories updated.");
  } catch (err) {
    toast.error("Failed to update dashboard");
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-16 h-16 finpilot-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Monthly Expenses</h2>
        <p className="text-muted-foreground mt-1">Manual entry or upload statement</p>
      </div>

      {/* PDF Upload Section */}
      <div className={`p-6 rounded-2xl border-2 border-dashed transition-all ${
        analysis?.isAnalyzed ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
      }`}>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf" 
          onChange={handleFileUpload}
          title="Upload PDF bank statement"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center py-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            <p className="text-sm font-medium">FinPilot is parsing transactions...</p>
          </div>
        ) : analysis?.isAnalyzed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-bold text-green-800">Statement Analyzed</p>
                <p className="text-xs text-green-600">Loan Eligibility: {analysis.loanEligible}</p>
              </div>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-xs bg-white border border-green-200 px-3 py-1.5 rounded-lg font-medium text-green-700 hover:bg-green-100"
            >
              Re-upload
            </button>
          </div>
        ) : (
          <div className="text-center">
            <FileUp className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 mb-3 font-medium">Have a bank statement? Auto-fill everything.</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
            >
              Upload PDF Statement
            </button>
          </div>
        )}
      </div>

      {/* Total Summary */}
      <div className="bg-destructive/5 rounded-2xl p-5 border border-destructive/10 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Expenses</p>
          <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
        </div>
        <Receipt className="w-8 h-8 text-destructive opacity-20" />
      </div>

      {/* Expense Categories List */}
      <div className="grid gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {expenses.map((expense) => (
          <div key={expense.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">
              {expense.icon}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700">{expense.name}</label>
            </div>
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
              <input
                type="number"
                value={expense.amount || ''}
                onChange={(e) => updateExpense(expense.id, parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-right text-sm font-bold focus:ring-2 ring-primary/20 outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add New Category UI (Keep existing logic) */}
      {showAddNew ? (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category Name (e.g. Subscriptions)"
            className="w-full p-2 border rounded-lg text-sm"
          />
          <button 
            onClick={() => {
              if(newCategoryName) addExpenseCategory(newCategoryName, '📌');
              setShowAddNew(false);
              setNewCategoryName('');
            }}
            className="w-full bg-primary text-white py-2 rounded-lg text-sm font-bold"
          >
            Add Category
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAddNew(true)}
          className="w-full p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Custom Category
        </button>
      )}
    </div>
  );
}