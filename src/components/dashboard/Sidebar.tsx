import React from 'react';
import { 
  LayoutDashboard, Landmark, Wallet, 
  Receipt, Target, Lightbulb, PieChart, 
  User, LogOut, Shield 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'loans', label: 'Loans & EMI', icon: Landmark },
    { id: 'savings', label: 'My Savings', icon: Wallet },
    { id: 'bills', label: 'Bills', icon: Receipt },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'tips', label: 'Tips', icon: Lightbulb },
    { id: 'expenses', label: 'Expenses', icon: PieChart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('finpilot-onboarded');
    localStorage.removeItem('finpilot-data');
    window.location.href = "/"; // Force redirect to home/onboarding
  };

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col sticky top-0 shrink-0">
      <div className="p-6 flex items-center gap-2 text-blue-600 border-b">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">FinPilot</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Log Out / Reset
        </button>
      </div>
    </div>
  );
}