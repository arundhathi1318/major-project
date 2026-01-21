import { useFinance } from '@/contexts/FinanceContext';
import { Wallet, TrendingUp, Calendar } from 'lucide-react';

export function Step2Income() {
  const { data, updateIncome } = useFinance();
  const { income } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 finpilot-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">Income Details</h2>
        <p className="text-muted-foreground mt-2">Tell us about your earnings</p>
      </div>

      <div className="grid gap-6">
        <div className="finpilot-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Primary Income</h3>
              <p className="text-sm text-muted-foreground">Your main source of income</p>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <input
              type="number"
              value={income.primaryIncome || ''}
              onChange={(e) => updateIncome({ primaryIncome: parseInt(e.target.value) || 0 })}
              placeholder="50000"
              className="finpilot-input pl-8"
            />
          </div>
          {income.primaryIncome > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {formatCurrency(income.primaryIncome)} per month
            </p>
          )}
        </div>

        <div className="finpilot-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Secondary Income</h3>
              <p className="text-sm text-muted-foreground">Freelance, rental, investments, etc.</p>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <input
              type="number"
              value={income.secondaryIncome || ''}
              onChange={(e) => updateIncome({ secondaryIncome: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="finpilot-input pl-8"
            />
          </div>
        </div>

        <div className="finpilot-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Income Frequency</h3>
              <p className="text-sm text-muted-foreground">How often do you receive income?</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateIncome({ incomeFrequency: 'monthly' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                income.incomeFrequency === 'monthly'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
            >
              <span className="font-medium">Monthly</span>
              <p className="text-xs text-muted-foreground mt-1">Regular salary</p>
            </button>
            <button
              type="button"
              onClick={() => updateIncome({ incomeFrequency: 'irregular' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                income.incomeFrequency === 'irregular'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
            >
              <span className="font-medium">Irregular</span>
              <p className="text-xs text-muted-foreground mt-1">Variable income</p>
            </button>
          </div>
        </div>

        {/* Total Income Summary */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Monthly Income</p>
              <p className="text-3xl font-bold finpilot-gradient-text">
                {formatCurrency(income.primaryIncome + income.secondaryIncome)}
              </p>
            </div>
            <div className="w-12 h-12 finpilot-gradient rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
