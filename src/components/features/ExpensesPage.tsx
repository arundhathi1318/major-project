import { useFinance } from "@/contexts/FinanceContext";
import { Pie, Cell, ResponsiveContainer, Tooltip, PieChart as RechartsChart } from 'recharts';
import { Download, PieChart, ShieldCheck, AlertCircle } from 'lucide-react';

export function ExpensesPage() {
  const { data } = useFinance();
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#94a3b8'];

  const chartData = data.expenses
    .filter(e => e.amount > 0)
    .map(e => ({ name: e.name, value: e.amount }));

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Expense Analytics</h1>
          <p className="text-slate-500">Visualizing where your money flows this month.</p>
        </div>
        <button className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl font-bold text-sm shadow-sm flex items-center gap-2 hover:bg-slate-50">
          <Download size={16} /> Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Pie Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm h-[450px] flex flex-col items-center">
          <h3 className="font-bold w-full mb-4 flex items-center gap-2 text-slate-700"><PieChart size={20} className="text-indigo-600"/> Category Split</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsChart>
              <Pie data={chartData} innerRadius={90} outerRadius={120} paddingAngle={8} dataKey="value" stroke="none">
                {chartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '15px', border: 'none'}} />
            </RechartsChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Expense List */}
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-700">Detailed Breakdown</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">
              <ShieldCheck size={12}/> {data.analysis?.isAnalyzed ? 'PDF Verified' : 'Manual Entry'}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {data.expenses.filter(e => e.amount > 0).map((exp, i) => (
              <div key={exp.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-200 hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100">
                    {exp.icon}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{exp.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Variable Expense</p>
                  </div>
                </div>
                <p className="text-lg font-black text-slate-900">₹{exp.amount.toLocaleString()}</p>
              </div>
            ))}
            
            {chartData.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-10 opacity-30">
                  <AlertCircle size={48} />
                  <p className="font-bold">No data found for this month.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}