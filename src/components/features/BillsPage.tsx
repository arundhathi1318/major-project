import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Zap, Activity, PieChart as PieIcon } from 'lucide-react';

export function BillsPage() {
  const { data } = useFinance();
  const totalBills = data.expenses.reduce((a, b) => a + b.amount, 0);
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
          <Zap size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bills & Recharge</h1>
          <p className="text-slate-500 text-sm">See your recurring payments like rent, electricity, and mobile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Monthly Bills</p>
            <h2 className="text-3xl font-black text-slate-900">₹{totalBills.toLocaleString()}</h2>
            <p className="text-xs text-slate-400">Total to pay this month</p>
          </div>
          <div className="text-blue-500 text-2xl font-bold italic">₹</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill Health</p>
            <h2 className="text-3xl font-black text-green-500">Good</h2>
            <p className="text-xs text-slate-400">3 ways to save found</p>
          </div>
          <Activity size={32} className="text-green-500 opacity-20" />
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="h-[280px] flex flex-col items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.expenses} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="amount">
                {data.expenses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
            <p className="text-xl font-black text-slate-900">₹{totalBills}</p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-bold flex items-center gap-2"><PieIcon size={18} /> Spending Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.expenses.map((exp, i) => (
              <div key={i} className="bg-slate-50 p-3 px-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                   <span className="text-xs font-bold text-slate-600">{exp.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">₹{exp.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}