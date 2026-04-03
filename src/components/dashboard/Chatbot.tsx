import { useState, useRef, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { MessageCircle, Send, X, Sparkles, Bot, User, Loader2, Landmark } from 'lucide-react';
import type { ChatMessage } from '@/types/finance';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, getNetSavings, getFinancialHealthScore } = useFinance();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your FinPilot AI 🚀. I've analyzed your current financial profile. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // 1. Add User Message to UI immediately
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // 2. Define Backend URL (Use .env for Vercel/Render deployment)
      // Fallback to localhost if the environment variable is not set
      const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      // 3. Prepare full context for the AI
      const userContext = {
        name: data.profile.fullName,
        age: data.profile.age,
        income: data.income.primaryIncome + data.income.secondaryIncome,
        net_savings: getNetSavings(),
        health_score: getFinancialHealthScore(),
        expenses: data.expenses.filter(e => e.amount > 0).map(e => `${e.name}: ₹${e.amount}`).join(", "),
        loans: data.loans.map(l => `${l.type} EMI: ₹${l.emiAmount}`).join(", "),
        pdf_analyzed: data.analysis?.isAnalyzed || false
      };

      // 4. Call your Python FastAPI Backend
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg.content,
          user_context: userContext
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to FinPilot Engine');
      }

      const result = await response.json();

      // 5. Add AI Response to UI
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
      }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'assistant',
        content: "I'm having trouble reaching the FinPilot engine. Please ensure the Python backend is running and the API key is valid.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="w-6 h-6" />
        {data.analysis?.isAnalyzed && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-white rounded-[2.5rem] flex flex-col z-50 shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-4 border border-slate-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-slate-900 p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-white text-sm tracking-tight">FinPilot AI</h3>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Digital Advisor</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsOpen(false)} 
              aria-label="Close chat"
              title="Close chat"
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* PDF Awareness Badge */}
          {data.analysis?.isAnalyzed && (
            <div className="bg-indigo-50 px-5 py-2 border-b border-indigo-100 flex items-center gap-2">
              <Landmark className="w-3 h-3 text-indigo-600" />
              <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">RAG Context Enabled</span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-400'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100 shadow-md' 
                    : 'bg-white border border-slate-100 shadow-sm rounded-tl-none text-slate-700'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                </div>
                <div className="bg-white border p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-200 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-indigo-200 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white border-t border-slate-50">
            <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-2 pl-4 focus-within:ring-2 ring-indigo-100 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about taxes, budget, or loans..."
                className="flex-1 bg-transparent border-none outline-none text-sm py-2 text-slate-700 placeholder:text-slate-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                title="Send message"
                className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-90"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-3">
              Powered by FinPilot Intelligence
            </p>
          </div>
        </div>
      )}
    </>
  );
}