import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinanceProvider, useFinance } from "./contexts/FinanceContext";
import { toast } from "sonner";
import { Settings, User, Wallet } from "lucide-react";

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
import { ProfilePage } from "./components/features/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ==================== AUTH SCREEN ====================
const AuthScreen = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [view, setView] = useState<"landing" | "signup" | "login" | "otp">("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // Check if returning user on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("finpilot-user-email");
    if (savedEmail) {
      setView("login");
    }
  }, []);

  const handleSignup = () => {
    if (!email.includes("@")) {
      return toast.error("Please enter a valid email");
    }
    if (password.length < 4) {
      return toast.error("Password must be at least 4 characters");
    }
    
    localStorage.setItem("finpilot-user-email", email);
    localStorage.setItem("finpilot-vault-pass", password);
    localStorage.setItem("finpilot-auth-session", "active");
    toast.success("Account created successfully!");
    onAuthSuccess();
  };

  const handleLogin = () => {
    const savedEmail = localStorage.getItem("finpilot-user-email");
    const savedPass = localStorage.getItem("finpilot-vault-pass");
    
    if (email === savedEmail && password === savedPass) {
      setView("otp");
      toast.info("OTP sent to your email (use 1234)");
    } else {
      toast.error("Invalid email or password");
    }
  };

  const handleVerifyOtp = () => {
    if (otp === "1234") {
      localStorage.setItem("finpilot-auth-session", "active");
      toast.success("Login successful!");
      onAuthSuccess();
    } else {
      toast.error("Invalid OTP. Use 1234");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl animate-in zoom-in duration-500">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              FP
            </div>
          </div>

          {/* Landing View */}
          {view === "landing" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  FinPilot <span className="text-blue-600">Vault</span>
                </h1>
                <p className="text-slate-500 mt-3">Your secure financial companion</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setView("signup")}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Create New Account
                </button>
                <button
                  onClick={() => setView("login")}
                  className="w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all"
                >
                  Sign In to Vault
                </button>
              </div>
            </div>
          )}

          {/* Signup View */}
          {view === "signup" && (
            <div className="space-y-5 text-left">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                <p className="text-slate-500 text-sm mt-1">Set up your secure vault</p>
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-colors"
              />
              <input
                type="password"
                placeholder="Create Password (min 4 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-colors"
              />
              <button
                onClick={handleSignup}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all"
              >
                Create Account
              </button>
              <button
                onClick={() => setView("landing")}
                className="w-full text-slate-500 text-sm hover:text-slate-700"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Login View */}
          {view === "login" && (
            <div className="space-y-5 text-left">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                <p className="text-slate-500 text-sm mt-1">Sign in to your vault</p>
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-colors"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-colors"
              />
              <button
                onClick={handleLogin}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => setView("landing")}
                className="w-full text-slate-500 text-sm hover:text-slate-700"
              >
                ← Back
              </button>
            </div>
          )}

          {/* OTP View */}
          {view === "otp" && (
            <div className="space-y-5 text-left">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Verify OTP</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Enter the code sent to your email
                </p>
              </div>
              <input
                type="text"
                placeholder="Enter 1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-colors text-center text-2xl tracking-widest font-semibold"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all"
              >
                Verify & Access Vault
              </button>
              <button
                onClick={() => {
                  setView("login");
                  setOtp("");
                }}
                className="w-full text-slate-500 text-sm hover:text-slate-700"
              >
                ← Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
const MainApp = ({ onLogout }: { onLogout: () => void }) => {
  const { isOnboarded } = useFinance();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("finpilot-auth-session");
      localStorage.removeItem("finpilot-user-email");
      localStorage.removeItem("finpilot-vault-pass");
      onLogout();
    }
  };

  // Show onboarding for new users
  if (!isOnboarded) {
    return <OnboardingFlow />;
  }

  // Show main dashboard
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Wallet className="text-blue-600" size={24} />
            <h2 className="font-bold text-slate-800 text-lg">FinPilot Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("profile")}
              className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all"
              title="Profile"
            >
              <User size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all text-xs font-semibold"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          <div className="max-w-6xl mx-auto">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "loans" && <LoansPage />}
            {activeTab === "savings" && <SavingsPage />}
            {activeTab === "bills" && <BillsPage />}
            {activeTab === "goals" && <GoalsPage />}
            {activeTab === "tips" && <TipsPage />}
            {activeTab === "expenses" && <ExpensesPage />}
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
    // Check authentication status on mount
    const session = localStorage.getItem("finpilot-auth-session");
    const userEmail = localStorage.getItem("finpilot-user-email");

    if (session === "active" && userEmail) {
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl animate-pulse mx-auto mb-4"></div>
          <p className="text-slate-500">Loading FinPilot...</p>
        </div>
      </div>
    );
  }

  // Render auth or main app based on authentication state
  return (
    <>
      {!isAuthenticated ? (
        <AuthScreen onAuthSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <MainApp onLogout={handleLogout} />
      )}
    </>
  );
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