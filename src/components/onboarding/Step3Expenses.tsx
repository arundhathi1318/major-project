import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Receipt, Plus, X } from 'lucide-react';

export function Step3Expenses() {
  const { data, updateExpense, addExpenseCategory } = useFinance();
  const { expenses } = data;
  const [showAddNew, setShowAddNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📌');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addExpenseCategory(newCategoryName, newCategoryIcon);
      setNewCategoryName('');
      setNewCategoryIcon('📌');
      setShowAddNew(false);
    }
  };

  const iconOptions = ['📌', '🎁', '💼', '🏋️', '🎨', '🐾', '💊', '✈️', '🎓', '🍕'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 finpilot-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">Monthly Expenses</h2>
        <p className="text-muted-foreground mt-2">Track where your money goes</p>
      </div>

      {/* Total Summary */}
      <div className="bg-gradient-to-br from-destructive/10 to-warning/10 rounded-2xl p-5 border border-destructive/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Monthly Expenses</p>
            <p className="text-2xl font-bold text-destructive">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
            <Receipt className="w-6 h-6 text-destructive" />
          </div>
        </div>
      </div>

      {/* Expense Categories */}
      <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="finpilot-card p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-xl">
              {expense.icon}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground">
                {expense.name}
              </label>
            </div>
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
              <input
                type="number"
                value={expense.amount || ''}
                onChange={(e) => updateExpense(expense.id, parseInt(e.target.value) || 0)}
                placeholder="0"
                className="finpilot-input pl-7 py-2 text-right text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add New Category */}
      {showAddNew ? (
        <div className="finpilot-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Add New Category</h4>
            <button
              onClick={() => setShowAddNew(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-2 flex-wrap">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setNewCategoryIcon(icon)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                    newCategoryIcon === icon
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="finpilot-input flex-1"
            />
            <button
              onClick={handleAddCategory}
              className="finpilot-button-primary"
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddNew(true)}
          className="w-full p-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Category
        </button>
      )}
    </div>
  );
}
