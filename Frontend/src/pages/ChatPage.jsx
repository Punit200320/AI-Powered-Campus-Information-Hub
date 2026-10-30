import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Plus,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  MessageSquare,
  FileText,
  Sliders,
  ChevronDown,
  Trash2,
  ExternalLink,
  Code2,
  Lightbulb,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { chatService } from '../services/chatService';
import { MOCK_CHAT_SUGGESTIONS } from '../data/mockData';
import toast from 'react-hot-toast';

export const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `### 👋 Hello! I am your AI Campus Academic Assistant

I have indexed your university curriculum, syllabus notes, previous year exam papers, and official regulations in the campus **Qdrant Vector Database**.

#### What I can assist with:
- **Concept Deep-Dives:** Ask for step-by-step algorithms, derivations, or system architectures.
- **Exam Preparation:** Request summaries of specific units or sample solutions from past papers.
- **Campus Policies:** Clarify attendance cutoffs, hostel leave rules, and scholarship guidelines.
- **Source Verification:** Every answer provides verified citations with page numbers!`,
      citations: [
        { id: 'cit_1', title: 'Campus_Academic_Handbook_2026.pdf', page: 'p. 4-8', author: 'University Council' },
      ],
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMode, setChatMode] = useState('Detailed & Cited');
  const [copiedId, setCopiedId] = useState(null);
  const [activeCitation, setActiveCitation] = useState(null);
  const [sessions, setSessions] = useState([
    { id: 'sess_1', title: 'Data Structures: Dijkstra & Bellman', time: 'Today' },
    { id: 'sess_2', title: 'OS: Virtual Memory Paging vs Seg', time: 'Yesterday' },
    { id: 'sess_3', title: 'Campus Placement CGPA Requirements', time: '3 days ago' },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState('sess_1');

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || isGenerating) return;

    const userMessageId = `usr_${Date.now()}`;
    const botMessageId = `bot_${Date.now()}`;

    // Add user message
    const userMsg = {
      id: userMessageId,
      role: 'user',
      content: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    // Initial placeholder for assistant message
    setMessages((prev) => [
      ...prev,
      {
        id: botMessageId,
        role: 'assistant',
        content: '',
        citations: [],
        timestamp: 'Generating response...',
        isStreaming: true,
      },
    ]);

    try {
      await chatService.streamMessage(
        textToSend,
        (currentChunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId ? { ...m, content: currentChunk } : m
            )
          );
        },
        ({ text, citations }) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId
                ? { ...m, content: text, citations, isStreaming: false, timestamp: 'Just now' }
                : m
            )
          );
          setIsGenerating(false);
        },
        chatMode
      );
    } catch (err) {
      setIsGenerating(false);
      toast.error('Failed to generate response. Please try again.');
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Response copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    const newSession = {
      id: `sess_${Date.now()}`,
      title: 'New Conversation',
      time: 'Just now',
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    setMessages([
      {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: 'Started a fresh conversation. Ask any academic or campus question to begin!',
        citations: [],
        timestamp: 'Just now',
      },
    ]);
  };

  const handleRegenerate = (msgIndex) => {
    // Find preceding user question
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        handleSend(messages[i].content);
        break;
      }
    }
  };

  // Helper to format basic markdown-style response
  const renderFormattedContent = (content) => {
    return (
      <div className="space-y-3 leading-relaxed text-sm">
        {content.split('\n\n').map((paragraph, idx) => {
          // Headers
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-base font-bold text-slate-900 dark:text-white mt-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-sm font-bold text-primary-600 dark:text-primary-400 mt-2">
                {paragraph.replace('#### ', '')}
              </h4>
            );
          }
          // Code Blocks
          if (paragraph.includes('```')) {
            const parts = paragraph.split('```');
            return (
              <div key={idx} className="my-2">
                {parts.map((p, pIdx) => {
                  if (pIdx % 2 === 1) {
                    return (
                      <div
                        key={pIdx}
                        className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 my-1"
                      >
                        <pre>{p.trim()}</pre>
                      </div>
                    );
                  }
                  return p ? <p key={pIdx}>{p}</p> : null;
                })}
              </div>
            );
          }
          // Quotes
          if (paragraph.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-primary-500 pl-3.5 py-1 text-slate-600 dark:text-slate-300 italic text-xs bg-primary-500/5 rounded-r-lg"
              >
                {paragraph.replace('> ', '')}
              </blockquote>
            );
          }
          // Bullets
          if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
            return (
              <div key={idx} className="space-y-1 pl-2">
                {paragraph.split('\n').map((line, lIdx) => (
                  <div key={lIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-primary-500 mt-1">•</span>
                    <span>{line.replace(/^-\s|^\d+\.\s/, '')}</span>
                  </div>
                ))}
              </div>
            );
          }
          // Default paragraph
          return (
            <p key={idx} className="text-slate-800 dark:text-slate-200">
              {paragraph}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 relative">
      {/* Chat History Sidebar */}
      <div className="hidden md:flex flex-col w-64 glass-card rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 shrink-0 justify-between">
        <div className="space-y-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleNewChat}
            leftIcon={Plus}
            className="w-full shadow-glow-sm"
          >
            New Conversation
          </Button>

          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Recent Dialogs
            </span>
            <div className="space-y-1">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  onClick={() => setCurrentSessionId(sess.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs font-medium transition-colors ${
                    currentSessionId === sess.id
                      ? 'bg-primary-500/15 text-primary-600 dark:text-primary-300 font-semibold border border-primary-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{sess.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vector DB status indicator */}
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Qdrant Vector RAG
          </div>
          <p>1,284 campus documents indexed with real-time citations</p>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="flex-1 flex flex-col glass-card rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3.5 sm:px-6 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Campus AI Assistant
                </h3>
                <Badge variant="emerald" size="sm" dot>
                  Online
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounded in university course notes & circulars
              </p>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-2">
            <select
              value={chatMode}
              onChange={(e) => setChatMode(e.target.value)}
              className="glass-input rounded-xl px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-none border-primary-500/30"
            >
              <option value="Detailed & Cited">Mode: Detailed & Cited</option>
              <option value="Concise Exam Summary">Mode: Concise Exam Summary</option>
              <option value="Step-by-Step Proof">Mode: Step-by-Step Proof</option>
            </select>
          </div>
        </div>

        {/* Message Stream Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 relative ${
                    isUser
                      ? 'bg-primary-600 text-white rounded-tr-sm shadow-md'
                      : 'glass-panel text-slate-800 dark:text-slate-100 rounded-tl-sm border border-slate-200/80 dark:border-white/10'
                  }`}
                >
                  {/* Streaming indicator */}
                  {msg.isStreaming && !msg.content ? (
                    <div className="flex items-center gap-1.5 py-2 px-1">
                      <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <div>
                      {isUser ? (
                        <p className="text-sm font-medium whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        renderFormattedContent(msg.content)
                      )}
                    </div>
                  )}

                  {/* Document Citations Badge Row */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                        <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                        <span>Referenced Document Citations:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((cit, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-300 text-xs border border-primary-500/20 transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            <span className="font-semibold">{cit.title}</span>
                            <span className="opacity-70">({cit.page})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions footer for assistant messages */}
                  {!isUser && !msg.isStreaming && msg.content && (
                    <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>{msg.timestamp}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleRegenerate(index)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          title="Regenerate"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    alt="User"
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-primary-500/20 shrink-0"
                  />
                )}
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions Quick Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200/50 dark:border-white/5 overflow-x-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Suggested Questions
            </span>
            <div className="flex gap-2">
              {MOCK_CHAT_SUGGESTIONS.map((sugg, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sugg.query)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-300 border border-slate-200 dark:border-white/10 whitespace-nowrap transition-colors shadow-sm"
                >
                  💡 {sugg.query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={textareaRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about formulas, algorithms, exam PYQs, or campus policies..."
                disabled={isGenerating}
                className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!input.trim() || isGenerating}
              isLoading={isGenerating}
              className="rounded-2xl px-5 h-[46px] shadow-glow-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="mt-2 text-center text-[10px] text-slate-400">
            CampusAI answers are grounded in uploaded course notes and validated against syllabus materials.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

