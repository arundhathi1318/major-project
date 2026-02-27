import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Zap, AlertCircle, TrendingDown, ShieldCheck, ArrowRight, Calendar } from 'lucide-react';

export function TipsPage() {
  const { data } = useFinance();

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3 text-amber-500">
        <Zap size={32} />
        <h1 className="text-3xl font-bold text-slate-900">Money Tips</h1>
      </div>
      <p className="text-slate-500 text-sm">Simple actions to save money.</p>

      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Urgent (Pay Attention)</h3>
        
        {/* Loan Alert */}
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                 <Calendar className="text-red-500" size={20} />
              </div>
              <p className="text-sm font-medium text-red-900 leading-tight">
                 Your next EMI of ₹{data.loans[0]?.emiAmount || 15000} is due in 4 days. Paying late means fines.
              </p>
           </div>
           <button className="text-xs font-bold text-red-600 px-4 py-2 hover:bg-white rounded-xl transition-all">Pay Now</button>
        </div>

        {/* Multi-Bill Alert */}
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                 <AlertCircle className="text-red-500" size={20} />
              </div>
              <p className="text-sm font-medium text-red-900 leading-tight">
                 You have two bills due same week. Check if you have enough balance.
              </p>
           </div>
           <button className="text-xs font-bold text-red-600 px-4 py-2 hover:bg-white rounded-xl transition-all">Check Bank</button>
        </div>

        {/* Spending Alert */}
        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                 <TrendingDown className="text-orange-500" size={20} />
              </div>
              <p className="text-sm font-medium text-orange-900 leading-tight">
                 You spent 20% more on Eating Out. Set a limit of ₹2000 for next month.
              </p>
           </div>
           <button className="text-xs font-bold text-orange-600 px-4 py-2 hover:bg-white rounded-xl transition-all">Set Limit</button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Savings Ideas</h3>
        <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-500"><ShieldCheck /></div>
              <p className="text-sm font-medium text-green-900 leading-tight">
                 You have ₹5,000 extra cash. Put ₹3,000 in your Emergency Fund.
              </p>
           </div>
           <button className="text-xs font-bold text-green-600 px-4 py-2 hover:bg-white rounded-xl transition-all">Save Now</button>
        </div>
      </div>
    </div>
  );
}