import { useFinance } from '@/contexts/FinanceContext';
import { StatCard } from './StatCard';
import { HealthScore } from './HealthScore';
import { ExpenseChart } from './ExpenseChart';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { SavingsProgress } from './SavingsProgress';
import { Chatbot } from './Chatbot';
import { Wallet, Receipt, CreditCard, PiggyBank } from 'lucide-react';

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
    <div className="animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Welcome back, {data.profile.fullName.split(' ')[0] || 'User'}! 👋
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Here's your financial overview for this month.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          subtitle="Monthly Earnings"
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <IncomeExpenseChart />
        </div>
        <div>
          <HealthScore />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExpenseChart />
        <SavingsProgress />
      </div>

      {/* Alerts Section */}
      {(netSavings < 0 || totalEMI > totalIncome * 0.4) && (
        <div className="mt-8 p-6 rounded-[2rem] bg-amber-50 border border-amber-100">
          <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
            ⚠️ Financial Action Required
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            {netSavings < 0 && (
              <li className="flex items-start gap-2 text-red-600">
                <span>•</span>
                <span>You are currently in a deficit. Review your discretionary spending.</span>
              </li>
            )}
            {totalEMI > totalIncome * 0.4 && (
              <li className="flex items-start gap-2 text-amber-700">
                <span>•</span>
                <span>Your debt-to-income ratio is high ({Math.round((totalEMI/totalIncome)*100)}%). Avoid new loans.</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}