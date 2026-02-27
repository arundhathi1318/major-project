import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { User, Mail, Briefcase, IndianRupee, Save } from 'lucide-react';

export function ProfilePage() {
  const { data, updateProfile, updateIncome } = useFinance();

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
          <User size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profile & Settings</h1>
          <p className="text-slate-500 text-sm">Update your personal details and account preferences.</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border shadow-sm space-y-10">
        <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500">Full Name</label>
            <input 
              placeholder="Enter your full name"
              className="w-full p-4 bg-slate-50 rounded-2xl border-none text-slate-700 outline-none focus:ring-2 ring-indigo-200" 
              defaultValue={data.profile.fullName} 
              onChange={(e) => updateProfile({ fullName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500">Email Address</label>
            <input 
              placeholder="Enter your email"
              className="w-full p-4 bg-slate-50 rounded-2xl border-none text-slate-700 outline-none focus:ring-2 ring-indigo-200" 
              defaultValue="alex@example.com" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500">Employment</label>
            <input 
              placeholder="Enter employment type"
              className="w-full p-4 bg-slate-50 rounded-2xl border-none text-slate-700 outline-none focus:ring-2 ring-indigo-200" 
              defaultValue={data.profile.employmentType} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500">Monthly Income (₹)</label>
            <input 
              placeholder="Enter monthly income"
              className="w-full p-4 bg-slate-50 rounded-2xl border-none text-slate-700 outline-none focus:ring-2 ring-indigo-200 font-bold" 
              defaultValue={data.income.primaryIncome} 
              onChange={(e) => updateIncome({ primaryIncome: Number(e.target.value) })}
            />
          </div>
        </div>

        <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );
}