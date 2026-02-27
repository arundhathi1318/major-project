import { useFinance } from "@/contexts/FinanceContext";
import { Target, TrendingUp, Calendar, AlertCircle, ArrowUpRight } from "lucide-react";

export function GoalsPage() {
  const { data, getNetSavings } = useFinance();
  const goals = data.savings.goals;
  const currentSavings = data.savings.currentSavings;
  const netMonthlySavings = getNetSavings();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Financial Goals</h1>
        <p className="text-slate-500 mt-1">Tracking your progress from onboarding to reality.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Goals List & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {goals.length > 0 ? (
            goals.map((goal, idx) => {
              // Logic: Progress calculation
              const progress = Math.min(100, Math.round((currentSavings / goal.targetAmount) * 100));
              
              // Logic: Monthly SIP calculation
              // Assuming timeframe is in years, converting to months
              const monthsLeft = goal.timeframe === 'short-term' ? 12 : 
                                goal.timeframe === 'mid-term' ? 36 : 60;
              const monthlyNeeded = Math.round((goal.targetAmount - currentSavings) / monthsLeft);

              return (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Target size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{goal.type} Goal</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 uppercase font-bold tracking-wider">
                          <Calendar size={12} /> {goal.timeframe}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 uppercase font-bold">Target Amount</p>
                      <p className="text-xl font-black text-slate-900">₹{goal.targetAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Progress</span>
                      <span className="text-blue-600 font-bold">{progress}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                  </div>

                  {/* Monthly Insight */}
                  <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Required Monthly SIP</p>
                      <p className="text-lg font-bold text-slate-700">₹{monthlyNeeded.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ month</span></p>
                    </div>
                    {netMonthlySavings >= monthlyNeeded ? (
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                        On Track <ArrowUpRight size={14} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold">
                        Need Adjustment
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-4">
              <AlertCircle className="mx-auto text-slate-300" size={48} />
              <p className="text-slate-500 font-medium">No goals found. Update your profile settings to set targets.</p>
            </div>
          )}
        </div>

        {/* RIGHT: AI Insights & SIP Suggestions */}
        <div className="space-y-6">
          <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-100">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <TrendingUp size={22} /> SIP Insights
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">AI Suggestion</p>
                <p className="text-sm leading-relaxed opacity-90 italic">
                  "Based on your {data.analysis?.loanEligible === 'Eligible' ? 'stable' : 'variable'} income, we recommend starting a Multi-cap SIP. You currently have ₹{getNetSavings()} surplus. Diversifying 60% into Equity and 40% into Debt will help reach your '{goals[0]?.type || 'Financial'}' goal 4 months faster."
                </p>
              </div>
              <hr className="opacity-20" />
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold opacity-60">Risk Profile</p>
                  <p className="text-lg font-bold">Moderate</p>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold opacity-60">Strategy</p>
                  <p className="text-lg font-bold">Growth</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Goal Comparison</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Goal Value</span>
                <span className="font-bold">₹{goals.reduce((acc, g) => acc + g.targetAmount, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Progress</span>
                <span className="font-bold text-blue-600">₹{currentSavings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}