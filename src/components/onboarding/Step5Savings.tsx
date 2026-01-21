import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { PiggyBank, Target, Plus, Trash2, Plane, GraduationCap, Home, Heart, Sunset } from 'lucide-react';
import type { FinancialGoal } from '@/types/finance';

const goalTypeOptions = [
  { value: 'travel', label: 'Travel', icon: Plane },
  { value: 'education', label: 'Education', icon: GraduationCap },
  { value: 'home', label: 'Home', icon: Home },
  { value: 'marriage', label: 'Marriage', icon: Heart },
  { value: 'retirement', label: 'Retirement', icon: Sunset },
  { value: 'other', label: 'Other', icon: Target },
] as const;

export function Step5Savings() {
  const { data, updateSavings } = useFinance();
  const { savings } = data;
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<FinancialGoal, 'id'>>({
    name: '',
    type: 'other',
    targetAmount: 0,
    currentAmount: 0,
    timeframe: 'mid-term',
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount > 0) {
      const goal: FinancialGoal = {
        ...newGoal,
        id: Date.now().toString(),
      };
      updateSavings({ goals: [...savings.goals, goal] });
      setNewGoal({
        name: '',
        type: 'other',
        targetAmount: 0,
        currentAmount: 0,
        timeframe: 'mid-term',
      });
      setShowAddGoal(false);
    }
  };

  const removeGoal = (id: string) => {
    updateSavings({ goals: savings.goals.filter(g => g.id !== id) });
  };

  const getGoalIcon = (type: FinancialGoal['type']) => {
    const option = goalTypeOptions.find(o => o.value === type);
    return option?.icon || Target;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 finpilot-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
          <PiggyBank className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">Savings & Goals</h2>
        <p className="text-muted-foreground mt-2">Plan for your financial future</p>
      </div>

      {/* Current Savings */}
      <div className="finpilot-card p-5">
        <h4 className="font-semibold text-foreground mb-4">Current Savings</h4>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
          <input
            type="number"
            value={savings.currentSavings || ''}
            onChange={(e) => updateSavings({ currentSavings: parseInt(e.target.value) || 0 })}
            placeholder="100000"
            className="finpilot-input pl-8 text-lg"
          />
        </div>
      </div>

      {/* Emergency Fund */}
      <div className="finpilot-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground">Emergency Fund</h4>
            <p className="text-sm text-muted-foreground">Do you have 3-6 months of expenses saved?</p>
          </div>
          <button
            onClick={() => updateSavings({ hasEmergencyFund: !savings.hasEmergencyFund })}
            className={`w-14 h-8 rounded-full transition-colors ${
              savings.hasEmergencyFund ? 'bg-success' : 'bg-muted'
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                savings.hasEmergencyFund ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Financial Goals */}
      <div>
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Financial Goals
        </h4>

        {savings.goals.length > 0 && (
          <div className="space-y-3 mb-4">
            {savings.goals.map((goal) => {
              const Icon = getGoalIcon(goal.type);
              const progress = goal.targetAmount > 0 
                ? (goal.currentAmount / goal.targetAmount) * 100 
                : 0;
              
              return (
                <div key={goal.id} className="finpilot-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-foreground">{goal.name}</h5>
                        <button
                          onClick={() => removeGoal(goal.id)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">{goal.timeframe.replace('-', ' ')}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{formatCurrency(goal.currentAmount)}</span>
                          <span className="text-foreground">{formatCurrency(goal.targetAmount)}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showAddGoal ? (
          <div className="finpilot-card p-5 space-y-4">
            <h5 className="font-medium text-foreground">Add New Goal</h5>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Goal Name</label>
              <input
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="e.g., Europe Trip 2025"
                className="finpilot-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Goal Type</label>
              <div className="grid grid-cols-3 gap-2">
                {goalTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setNewGoal({ ...newGoal, type: option.value })}
                      className={`p-2 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                        newGoal.type === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${newGoal.type === option.value ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Target Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={newGoal.targetAmount || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseInt(e.target.value) || 0 })}
                    placeholder="500000"
                    className="finpilot-input pl-8"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Saved So Far</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={newGoal.currentAmount || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: parseInt(e.target.value) || 0 })}
                    placeholder="50000"
                    className="finpilot-input pl-8"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Timeframe</label>
              <div className="grid grid-cols-3 gap-2">
                {(['short-term', 'mid-term', 'long-term'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setNewGoal({ ...newGoal, timeframe: tf })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      newGoal.timeframe === tf
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-sm font-medium capitalize">{tf.replace('-', ' ')}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {tf === 'short-term' ? '6-12 mo' : tf === 'mid-term' ? '1-3 yrs' : '5+ yrs'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddGoal(false)}
                className="finpilot-button-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                className="finpilot-button-primary flex-1"
              >
                Add Goal
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddGoal(true)}
            className="w-full p-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Financial Goal
          </button>
        )}
      </div>
    </div>
  );
}
