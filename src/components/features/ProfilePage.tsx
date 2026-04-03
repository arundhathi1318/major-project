import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { User, Mail, Briefcase, IndianRupee, Save, CheckCircle2, Shield } from 'lucide-react';

export function ProfilePage() {
  const { data, updateProfile, updateIncome } = useFinance();
  
  const [formData, setFormData] = useState({
    fullName: data.profile.fullName,
    email: "alex@example.com", // Placeh
    employmentType: data.profile.employmentType,
    primaryIncome: data.income.primaryIncome
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // 1. Update Profile info
    updateProfile({
      fullName: formData.fullName,
      employmentType: formData.employmentType
    });

    // 2. Update Income info
    updateIncome({
      primaryIncome: Number(formData.primaryIncome)
    });

    // 3. Show Success Feedback
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); // Hide after 3 seconds
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
            <User size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Profile Settings</h1>
            <p className="text-slate-500 text-sm font-medium">Manage your personal and financial identity.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-12">
        
        {/* Section: Personal Info */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
            <Shield size={18} className="text-indigo-600" />
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Personal Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Full Name */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-100 outline-none transition-all font-semibold text-slate-700" 
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-100 outline-none transition-all font-semibold text-slate-700 text-sm" 
                />
              </div>
            </div>

            {/* Employment */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase ml-1">Employment Type</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="e.g., student, salaried, self-employed, freelancer"
                  value={formData.employmentType}
                  onChange={(e) => setFormData({
                    ...formData,
                    employmentType: e.target.value as "student" | "salaried" | "self-employed" | "freelancer"
                  })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-100 outline-none transition-all font-semibold text-slate-700" 
                />
              </div>
            </div>

            {/* Income */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase ml-1">Monthly Income (₹)</label>
              <div className="relative group">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="number"
                  placeholder="Enter monthly income"
                  value={formData.primaryIncome}
                  onChange={(e) => setFormData({...formData, primaryIncome: Number(e.target.value)})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-100 outline-none transition-all font-black text-indigo-600 text-lg" 
                />
              </div>
            </div>

          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 flex items-center gap-4">
          <button 
            onClick={handleSave}
            disabled={isSaved}
            className={`
              flex items-center gap-3 px-10 py-4 rounded-2xl font-black transition-all active:scale-95
              ${isSaved 
                ? 'bg-emerald-500 text-white shadow-emerald-100' 
                : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200'}
            `}
          >
            {isSaved ? <CheckCircle2 size={20} /> : <Save size={20} />}
            {isSaved ? 'Changes Saved!' : 'Save Profile'}
          </button>
          
          {isSaved && (
            <p className="text-emerald-600 font-bold text-sm animate-in fade-in slide-in-from-left-2">
              Your financial context was updated successfully.
            </p>
          )}
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400">
          <Shield size={20} />
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Your data is used locally to provide financial insights. We never share your income or personal details with third-party trackers.
        </p>
      </div>
    </div>
  );
}