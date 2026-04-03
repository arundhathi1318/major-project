import React, { useState } from 'react';
import { useFinance } from "@/contexts/FinanceContext";
import { Target, TrendingUp, Calendar, AlertCircle, ArrowUpRight, Plus, ExternalLink, X } from "lucide-react";

export function GoalsPage() {
  const { data, getNetSavings, addGoal } = useFinance(); // Assuming addGoal exists in your context
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ type: '', targetAmount: 0, timeframe: 'mid-term' });

  const goals = data.savings.goals;
  const currentSavings = data.savings.currentSavings;
  const netMonthlySavings = getNetSavings();

  const handleRedirect = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddGoal = () => {
    if (newGoal.type && newGoal.targetAmount > 0) {
      // Logic to call your context function
      if (addGoal) addGoal(newGoal);
      setShowAddForm(false);
      setNewGoal({ type: '', targetAmount: 0, timeframe: 'mid-term' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Goals</h1>
          <p className="text-slate-500 font-medium">Turning your dreams into mathematical reality.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Goals List */}
        <div className="lg:col-span-2 space-y-6">
          {showAddForm && (
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 relative">
              <button onClick={() => setShowAddForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><X /></button>
              <h3 className="text-xl font-bold mb-6">Set a New Target</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Goal Name (e.g. New Car)" 
                  className="bg-white/10 border-none rounded-xl p-4 text-white outline-none focus:ring-2 ring-blue-500"
                  onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                />
                <input 
                  type="number" placeholder="Target Amount (₹)" 
                  className="bg-white/10 border-none rounded-xl p-4 text-white outline-none focus:ring-2 ring-blue-500"
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: Number(e.target.value)})}
                />
                <select 
                  className="bg-white/10 border-none rounded-xl p-4 text-white outline-none focus:ring-2 ring-blue-500"
                  onChange={(e) => setNewGoal({...newGoal, timeframe: e.target.value as any})}
                >
                  <option value="short-term" className="text-slate-900">Short Term (1yr)</option>
                  <option value="mid-term" className="text-slate-900">Mid Term (3yr)</option>
                  <option value="long-term" className="text-slate-900">Long Term (5yr+)</option>
                </select>
                <button onClick={handleAddGoal} className="bg-blue-500 hover:bg-blue-400 py-4 rounded-xl font-black uppercase tracking-widest transition-colors">Create Goal</button>
              </div>
            </div>
          )}

          {goals.map((goal, idx) => {
            const progress = Math.min(100, Math.round((currentSavings / goal.targetAmount) * 100));
            const monthsLeft = goal.timeframe === 'short-term' ? 12 : goal.timeframe === 'mid-term' ? 36 : 60;
            const monthlyNeeded = Math.round((goal.targetAmount - currentSavings) / monthsLeft);

            return (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                  <div className="flex gap-5">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Target size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">{goal.type}</h3>
                      <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">{goal.timeframe}</p>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</p>
                    <p className="text-3xl font-black text-slate-900">₹{goal.targetAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                    <span>Progress</span>
                    <span className="text-blue-600">{progress}% Saved</span>
                  </div>
                  <div className="h-4 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Monthly Commitment</p>
                    <p className="text-xl font-black text-slate-800">₹{monthlyNeeded.toLocaleString()} <span className="text-xs font-medium opacity-50">/ month</span></p>
                  </div>
                  <button 
                    onClick={() => handleRedirect('https://www.phonepe.com/wealth-management/mutual-funds/sip/')}
                    className="w-full md:w-auto bg-white border-2 border-blue-100 text-blue-600 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    Start SIP <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Strategy */}
        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <TrendingUp size={40} className="absolute -right-4 -top-4 opacity-20 rotate-12" />
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <TrendingUp size={22} /> AI Strategy
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed font-medium mb-8">
              Based on your current surplus of <span className="text-white font-black">₹{getNetSavings().toLocaleString()}</span>, you are {getNetSavings() >= 10000 ? 'On Track' : 'Slightly Behind'} for your primary goal.
            </p>
            <button 
               onClick={() => handleRedirect('https://groww.in/calculators/sip-calculator')}
               className="w-full py-4 bg-white/10 border border-white/20 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
               Calculate Returns <ArrowUpRight size={16} />
            </button>
          </div>

          <div 
            onClick={() => handleRedirect('https://www.cleartax.in/s/best-sip-plans')}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Best SIP Plans 2025</h4>
                <p className="text-xs text-slate-400">View curated list by experts</p>
              </div>
              <ArrowUpRight size={20} className="text-slate-300 group-hover:text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}