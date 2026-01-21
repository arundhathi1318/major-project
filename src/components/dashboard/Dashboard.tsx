import { useFinance } from '@/contexts/FinanceContext';
import { StatCard } from './StatCard';
import { HealthScore } from './HealthScore';
import { ExpenseChart } from './ExpenseChart';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { SavingsProgress } from './SavingsProgress';
import { Chatbot } from './Chatbot';
import { Wallet, Receipt, CreditCard, PiggyBank, Settings, User } from 'lucide-react';

export function Dashboard() {
  const { data, getTotalExpenses, getTotalEMI, getNetSavings } = useFinance();
  
  const totalIncome = data.income.primaryIncome + data.income.secondaryIncome;
  const totalExpenses = getTotalExpenses();
  const totalEMI = getTotalEMI();
  const netSavings = getNetSavings();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const savingsPercentage = totalIncome > 0 
    ? Math.round((netSavings / totalIncome) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 finpilot-gradient rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold finpilot-gradient-text">FinPilot</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-foreground">
            Welcome back, {data.profile.fullName.split(' ')[0] || 'User'}! 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's your financial overview for this month
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            subtitle="This month"
            icon={Wallet}
            variant="success"
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            subtitle={`${data.expenses.filter(e => e.amount > 0).length} categories`}
            icon={Receipt}
            variant="danger"
          />
          <StatCard
            title="EMI Payments"
            value={formatCurrency(totalEMI)}
            subtitle={`${data.loans.length} active loans`}
            icon={CreditCard}
            variant="warning"
          />
          <StatCard
            title="Net Savings"
            value={formatCurrency(netSavings)}
            subtitle={`${savingsPercentage}% savings rate`}
            icon={PiggyBank}
            variant={netSavings >= 0 ? 'success' : 'danger'}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <IncomeExpenseChart />
          </div>
          <div>
            <HealthScore />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseChart />
          <SavingsProgress />
        </div>

        {/* Alerts Section */}
        {(netSavings < 0 || totalEMI > totalIncome * 0.4) && (
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-warning/10 to-destructive/10 border border-warning/30">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              ⚠️ Financial Alerts
            </h3>
            <ul className="space-y-2 text-sm">
              {netSavings < 0 && (
                <li className="flex items-start gap-2 text-destructive">
                  <span>•</span>
                  <span>You're spending more than you earn. Consider reducing discretionary expenses.</span>
                </li>
              )}
              {totalEMI > totalIncome * 0.4 && (
                <li className="flex items-start gap-2 text-warning">
                  <span>•</span>
                  <span>Your EMI burden is over 40% of income. This may affect your financial flexibility.</span>
                </li>
              )}
              {!data.savings.hasEmergencyFund && (
                <li className="flex items-start gap-2 text-muted-foreground">
                  <span>•</span>
                  <span>Consider building an emergency fund covering 3-6 months of expenses.</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
