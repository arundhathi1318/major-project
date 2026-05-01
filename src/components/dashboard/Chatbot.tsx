import { useState, useRef, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { MessageCircle, Send, X, Sparkles, Bot, User, Loader2, Landmark } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage } from '@/types/finance';

// Initialize Gemini SDK
const API_KEY = import.meta.env.VITE_GEMINI_KEY;
if (!API_KEY) {
  console.warn('VITE_GEMINI_KEY not found in environment variables');
}
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

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
      if (!genAI || !API_KEY) {
        throw new Error('Gemini API key not configured. Please add VITE_GEMINI_KEY to your .env file');
      }

      // 1. Prepare dynamic context from the FinanceContext
      const expenseList = data.expenses.map(e => `${e.name}: ₹${e.amount}`).join(", ");
      const loanList = data.loans.map(l => `${l.type} EMI: ₹${l.emiAmount}`).join(", ");
      
      const pdfStatus = data.analysis?.isAnalyzed 
        ? `A Bank Statement was uploaded. Loan Eligibility (ML Model): ${data.analysis.loanEligible}. Top Category: ${data.analysis.topCategory}. Analysis Summary: ${data.analysis.summaryText}`
        : "No bank statement uploaded yet.";

      const systemContext = `
        You are FinPilot, a helpful AI personal finance assistant.
        USER DATA:
        - Name: ${data.profile.fullName}, Age: ${data.profile.age}
        - Income: ₹${data.income.primaryIncome + data.income.secondaryIncome}
        - Expenses: ${expenseList}
        - EMIs: ${loanList || 'None'}
        - Health Score: ${getFinancialHealthScore()}/100
        - Net Monthly Savings: ₹${getNetSavings()}
        - PDF Analysis: ${pdfStatus}

        INSTRUCTIONS:
        - Use the user's specific numbers above to answer.
        - If they ask about loans, mention their eligibility status from the PDF Analysis.
        - Be encouraging and friendly. Provide concise advice.
        - Don't give legal or specific stock investment advice.
      `;

      // 2. Call Gemini API - use plain gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(`${systemContext}\n\nUser Question: ${userMsg.content}`);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMessage = error instanceof Error ? error.message : "I'm having trouble connecting to the AI. Please check your internet or API key.";
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 finpilot-gradient rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {data.analysis?.isAnalyzed && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[580px] bg-white rounded-3xl flex flex-col z-50 shadow-2xl animate-in slide-in-from-bottom-4 border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="finpilot-gradient p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">FinPilot AI</h3>
                <p className="text-[10px] text-white/80 uppercase font-bold tracking-widest">Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Close chat">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Statement Awareness Badge */}
          {data.analysis?.isAnalyzed && (
            <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-center gap-2">
              <Landmark className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-bold text-blue-700 uppercase">Statement Context Active</span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border shadow-sm'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 shadow-sm rounded-tl-none text-slate-700'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
                <div className="bg-white border p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-2 px-3 focus-within:ring-2 ring-primary/20 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your budget or loans..."
                className="flex-1 bg-transparent border-none outline-none text-sm py-1"
              />
              <button
                type="button"

                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 finpilot-gradient rounded-xl flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity shadow-lg"
                title="Send message"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}