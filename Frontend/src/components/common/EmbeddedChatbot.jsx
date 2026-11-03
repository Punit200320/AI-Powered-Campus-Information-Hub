import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  BookOpen,
  Award,
  Compass,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { chatService } from '../../services/chatService';

export const EmbeddedChatbot = ({
  mode = 'general', // 'scholarship' | 'counselling' | 'study_material'
  title = 'AI Campus Advisor',
  description = 'Ask anything related to schemes, deadlines & eligibility',
  icon: Icon = Sparkles,
  accentColor = 'primary', // 'primary' | 'emerald' | 'indigo' | 'amber'
  suggestedPrompts = [],
  placeholder = 'Type your question here...',
}) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! 👋 I am your dedicated **${title}**.\n\nAsk me about schemes, eligibility rules, closing ranks, step-by-step PYQ solutions, or deadlines. Click any suggestion below to start!`,
      citations: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText) => {
    const query = messageText || input;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsLoading(true);

    const botMsgId = `b_${Date.now()}`;
    let botReply = '';

    try {
      await chatService.streamMessage(
        query.trim(),
        (chunk) => {
          botReply = chunk;
          setMessages((prev) => {
            const existing = prev.find((m) => m.id === botMsgId);
            if (existing) {
              return prev.map((m) =>
                m.id === botMsgId ? { ...m, content: chunk } : m
              );
            } else {
              return [...prev, { id: botMsgId, role: 'assistant', content: chunk, citations: [] }];
            }
          });
        },
        ({ text, citations }) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId ? { ...m, content: text, citations: citations || [] } : m
            )
          );
          setIsLoading(false);
        },
        mode
      );
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue retrieving the data. Please verify your connection or ask again.',
          citations: [],
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: `Chat reset. I am ready to answer your questions regarding **${title}**.`,
        citations: [],
      },
    ]);
  };

  const colorStyles = {
    primary: {
      badge: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20',
      btn: 'bg-primary-600 hover:bg-primary-700 text-white',
      accentText: 'text-primary-600 dark:text-primary-400',
    },
    emerald: {
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      accentText: 'text-emerald-600 dark:text-emerald-400',
    },
    indigo: {
      badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      accentText: 'text-indigo-600 dark:text-indigo-400',
    },
    amber: {
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white',
      accentText: 'text-amber-600 dark:text-amber-400',
    },
  }[accentColor] || {
    badge: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20',
    btn: 'bg-primary-600 hover:bg-primary-700 text-white',
    accentText: 'text-primary-600 dark:text-primary-400',
  };

  return (
    <div className="flex flex-col h-[580px] rounded-2xl glass-card border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${colorStyles.badge}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {title}
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Live RAG
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{description}</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          title="Reset conversation"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Prompts Carousel / Pills */}
      {suggestedPrompts.length > 0 && (
        <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Try:</span>
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-xs shrink-0 px-3 py-1 rounded-full bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center border shadow-xs ${colorStyles.badge}`}>
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isBot
                    ? 'bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-slate-800 dark:text-slate-200'
                    : 'bg-primary-600 text-white shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* Citations / Portal links */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <span className="font-semibold block text-[10px] uppercase tracking-wider text-slate-400">
                      Verified Data Citations:
                    </span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{c.title}</span>
                        {c.author && <span className="opacity-70">({c.author})</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {!isBot && (
                <div className="w-7 h-7 rounded-lg shrink-0 bg-primary-700 text-white flex items-center justify-center shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center border ${colorStyles.badge}`}>
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="rounded-2xl p-3.5 bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1">Analyzing verified database...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`p-2.5 rounded-xl font-medium shadow-sm transition-all disabled:opacity-50 ${colorStyles.btn}`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default EmbeddedChatbot;

