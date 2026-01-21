import { useFinance } from '@/contexts/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function IncomeExpenseChart() {
  const { data, getTotalExpenses, getTotalEMI, getNetSavings } = useFinance();
  
  const totalIncome = data.income.primaryIncome + data.income.secondaryIncome;
  const totalExpenses = getTotalExpenses();
  const totalEMI = getTotalEMI();
  const netSavings = getNetSavings();

  const chartData = [
    { name: 'Income', value: totalIncome, color: 'hsl(173, 58%, 39%)' },
    { name: 'Expenses', value: totalExpenses, color: 'hsl(0, 72%, 51%)' },
    { name: 'EMIs', value: totalEMI, color: 'hsl(38, 92%, 50%)' },
    { name: 'Savings', value: Math.max(0, netSavings), color: 'hsl(142, 70%, 45%)' },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}K`;
    }
    return `₹${value}`;
  };

  const formatFullCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="finpilot-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Overview</h3>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip
              formatter={(value: number) => formatFullCurrency(value)}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '8px 12px',
              }}
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary below chart */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Net Monthly Savings</span>
          <span className={`text-lg font-bold ${netSavings >= 0 ? 'text-success' : 'text-destructive'}`}>
            {formatFullCurrency(netSavings)}
          </span>
        </div>
        {netSavings < 0 && (
          <p className="text-sm text-destructive mt-2">
            ⚠ You're spending more than you earn. Consider reducing expenses.
          </p>
        )}
      </div>
    </div>
  );
}
