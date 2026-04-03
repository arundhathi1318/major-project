import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Zap, AlertCircle, TrendingDown, ShieldCheck, ArrowRight, Calendar, ExternalLink, Banknote, Landmark } from 'lucide-react';

export function TipsPage() {
  const { data } = useFinance();

  // Helper for redirects
  const handleRedirect = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
          <Zap size={28} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Smart Actions</h1>
          <p className="text-slate-500 text-sm font-medium">Daily insights tailored to your cashflow.</p>
        </div>
      </div>

      {/* SECTION 1: URGENT ALERTS (LIST STYLE) */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Critical Alerts</h3>
        
        {/* EMI Alert - Red Glassmorphism */}
        <div className="group bg-white p-5 rounded-[2rem] border-2 border-red-50 hover:border-red-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                 <Calendar size={22} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">EMI due in 4 days</p>
                <p className="text-xs text-slate-500">₹{data.loans[0]?.emiAmount || 15000} for {data.loans[0]?.type || 'Home Loan'}.</p>
              </div>
           </div>
           <button 
             onClick={() => handleRedirect('https://www.phonepe.com/consumers/financial-services/loan-repayment/')}
             className="w-full md:w-auto text-xs font-black bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
           >
             PAY NOW <ExternalLink size={14} />
           </button>
        </div>

        {/* Bank Alert - Blue/Landmark */}
        <div className="group bg-white p-5 rounded-[2rem] border-2 border-blue-50 hover:border-blue-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                 <Landmark size={22} />
              </div>
              <p className="text-sm font-medium text-slate-700 max-w-md">
                 Multiple bills detected this week. Ensure your account ending in <span className="font-bold">**4291</span> is funded.
              </p>
           </div>
           <button 
             onClick={() => handleRedirect('https://www.onlinesbi.sbi/')}
             className="w-full md:w-auto text-xs font-bold text-blue-600 border-2 border-blue-100 px-6 py-3 rounded-xl hover:bg-blue-50 transition-all"
           >
             CHECK BANK
           </button>
        </div>
      </div>

      {/* SECTION 2: INSIGHTS & STRATEGY (BENTO GRID STYLE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Spending Card - Indigo */}
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl shadow-indigo-100">
           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <TrendingDown size={24} />
           </div>
           <div className="space-y-2">
              <h4 className="text-xl font-bold">Limit Dining Out</h4>
              <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                 You've spent 20% more on restaurants. Aim for a <span className="font-black text-white underline decoration-yellow-400">₹2,000 limit</span> next month to save ₹30k/year.
              </p>
           </div>
           <button 
             onClick={() => handleRedirect('https://www.cleartax.in/s/budget-planning-income-tax')}
             className="bg-white text-indigo-600 text-xs font-black px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2"
           >
             SET BUDGET <ArrowRight size={14} />
           </button>
        </div>

        {/* Savings Card - Emerald */}
        <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 flex flex-col justify-between items-start space-y-6">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600">
              <ShieldCheck size={24} />
           </div>
           <div className="space-y-2">
              <h4 className="text-xl font-bold text-emerald-900">Idle Cash Detected</h4>
              <p className="text-emerald-700/70 text-sm leading-relaxed">
                 Move your ₹5,000 surplus to an <span className="font-bold">Emergency Fund</span>. We recommend liquid mutual funds for safety + returns.
              </p>
           </div>
           <button 
             onClick={() => handleRedirect('https://groww.in/mutual-funds/category/liquid-funds')}
             className="text-emerald-700 text-xs font-black flex items-center gap-2 group"
           >
             INVEST NOW <span className="group-hover:translate-x-1 transition-transform">→</span>
           </button>
        </div>

      </div>

      {/* SECTION 3: FOOTER RESOURCE (MINIMALIST STYLE) */}
      <div 
        onClick={() => handleRedirect('https://www.rbi.org.in/commonman/English/Scripts/FinancialEducation.aspx')}
        className="bg-slate-50 border border-slate-200 p-6 rounded-[2rem] flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Banknote size={18} />
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm">Financial Education</p>
            <p className="text-slate-500 text-xs">Read official RBI guides on saving and fraud protection.</p>
          </div>
        </div>
        <ArrowRight size={20} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
      </div>

    </div>
  );
}