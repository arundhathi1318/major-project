import React from 'react';
import { useFinance } from "@/contexts/FinanceContext";
import {
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  PieChart as RechartsChart
} from 'recharts';

import {
  Download,
  PieChart,
  ShieldCheck,
  AlertCircle,
  FileText,
  ArrowRight,
  ExternalLink,
  TrendingUp
} from 'lucide-react';

export function ExpensesPage() {

  const { data, getTotalExpenses } = useFinance();

  const COLORS = [
    '#6366f1',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#94a3b8'
  ];

  const totalSpend = getTotalExpenses();

  const chartData = data.expenses
    .filter(e => e.amount > 0)
    .map(e => ({
      name: e.name,
      value: e.amount
    }));


  // =============================
  // CSV EXPORT FUNCTION
  // =============================

  const exportCSV = () => {

    if (!data.expenses.length) {
      alert("No expense data available");
      return;
    }

    const csvRows = [];

    // Header row
    csvRows.push([
      "Category",
      "Amount",
      "Month",
      "Total Income",
      "Total Expenses",
      "Loan Eligibility"
    ]);

    // Data rows
    data.expenses.forEach(exp => {

      if (exp.amount > 0) {

        csvRows.push([
          exp.name,
          exp.amount,
          data.analysis?.month_display ?? "N/A",
          data.analysis?.total_income ?? "N/A",
          data.analysis?.total_spent ?? "N/A",
          data.analysis?.loanEligible ?? "Unknown"
        ]);
      }
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map(row => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);

    link.setAttribute(
      "download",
      `expense_report_${data.analysis?.month_display ?? "report"}.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };


  // =============================
  // EXTERNAL REDIRECT HELPER
  // =============================

  const handleRedirect = (url: string) => {

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };


  return (

    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">


      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">

        <div className="space-y-1">

          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Expense Analytics
          </h1>

          <p className="text-slate-500 font-medium">
            Monitoring your cash outflow for this period.
          </p>

        </div>


        <div className="flex items-center gap-3">

          {/* CSV EXPORT BUTTON */}

          <button
            onClick={exportCSV}
            className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
          >

            <Download size={16} />

            Export CSV

          </button>


          {/* TAX SUMMARY TOOL */}

          <button
            onClick={() =>
              handleRedirect(
                "https://www.cleartax.in/s/income-tax-calculators"
              )
            }

            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
          >

            Tax Summary

            <ExternalLink size={14} />

          </button>

        </div>

      </div>



      {/* GRID LAYOUT */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">


        {/* PIE CHART PANEL */}

        <div className="lg:col-span-7 space-y-8">


          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm h-[480px] flex flex-col relative overflow-hidden">

            <div className="flex justify-between items-center mb-4 z-10">

              <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">

                <PieChart size={14} className="text-indigo-600"/>

                Spending Distribution

              </h3>


              <div className="text-right">

                <p className="text-3xl font-black text-slate-900">

                  ₹{totalSpend.toLocaleString()}

                </p>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">

                  Total Monthly Burn

                </p>

              </div>

            </div>


            <div className="flex-1 min-h-0">

              <ResponsiveContainer width="100%" height="100%">

                <RechartsChart>

                  <Pie
                    data={chartData}
                    innerRadius={100}
                    outerRadius={140}
                    paddingAngle={10}
                    dataKey="value"
                    stroke="none"
                  >

                    {chartData.map((_, index) => (

                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />

                    ))}

                  </Pie>


                  <Tooltip/>

                </RechartsChart>

              </ResponsiveContainer>

            </div>

          </div>



          {/* INSIGHT CARD */}

          <div
            className="bg-indigo-600 p-8 rounded-[2.5rem] text-white flex items-center justify-between group cursor-pointer"

            onClick={() =>
              handleRedirect(
                "https://groww.in/blog/how-to-track-your-expenses-effectively"
              )
            }
          >

            <div className="flex items-center gap-5">

              <TrendingUp size={28}/>

              <div>

                <h4 className="font-black text-xl">

                  Spending Insight

                </h4>

                <p className="text-indigo-100 text-sm opacity-80">

                  Export CSV to analyze trends in Excel.

                </p>

              </div>

            </div>


            <ArrowRight/>

          </div>

        </div>



        {/* RIGHT PANEL */}

        <div className="lg:col-span-5 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col h-[610px]">


          <div className="flex justify-between items-center mb-8">

            <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">

              Detailed Breakdown

            </h3>


            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">

              <ShieldCheck size={12}/>

              {data.analysis?.isAnalyzed ? "Verified" : "Manual"}

            </div>

          </div>


          <div className="flex-1 overflow-y-auto space-y-4 pr-2">

            {chartData.length === 0 && (

              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-20">

                <AlertCircle size={48}/>

                <p>No transactions recorded</p>

              </div>

            )}

          </div>


          {/* ANALYZE BUTTON */}

          <button
            onClick={() =>
              handleRedirect("https://www.phonepe.com/wealth-management/")
            }

            className="mt-6 w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
          >

            <FileText size={16}/>

            Analyze Statements

          </button>

        </div>

      </div>

    </div>

  );
}