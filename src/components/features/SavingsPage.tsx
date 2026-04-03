import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Wallet, Trophy, TrendingUp, ArrowUpRight, ExternalLink } from 'lucide-react';

export function SavingsPage() {
  const { data, getNetSavings } = useFinance();
  const surplus = getNetSavings();
  const savingsRate = Math.round((surplus / (data.income.primaryIncome + data.income.secondaryIncome)) * 100);

  // Helper function for external redirects
  const handleRedirect = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
          <Wallet size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Savings</h1>
          <p className="text-slate-500 text-sm">Simple ways to grow your money safely.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Money Left Over - Redirects to a Budgeting Guide */}
        <div 
          onClick={() => handleRedirect('https://www.cleartax.in/s/80c-deductions')}
          className="bg-white p-6 rounded-3xl border shadow-sm cursor-pointer hover:border-green-500 transition-colors group"
        >
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Money Left Over</p>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">₹{surplus.toLocaleString()}</h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            You save {savingsRate}% of income <ExternalLink size={10} />
          </p>
        </div>

        {/* Total Saved - Redirects to PhonePe Wealth */}
        <div 
          onClick={() => handleRedirect('https://www.phonepe.com/wealth-management/')}
          className="bg-white p-6 rounded-3xl border shadow-sm cursor-pointer hover:border-blue-500 transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Saved So Far</p>
            <Trophy size={16} className="text-blue-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">₹{data.savings.currentSavings.toLocaleString()}</h2>
          <p className="text-xs text-slate-400 mt-1">Manage on PhonePe</p>
        </div>

        {/* Suggested Saving - Redirects to HDFC RD Page */}
        <div 
          onClick={() => handleRedirect('https://www.hdfcbank.com/personal/save/deposits/recurring-deposit')}
          className="bg-white p-6 rounded-3xl border shadow-sm cursor-pointer hover:border-indigo-500 transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggested Saving</p>
            <ArrowUpRight size={16} className="text-indigo-500" />
          </div>
          <h2 className="text-3xl font-black text-indigo-600">₹{Math.round(surplus * 0.5).toLocaleString()}</h2>
          <p className="text-xs text-slate-400 mt-1">Open a Bank RD</p>
        </div>
      </div>

      {/* SIP Suggestion Box */}
      <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp size={22} /> Easy Saving Tip
            </h3>
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Recommended</span>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-black">Start a Recurring Deposit (RD) or SIP.</p>
            <p className="text-indigo-100 opacity-90 leading-relaxed max-w-2xl">
              You have extra money (₹{surplus}) left this month. We suggest you automatically save <span className="text-yellow-300 font-black">₹{Math.round(surplus * 0.5)}</span> every month. It grows over time!
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Redirect to PhonePe Wealth/SIP Section */}
            <button 
              onClick={() => handleRedirect('https://www.phonepe.com/wealth-management/mutual-funds/sip/')}
              className="bg-white text-indigo-600 px-10 py-3 rounded-xl font-black shadow-lg hover:bg-slate-50 transition-transform active:scale-95"
            >
              Start Saving on PhonePe
            </button>

            {/* Redirect to Groww SIP Calculator */}
            <button 
              onClick={() => handleRedirect('https://groww.in/calculators/sip-calculator')}
              className="bg-indigo-500/30 text-white border border-white/20 px-10 py-3 rounded-xl font-black backdrop-blur-md hover:bg-indigo-500/50 transition-transform active:scale-95"
            >
              Calculate Returns
            </button>
          </div>
        </div>
        
        {/* Decorative Background Circles */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}