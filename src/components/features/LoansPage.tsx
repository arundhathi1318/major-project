import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Landmark, Calendar, CreditCard, Info, ChevronRight, Calculator } from 'lucide-react';

export function LoansPage() {
  const { data } = useFinance();
  const [extraAmount, setExtraAmount] = useState<number>(0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
          <Calendar size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Loans & EMIs</h1>
          <p className="text-slate-500 text-sm">Track money you borrowed and your monthly payments.</p>
        </div>
      </div>

      {/* Loan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.loans.length > 0 ? data.loans.map((loan, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-xl">
                  🏠
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{loan.type}</h3>
                  <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mt-1">PAY SOON</p>
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">₹{loan.emiAmount.toLocaleString()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                <span>50% Paid</span>
                <span>Next: 2025-12-05</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-1/2 rounded-full" />
              </div>
            </div>

            <button className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              Pay Now
            </button>
          </div>
        )) : (
          <div className="col-span-2 py-10 text-center bg-slate-50 rounded-3xl border border-dashed text-slate-400 font-medium">
            No active loans found. Check your profile settings.
          </div>
        )}
      </div>

      {/* Loan Repayment Simulator */}
      <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="text-indigo-600" />
          <h3 className="text-xl font-bold text-indigo-900">Pay Loan Faster</h3>
        </div>
        <p className="text-indigo-700/70 text-sm">See what happens if you pay a little extra every month.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="p-4 bg-white rounded-2xl border-none shadow-sm text-sm outline-none focus:ring-2 ring-indigo-300" aria-label="Select a loan">
            <option>Select an option</option>
            {data.loans.map((l, i) => <option key={i}>{l.type}</option>)}
          </select>
          <input 
            type="number" 
            placeholder="Extra Amount (₹)" 
            className="p-4 bg-white rounded-2xl border-none shadow-sm text-sm outline-none focus:ring-2 ring-indigo-300"
            onChange={(e) => setExtraAmount(Number(e.target.value))}
          />
          <button className="bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all">
            Check Saving
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-100">
          <p className="text-indigo-900 font-bold text-sm uppercase tracking-wide mb-1 text-[10px]">Result:</p>
          <p className="text-indigo-700 text-sm font-medium">
            By paying just ₹{extraAmount || 500} more, you save interest and finish your loan 6 months early!
          </p>
        </div>
      </div>
    </div>
  );
}