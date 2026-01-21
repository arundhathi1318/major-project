import { useFinance } from '@/contexts/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = [
  'hsl(173, 58%, 39%)',
  'hsl(160, 60%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 51%)',
  'hsl(220, 70%, 50%)',
  'hsl(280, 60%, 50%)',
  'hsl(45, 80%, 50%)',
  'hsl(190, 70%, 40%)',
  'hsl(330, 60%, 50%)',
  'hsl(100, 50%, 40%)',
  'hsl(200, 50%, 50%)',
];

export function ExpenseChart() {
  const { data } = useFinance();
  
  const chartData = data.expenses
    .filter(exp => exp.amount > 0)
    .map(exp => ({
      name: exp.name,
      value: exp.amount,
      icon: exp.icon,
    }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (chartData.length === 0) {
    return (
      <div className="finpilot-card p-6 h-full flex flex-col items-center justify-center">
        <p className="text-muted-foreground text-center">
          No expense data yet. Add your monthly expenses to see the breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="finpilot-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Expense Breakdown</h3>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '8px 12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2 max-h-[150px] overflow-y-auto">
        {chartData.slice(0, 5).map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-muted-foreground">{item.icon} {item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{formatCurrency(item.value)}</span>
              <span className="text-xs text-muted-foreground">
                ({((item.value / total) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
