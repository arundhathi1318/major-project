import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { CreditCard, Plus, Trash2, GraduationCap, Home, Car, Wallet } from 'lucide-react';
import type { Loan } from '@/types/finance';

const loanTypeOptions = [
  { value: 'education', label: 'Education Loan', icon: GraduationCap },
  { value: 'home', label: 'Home Loan', icon: Home },
  { value: 'personal', label: 'Personal Loan', icon: Wallet },
  { value: 'vehicle', label: 'Vehicle Loan', icon: Car },
  { value: 'credit-card', label: 'Credit Card', icon: CreditCard },
] as const;

export function Step4Loans() {
  const { data, addLoan, removeLoan, getTotalEMI } = useFinance();
  const { loans } = data;
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [newLoan, setNewLoan] = useState<Omit<Loan, 'id'>>({
    type: 'personal',
    emiAmount: 0,
    interestRate: 0,
    remainingTenure: 12,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAddLoan = () => {
    if (newLoan.emiAmount > 0) {
      addLoan(newLoan);
      setNewLoan({
        type: 'personal',
        emiAmount: 0,
        interestRate: 0,
        remainingTenure: 12,
      });
      setShowAddLoan(false);
    }
  };

  const getLoanIcon = (type: Loan['type']) => {
    const option = loanTypeOptions.find(o => o.value === type);
    return option?.icon || CreditCard;
  };

  const getLoanLabel = (type: Loan['type']) => {
    const option = loanTypeOptions.find(o => o.value === type);
    return option?.label || type;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 finpilot-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">Loans & EMIs</h2>
        <p className="text-muted-foreground mt-2">Track your liabilities</p>
      </div>

      {/* Total EMI Summary */}
      <div className="bg-gradient-to-br from-warning/10 to-destructive/10 rounded-2xl p-5 border border-warning/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Monthly EMI</p>
            <p className="text-2xl font-bold text-warning">
              {formatCurrency(getTotalEMI())}
            </p>
          </div>
          <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-warning" />
          </div>
        </div>
      </div>

      {/* Existing Loans */}
      {loans.length > 0 && (
        <div className="space-y-3">
          {loans.map((loan) => {
            const Icon = getLoanIcon(loan.type);
            return (
              <div
                key={loan.id}
                className="finpilot-card p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{getLoanLabel(loan.type)}</h4>
                  <p className="text-sm text-muted-foreground">
                    {loan.remainingTenure} months remaining
                    {loan.interestRate ? ` • ${loan.interestRate}% interest` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatCurrency(loan.emiAmount)}/mo</p>
                </div>
                <button
                  onClick={() => removeLoan(loan.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Loan Form */}
      {showAddLoan ? (
        <div className="finpilot-card p-5 space-y-5">
          <h4 className="font-semibold text-foreground">Add New Loan/EMI</h4>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Loan Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {loanTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setNewLoan({ ...newLoan, type: option.value })}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      newLoan.type === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${newLoan.type === option.value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">EMI Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={newLoan.emiAmount || ''}
                  onChange={(e) => setNewLoan({ ...newLoan, emiAmount: parseInt(e.target.value) || 0 })}
                  placeholder="10000"
                  className="finpilot-input pl-8"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Interest Rate (%)</label>
              <input
                type="number"
                value={newLoan.interestRate || ''}
                onChange={(e) => setNewLoan({ ...newLoan, interestRate: parseFloat(e.target.value) || 0 })}
                placeholder="12"
                step="0.5"
                className="finpilot-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Remaining Tenure (months)</label>
            <input
              type="number"
              value={newLoan.remainingTenure}
              onChange={(e) => setNewLoan({ ...newLoan, remainingTenure: parseInt(e.target.value) || 0 })}
              placeholder="24"
              className="finpilot-input"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAddLoan(false)}
              className="finpilot-button-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleAddLoan}
              className="finpilot-button-primary flex-1"
            >
              Add Loan
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddLoan(true)}
          className="w-full p-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Loan or EMI
        </button>
      )}

      {loans.length === 0 && !showAddLoan && (
        <p className="text-center text-muted-foreground py-4">
          No loans or EMIs added. That's great! 🎉
        </p>
      )}
    </div>
  );
}
