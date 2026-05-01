import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

/* ---------------- DATA ---------------- */

const dataSets = {
  "6m": {
    labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    income: [18, 20, 19, 22, 21, 35],
    savings: [12, 14, 13, 16, 14, 30],
    expenses: [6, 6, 6, 6, 7, 5],
  },
  "1y": {
    labels: [
      "May","Jun","Jul","Aug","Sep","Oct",
      "Nov","Dec","Jan","Feb","Mar","Apr"
    ],
    income: [15,18,20,21,22,23,19,20,21,22,24,35],
    savings:[10,12,14,15,16,17,13,14,15,16,18,30],
    expenses:[5,6,6,6,6,6,6,6,6,6,6,5],
  },
  "all": {
    labels: ["2023","2024","2025","2026"],
    income:[180,220,260,300],
    savings:[120,150,190,230],
    expenses:[60,70,70,70],
  }
};

/* ---------------- COMPONENT ---------------- */

const SavingsHistory: React.FC = () => {
  const [range, setRange] = useState<"6m" | "1y" | "all">("6m");

  const current = dataSets[range];
  const { labels, income, savings, expenses } = current;

  const totalSavings = savings.reduce((a,b)=>a+b,0);
  const avgSavings = (totalSavings / savings.length).toFixed(1);
  const bestMonth = Math.max(...savings);
  const savingsRate = (
    (totalSavings / income.reduce((a,b)=>a+b,0)) * 100
  ).toFixed(1);

  /* -------- PDF DOWNLOAD -------- */

  const downloadPDF = async () => {
    const element = document.getElementById("report-section");
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("Savings_Report.pdf");
  };

  /* -------- CHART DATA -------- */

  const barData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: income,
        backgroundColor: "#74c69d",
      },
      {
        label: "Savings",
        data: savings,
        backgroundColor: "#2b8a6e",
      },
      {
        label: "Expenses",
        data: expenses,
        backgroundColor: "#ff6b6b",
      },
    ],
  };

  const doughnutData = {
    labels: ["Salary", "Freelance", "Investments"],
    datasets: [
      {
        data: [78, 13, 9],
        backgroundColor: ["#2b8a6e", "#74c69d", "#95d5b2"],
      },
    ],
  };

  return (
    <div style={{ padding: "30px", background:"#f5f7f9" }}>
      <h2>Savings History & Trends</h2>

      {/* FILTERS + PDF */}
      <div style={{ marginBottom:"20px" }}>
        {["6m","1y","all"].map((r)=>(
          <button
            key={r}
            onClick={()=>setRange(r as any)}
            style={{
              marginRight:"10px",
              padding:"6px 12px",
              borderRadius:"6px",
              border:"none",
              background: range===r ? "#2b8a6e" : "#ccc",
              color: range===r ? "white" : "black"
            }}
          >
            {r==="6m"?"6 Months": r==="1y"?"1 Year":"All Time"}
          </button>
        ))}

        <button
          onClick={downloadPDF}
          style={{
            marginLeft:"20px",
            background:"#1d3557",
            color:"white",
            padding:"6px 12px",
            borderRadius:"6px",
            border:"none"
          }}
        >
          Download PDF
        </button>
      </div>

      {/* REPORT SECTION */}
      <div id="report-section" style={{ background:"white", padding:"20px", borderRadius:"12px" }}>

        {/* SUMMARY CARDS */}
        <div style={{ display:"flex", gap:"20px", flexWrap:"wrap" }}>
          <Card title="Total Savings" value={`₹${totalSavings}L`} />
          <Card title="Monthly Avg" value={`₹${avgSavings}L`} />
          <Card title="Best Month" value={`₹${bestMonth}L`} />
          <Card title="Savings Rate" value={`${savingsRate}%`} />
        </div>

        {/* CHARTS */}
        <div style={{ display:"flex", gap:"20px", marginTop:"30px", flexWrap:"wrap" }}>
          <div style={{ flex:2 }}>
            <Bar data={barData}/>
          </div>
          <div style={{ flex:1 }}>
            <Doughnut data={doughnutData}/>
            <div style={{ marginTop:"15px" }}>
              <p>Salary - ₹12.4L (78%)</p>
              <p>Freelance - ₹2.1L (13%)</p>
              <p>Investments - ₹1.3L (9%)</p>
            </div>
          </div>
        </div>

        {/* MONTH PROGRESS */}
        <div style={{ marginTop:"30px" }}>
          <h3>Month-by-Month</h3>
          {savings.map((val,i)=>(
            <div key={i} style={{ marginBottom:"12px" }}>
              <p>{labels[i]}</p>
              <div style={{ background:"#eee", height:"8px", borderRadius:"5px" }}>
                <div
                  style={{
                    width:`${(val/bestMonth)*100}%`,
                    height:"100%",
                    background:"#2b8a6e",
                    borderRadius:"5px"
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* SMART INSIGHTS */}
        <div style={{ marginTop:"30px" }}>
          <h3>Smart Insights</h3>
          <Insight text={`🔥 ${getStreak(savings)} month saving streak`} />
          <Insight text={`📈 Growth ${getGrowth(savings)}%`} />
          <Insight text={`🏆 Top 5% Saver`} />
          <Insight text={`🎯 On track to reach goal`} />
        </div>

      </div>
    </div>
  );
};

/* CARD COMPONENT */
const Card = ({title,value}:{title:string,value:string}) => (
  <div style={{
    background:"#f8f9fa",
    padding:"15px",
    borderRadius:"10px",
    minWidth:"200px",
    boxShadow:"0 2px 6px rgba(0,0,0,0.1)"
  }}>
    <p style={{color:"gray"}}>{title}</p>
    <h3>{value}</h3>
  </div>
);

/* INSIGHT COMPONENT */
const Insight = ({text}:{text:string}) => (
  <div style={{
    background:"#eef7f4",
    padding:"10px",
    borderRadius:"8px",
    marginBottom:"10px"
  }}>
    {text}
  </div>
);

/* LOGIC FUNCTIONS */
const getStreak = (data:number[])=>{
  let streak=1;
  for(let i=data.length-1;i>0;i--){
    if(data[i]>=data[i-1]) streak++;
    else break;
  }
  return streak;
};

const getGrowth = (data:number[])=>{
  const first=data[0];
  const last=data[data.length-1];
  return (((last-first)/first)*100).toFixed(1);
};

export default SavingsHistory;