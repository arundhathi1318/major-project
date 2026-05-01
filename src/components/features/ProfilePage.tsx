import React, { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import {
  User,
  Mail,
  Briefcase,
  IndianRupee,
  Save,
  CheckCircle2,
  Shield,
  Wallet,
  TrendingUp
} from "lucide-react";

export function ProfilePage() {
  const {
    data,
    updateProfile,
    updateIncome,
    updateExpense
  } = useFinance();

  const [formData, setFormData] = useState({
    fullName: data.profile.fullName,
    email: localStorage.getItem("finpilot-user-email") || "",
    employmentType: data.profile.employmentType,
    primaryIncome: data.income.primaryIncome,
    secondaryIncome: data.income.secondaryIncome,
    incomeFrequency: data.income.incomeFrequency
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateProfile({
      fullName: formData.fullName,
      employmentType: formData.employmentType
    });

    updateIncome({
      primaryIncome: Number(formData.primaryIncome),
      secondaryIncome: Number(formData.secondaryIncome),
      incomeFrequency: formData.incomeFrequency
    });

    localStorage.setItem("finpilot-user-email", formData.email);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
          <User size={28} />
        </div>

        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Profile Settings
          </h1>
          <p className="text-slate-500 text-sm">
            Edit your onboarding financial details anytime
          </p>
        </div>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-3xl p-10 border space-y-10">

        {/* PERSONAL DETAILS */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase text-slate-400">
            Personal Info
          </h3>

          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="finpilot-input"
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="finpilot-input"
          />

          <input
            type="text"
            placeholder="Employment Type"
            value={formData.employmentType}
            onChange={(e) =>
              setFormData({
                ...formData,
                employmentType: e.target.value
              })
            }
            className="finpilot-input"
          />
        </div>

        {/* INCOME DETAILS */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase text-slate-400">
            Income Details
          </h3>

          <input
            type="number"
            placeholder="Primary Income"
            value={formData.primaryIncome}
            onChange={(e) =>
              setFormData({
                ...formData,
                primaryIncome: Number(e.target.value)
              })
            }
            className="finpilot-input"
          />

          <input
            type="number"
            placeholder="Secondary Income"
            value={formData.secondaryIncome}
            onChange={(e) =>
              setFormData({
                ...formData,
                secondaryIncome: Number(e.target.value)
              })
            }
            className="finpilot-input"
          />

          <select
            value={formData.incomeFrequency}
            onChange={(e) =>
              setFormData({
                ...formData,
                incomeFrequency: e.target.value as any
              })
            }
            className="finpilot-input"
          >
            <option value="monthly">Monthly</option>
            <option value="irregular">Irregular</option>
          </select>
        </div>

        {/* EXPENSE DETAILS */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase text-slate-400">
            Expenses
          </h3>

          {data.expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center gap-4"
            >
              <span className="text-lg">{expense.icon}</span>

              <span className="w-40 text-sm font-semibold">
                {expense.name}
              </span>

              <input
                type="number"
                value={expense.amount}
                onChange={(e) =>
                  updateExpense(
                    expense.id,
                    parseInt(e.target.value) || 0
                  )
                }
                className="finpilot-input w-40"
              />
            </div>
          ))}
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className={`px-8 py-4 rounded-2xl font-black flex items-center gap-3 ${
            isSaved
              ? "bg-emerald-500 text-white"
              : "bg-indigo-600 text-white"
          }`}
        >
          {isSaved ? (
            <CheckCircle2 size={20} />
          ) : (
            <Save size={20} />
          )}

          {isSaved ? "Saved Successfully" : "Save Changes"}
        </button>
      </div>

      {/* SECURITY NOTE */}
      <div className="bg-slate-50 p-6 rounded-2xl flex gap-4">
        <Shield size={18} />
        <p className="text-xs text-slate-500">
          Your onboarding financial data stays local and editable anytime.
        </p>
      </div>
    </div>
  );
}