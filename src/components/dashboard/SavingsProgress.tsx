import { useFinance } from '@/contexts/FinanceContext';
import { Target, Plane, GraduationCap, Home, Heart, Sunset } from 'lucide-react';
import type { FinancialGoal } from '@/types/finance';

const goalIcons = {
  travel: Plane,
  education: GraduationCap,
  home: Home,
  marriage: Heart,
  retirement: Sunset,
  other: Target,
};

export function SavingsProgress() {
  const { data } = useFinance();
  const { goals } = data.savings;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (goals.length === 0) {
    return (
      <div className="finpilot-card p-6 h-full flex flex-col items-center justify-center">
        <Target className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground text-center">
          No financial goals set yet. Add goals to track your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="finpilot-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Savings Goals</h3>
      
      <div className="space-y-4">
        {goals.map((goal) => {
          const Icon = goalIcons[goal.type];
          const progress = goal.targetAmount > 0 
            ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
            : 0;
          const remaining = goal.targetAmount - goal.currentAmount;

          return (
            <div key={goal.id} className="p-4 rounded-xl bg-gradient-to-br from-background to-secondary/20 border border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground truncate">{goal.name}</h4>
                    <span className="text-sm font-semibold text-primary">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{formatCurrency(goal.currentAmount)} saved</span>
                    <span>{formatCurrency(remaining)} to go</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
