import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinanceProvider, useFinance } from "./contexts/FinanceContext";
import { toast } from "sonner";
import { Settings, User, Wallet, LogOut } from "lucide-react";

// Feature Imports
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Sidebar } from "./components/dashboard/Sidebar";
import { Chatbot } from "./components/dashboard/Chatbot";
import { LoansPage } from "./components/features/LoansPage";
import { SavingsPage } from "./components/features/SavingsPage";
import { GoalsPage } from "./components/features/GoalsPage";
import { BillsPage } from "./components/features/BillsPage";
import { TipsPage } from "./components/features/TipsPage";
import { ExpensesPage } from "./components/features/ExpensesPage";
import SavingsHistory from "./components/features/SavingsHistory";
import { ProfilePage } from "./components/features/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ==================== AUTH SCREEN ====================
const AuthScreen = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [view, setView] = useState<"landing" | "signup" | "login" | "otp">("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("finpilot-user-email");
    if (savedEmail) setView("login");
  }, []);

  const handleSignup = () => {
    if (!email.includes("@")) return toast.error("Please enter a valid email");
    if (password.length < 4) return toast.error("Password too short");
    localStorage.setItem("finpilot-user-email", email);
    localStorage.setItem("finpilot-vault-pass", password);
    localStorage.setItem("finpilot-auth-session", "active");
    toast.success("Account created!");
    onAuthSuccess();
  };

  const handleLogin = () => {
    const savedEmail = localStorage.getItem("finpilot-user-email");
    const savedPass = localStorage.getItem("finpilot-vault-pass");
    if (email === savedEmail && password === savedPass) {
      setView("otp");
      toast.info("Use 1234");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleVerifyOtp = () => {
    if (otp === "1234") {
      localStorage.setItem("finpilot-auth-session", "active");
      onAuthSuccess();
    } else {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">FP</div>
          </div>
          {view === "landing" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">FinPilot Vault</h1>
              <div className="space-y-3">
                <button onClick={() => setView("signup")} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">Get Started</button>
                <button onClick={() => setView("login")} className="w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold">Sign In</button>
              </div>
            </div>
          )}
          {(view === "signup" || view === "login") && (
            <div className="space-y-4 text-left">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={view === "signup" ? handleSignup : handleLogin} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">{view === "signup" ? "Create Account" : "Sign In"}</button>
              <button onClick={() => setView("landing")} className="w-full text-slate-400 text-sm font-bold">← Back</button>
            </div>
          )}
          {view === "otp" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Verify Identity</h2>
              <input type="text" placeholder="1234" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={4} className="w-full p-4 bg-slate-50 rounded-2xl text-center text-3xl font-black tracking-widest outline-none ring-2 ring-blue-500" />
              <button onClick={handleVerifyOtp} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Access Vault</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
const MainApp = ({ onLogout }: { onLogout: () => void }) => {
  const { data, isOnboarded } = useFinance();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    if (confirm("Logout from FinPilot?")) {
      localStorage.removeItem("finpilot-auth-session");
      onLogout();
    }
  };

  if (!isOnboarded) return <OnboardingFlow />;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* GLOBAL HEADER */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <Wallet size={22} />
            </div>
            <h2 className="font-black text-slate-900 text-xl tracking-tight uppercase">FinPilot</h2>
          </div>

          <div className="flex items-center gap-5">
            {/* Settings Icon */}
            <button
              onClick={() => setActiveTab("profile")}
              className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="Settings"
            >
              <Settings size={22} />
            </button>

            {/* Profile Section */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
              <div className="text-right hidden md:block">
                <p className="text-xs font-black text-slate-900 leading-none">{data.profile.fullName || 'User'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Prime Member</p>
              </div>
              <button
                onClick={() => setActiveTab("profile")}
                className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-100"
                title="View Profile"
              >
                <User size={20} />
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              Logout
            </button>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "loans" && <LoansPage />}
            {activeTab === "savings" && <SavingsPage />}
            {activeTab === "bills" && <BillsPage />}
            {activeTab === "goals" && <GoalsPage />}
            {activeTab === "tips" && <TipsPage />}
            {activeTab === "expenses" && <ExpensesPage />}
            {activeTab === "savingsHistory" && <SavingsHistory />}
            {activeTab === "profile" && <ProfilePage />}
          </div>
        </main>
      </div>

      <Chatbot />
    </div>
  );
};

// ==================== APP CONTENT (ROUTER) ====================
const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("finpilot-auth-session");
    if (session === "active") setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold">Loading...</div>;

  return isAuthenticated ? <MainApp onLogout={() => setIsAuthenticated(false)} /> : <AuthScreen onAuthSuccess={() => setIsAuthenticated(true)} />;
};

// ==================== ROOT APP ====================
const App = () => (
  <QueryClientProvider client={queryClient}>
    <FinanceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </FinanceProvider>
  </QueryClientProvider>
);

export default App;