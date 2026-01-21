import { useState, useRef, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { MessageCircle, Send, X, Sparkles, Bot, User } from 'lucide-react';
import type { ChatMessage } from '@/types/finance';

const SAMPLE_RESPONSES: Record<string, string> = {
  default: "I'm your FinPilot assistant! Ask me about your finances, savings, or budgeting strategies. For example: 'How can I save more?' or 'Am I overspending on food?'",
  save: "Based on your current income and expenses, here are ways to save more:\n\n1. **Review subscriptions** - Cancel unused services\n2. **Meal planning** - Reduce food expenses by 20%\n3. **50/30/20 Rule** - Allocate 50% needs, 30% wants, 20% savings\n4. **Automate savings** - Set up automatic transfers\n\nWould you like specific tips for any category?",
  overspending: "Let me analyze your spending patterns. Looking at your expense categories, I can help identify areas where you might be overspending compared to recommended benchmarks. What specific category concerns you?",
  budget: "I can help create a personalized budget! Based on your income and financial goals, here's a suggested monthly allocation:\n\n• **Essential Expenses:** 50% of income\n• **Lifestyle:** 30% of income\n• **Savings & Investments:** 20% of income\n\nShall I break this down further based on your actual numbers?",
  emi: "Managing EMIs effectively is crucial. Some tips:\n\n1. **Keep total EMIs under 40%** of income\n2. **Consider prepayments** to reduce interest\n3. **Refinance** if you find better rates\n4. **Consolidate loans** if you have multiple\n\nWould you like me to analyze your current EMI burden?",
  goal: "Great that you're thinking about goals! To achieve them faster:\n\n1. **Break down goals** into monthly targets\n2. **Set up dedicated accounts** for each goal\n3. **Track progress weekly**\n4. **Find additional income sources**\n\nWhich goal would you like to focus on?",
  trip: "Let me help you plan for your trip! To save for a ₹40,000 trip in 3 months:\n\n• **Monthly saving needed:** ₹13,333\n• **Weekly saving:** ₹3,333\n• **Daily saving:** ~₹445\n\nLooking at your current savings rate, this seems achievable with some adjustments. Want me to suggest where to cut back?",
};

function getAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
    return SAMPLE_RESPONSES.save;
  }
  if (lowerMessage.includes('overspend') || lowerMessage.includes('spending')) {
    return SAMPLE_RESPONSES.overspending;
  }
  if (lowerMessage.includes('budget') || lowerMessage.includes('plan')) {
    return SAMPLE_RESPONSES.budget;
  }
  if (lowerMessage.includes('emi') || lowerMessage.includes('loan')) {
    return SAMPLE_RESPONSES.emi;
  }
  if (lowerMessage.includes('goal')) {
    return SAMPLE_RESPONSES.goal;
  }
  if (lowerMessage.includes('trip') || lowerMessage.includes('travel') || lowerMessage.includes('afford')) {
    return SAMPLE_RESPONSES.trip;
  }
  
  return SAMPLE_RESPONSES.default;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your FinPilot AI assistant 🚀\n\nI can help you with:\n• Budget planning\n• Savings strategies\n• Expense analysis\n• Financial goal tracking\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data } = useFinance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(userMessage.content);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "How can I save more?",
    "Am I overspending?",
    "Create a budget plan",
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 finpilot-gradient rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50 ${
          isOpen ? 'hidden' : ''
        }`}
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[550px] finpilot-card flex flex-col z-50 shadow-2xl animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="finpilot-gradient p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground">FinPilot AI</h3>
                <p className="text-xs text-primary-foreground/80">Your finance assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-secondary/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-card border border-border rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="bg-card border border-border p-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="px-3 py-1.5 text-xs font-medium bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full whitespace-nowrap transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border bg-card shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 finpilot-gradient rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
