import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  MessageSquare,
  FileText,
  HelpCircle,
  Calendar,
  Shield,
  Zap,
  CheckCircle2,
  Database,
  Layers,
  Code2,
  Cpu,
  ChevronRight,
  Star,
  Users,
  Search,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { fadeInUp, staggerContainer } from '../utils/animations';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');

  const PREVIEW_TABS = [
    { id: 'chat', label: 'AI Campus Chat', icon: MessageSquare },
    { id: 'search', label: 'Resource Finder', icon: Search },
    { id: 'quiz', label: 'Question Generator', icon: HelpCircle },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-100 selection:bg-primary-500/20 selection:text-primary-600 dark:selection:text-primary-300 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="ambient-glow" />

      {/* Navigation Header */}
      <nav className="relative z-20 w-full glass-panel border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-secondary-500 to-electric-cyan flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Campus<span className="text-primary-500">AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                Campus study companion
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              How It Works
            </a>
            <a href="#tech" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Architecture
            </a>
            <a href="#stats" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Impact
            </a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard')}
              rightIcon={ArrowRight}
            >
              Launch Platform
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Campus background photo */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 dark:opacity-20"
            style={{ backgroundImage: "url(/assets/campus-bg.webp)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-dark-bg" />
        </div>
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <Badge variant="indigo" size="lg" className="mb-6 px-4 py-1.5 shadow-sm border-primary-500/30">
              <Sparkles className="w-4 h-4 mr-2 text-primary-500 animate-pulse" />
              Built around your coursework, notes & questions
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="font-display text-5xl sm:text-6xl lg:text-7xl text-slate-900 dark:text-white leading-[1.08]"
          >
            Study smarter, not harder —{' '}
            <span className="gradient-text-primary">on and around campus</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
          >
            CampusAI gathers your lecture notes, PYQs and notices into one calm place — answers your questions with cited sources, summarises documents, and helps you plan your study week without the overwhelm.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              rightIcon={ArrowRight}
              className="w-full sm:w-auto shadow-glow"
            >
              Explore Student Dashboard
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/chat')}
              leftIcon={MessageSquare}
              className="w-full sm:w-auto"
            >
              Try AI Chatbot
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Verified Faculty Resources
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Real-Time Source Citations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Sub-Second Vector Search
            </span>
          </motion.div>
        </motion.div>

        {/* Interactive Product Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 max-w-5xl mx-auto glass-card rounded-3xl p-3 sm:p-5 shadow-2xl border border-slate-200/80 dark:border-white/10"
        >
          {/* Mock Window Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 px-2 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-semibold text-slate-500 ml-2">
                app.campusai.edu/workspace
              </span>
            </div>

            {/* Interactive Preview Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl overflow-x-auto">
              {PREVIEW_TABS.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-300 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Screen Display */}
          <div className="p-4 sm:p-6 min-h-[380px] text-left">
            <AnimatePresence mode="wait">
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"
                      alt="Student"
                      className="w-8 h-8 rounded-full ring-2 ring-primary-500/20"
                    />
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      Explain the difference between Paging and Segmentation with TLB implications for our upcoming Unit 4 mid-term.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center text-white shrink-0 shadow-md">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1 glass-card rounded-2xl rounded-tl-sm p-4 text-xs sm:text-sm border border-primary-500/20 space-y-3">
                      <p className="font-semibold text-primary-600 dark:text-primary-300">
                        Operating Systems (Unit 4 - Virtual Memory Analysis)
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">
                        <strong>Paging</strong> breaks memory into fixed-size frames to avoid external fragmentation, whereas <strong>Segmentation</strong> maps variable-size logical modules. The Translation Lookaside Buffer (TLB) caches page translations with an effective access formula:
                      </p>
                      <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs">
                        EMAT = h · (t_TLB + t_mem) + (1 - h) · (t_TLB + 2 · t_mem)
                      </div>
                      <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-500">Verified Sources:</span>
                        <span className="px-2 py-0.5 rounded bg-primary-500/10 text-primary-500 font-medium">
                          [1] OS_Unit_4_Notes.pdf (p. 22)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-secondary-500/10 text-secondary-500 font-medium">
                          [2] University_PYQ_2024.pdf (p. 7)
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'search' && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs">
                    <Search className="w-4 h-4 text-primary-500" />
                    <span className="text-slate-900 dark:text-white font-medium">
                      "Dijkstra algorithm lecture notes"
                    </span>
                    <Badge variant="emerald" size="sm" className="ml-auto">
                      Found 8 verified files
                    </Badge>
                  </div>

                  <div className="p-3.5 rounded-xl border border-primary-500/30 bg-primary-500/5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Advanced Data Structures & Algorithms - Complete Handbook
                        </span>
                        <Badge variant="indigo" size="sm">
                          Verified by Dr. Evelyn Reed
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        184 pages • PDF • Graph Traversal, Dijkstra proof, AVL & Red-Black Trees
                      </p>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => navigate('/resources')}>
                      View Resource
                    </Button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Question 1 of 5 • Data Structures (Graph Theory)
                    </span>
                    <Badge variant="amber" size="sm">Medium Difficulty</Badge>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    What is the time complexity of Dijkstra's algorithm implemented using a binary min-heap?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                      A. O(V^2)
                    </div>
                    <div className="p-3 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
                      <span>B. O((V + E) log V)</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                      C. O(E log E + V)
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                      D. O(V log V)
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'planner' && (
                <motion.div
                  key="planner"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      Today's AI Optimized Timetable (Friday, Oct 30)
                    </span>
                    <Badge variant="emerald" size="sm">🔥 7-Day Streak Active</Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                      <span className="line-through text-slate-400">08:30 AM - 10:00 AM • Implement Dijkstra & Bellman-Ford in C++</span>
                      <Badge variant="emerald" size="sm">Completed</Badge>
                    </div>
                    <div className="p-2.5 rounded-xl border border-primary-500/30 bg-primary-500/5 flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">10:30 AM - 12:00 PM • Banker's Algorithm Numerical Problems</span>
                      <Badge variant="indigo" size="sm">Next Up</Badge>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="indigo" size="md" className="mb-3">
            Comprehensive Academic Suite
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Made for how students actually study
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base">
            Every feature is calibrated to help students understand concepts deeply, prepare for exams without panic, and stay ahead of academic requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card hoverEffect glow className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-5 border border-primary-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Contextual AI Chatbot
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Streams precise answers citing page numbers and syllabus units directly from your college's vector repository.
            </p>
          </Card>

          <Card hoverEffect glow className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/20">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Smart Resource Finder
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Typo-tolerant autocomplete, department & semester filters, and faculty-verified tags for lecture notes and solved PYQs.
            </p>
          </Card>

          <Card hoverEffect glow className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 flex items-center justify-center mb-5 border border-secondary-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Document Summarizer
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Instantly distills 50-page university circulars, internship guidelines, and syllabi into deadlines, requirements, and checklists.
            </p>
          </Card>

          <Card hoverEffect glow className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              AI Question Generator
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Produces unit-specific MCQs, immediate explanations, performance analytics, and error review modes.
            </p>
          </Card>

          <Card hoverEffect glow className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Personalized Study Planner
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Identifies weak topics, schedules daily focus blocks, tracks streaks, and dynamically rearranges with AI optimization.
            </p>
          </Card>

          <Card hoverEffect glow className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Admin Operations & Analytics
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time telemetry on query trends, vector DB indexing status, active users, and document approval pipelines.
            </p>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="cyan" size="md" className="mb-3">
            Workflow Architecture
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            How it fits into your week
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl glass-card relative border border-slate-200 dark:border-white/10">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white font-bold flex items-center justify-center mb-4">
              01
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Ask, Upload, or Search
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Students ask questions in plain English or drag and drop official university circulars, PDFs, and lecture handouts.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card relative border border-slate-200 dark:border-white/10">
            <div className="w-10 h-10 rounded-xl bg-secondary-600 text-white font-bold flex items-center justify-center mb-4">
              02
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              RAG & Qdrant Vector Retrieval
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              FastAPI embeds queries into high-dimensional space, matches verified department chunks in Qdrant, and synthesizes through Gemini LLM.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card relative border border-slate-200 dark:border-white/10">
            <div className="w-10 h-10 rounded-xl bg-electric-cyan text-slate-900 font-bold flex items-center justify-center mb-4">
              03
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Master Academics With Confidence
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Receive verified answers with page citations, download notes, generate targeted quizzes, and track completion streaks.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Showcase Section */}
      <section id="tech" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="indigo" size="md" className="mb-3">
            Engineered For Scale
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            What's under the hood
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-white/10 flex flex-col items-center gap-2">
            <Cpu className="w-6 h-6 text-primary-500" />
            <span className="font-bold text-sm text-slate-800 dark:text-white">React + Vite</span>
            <span className="text-[11px] text-slate-400">Ultra-fast frontend</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-white/10 flex flex-col items-center gap-2">
            <Layers className="w-6 h-6 text-secondary-500" />
            <span className="font-bold text-sm text-slate-800 dark:text-white">Node.js + Express</span>
            <span className="text-[11px] text-slate-400">Main API Gateway</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-white/10 flex flex-col items-center gap-2">
            <Zap className="w-6 h-6 text-electric-cyan" />
            <span className="font-bold text-sm text-slate-800 dark:text-white">FastAPI (Python)</span>
            <span className="text-[11px] text-slate-400">AI / RAG Pipeline</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-white/10 flex flex-col items-center gap-2">
            <Database className="w-6 h-6 text-secondary-500" />
            <span className="font-bold text-sm text-slate-800 dark:text-white">Qdrant Vector DB</span>
            <span className="text-[11px] text-slate-400">Semantic embeddings</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-white/10 flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-sm text-slate-800 dark:text-white">Gemini 1.5 Pro</span>
            <span className="text-[11px] text-slate-400">Reasoning & citations</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-white/10 flex flex-col items-center gap-2">
            <Code2 className="w-6 h-6 text-emerald-500" />
            <span className="font-bold text-sm text-slate-800 dark:text-white">PostgreSQL</span>
            <span className="text-[11px] text-slate-400">Relational metadata</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-2xl glass-card">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary-500 mb-1">
              12,500+
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
              Active Campus Students
            </div>
          </div>
          <div className="p-6 rounded-2xl glass-card">
            <div className="text-3xl sm:text-4xl font-extrabold text-secondary-500 mb-1">
              45,000+
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
              Verified Study Files
            </div>
          </div>
          <div className="p-6 rounded-2xl glass-card">
            <div className="text-3xl sm:text-4xl font-extrabold text-electric-cyan mb-1">
              99.4%
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
              Citation Accuracy
            </div>
          </div>
          <div className="p-6 rounded-2xl glass-card">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-500 mb-1">
              4.9 / 5
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
              Student Rating
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-tr from-primary-600 via-secondary-600 to-electric-cyan text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to find a calmer way to study?
            </h2>
            <p className="mt-4 text-white/80 text-sm sm:text-base">
              Join thousands of students and campus members leveraging intelligent automation today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/dashboard')}
                rightIcon={ArrowRight}
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl"
              >
                Launch Workspace Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 py-10 px-4 sm:px-8 text-xs text-slate-400 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="font-bold text-slate-700 dark:text-slate-300">CampusAI Assistant</span>
          <span>© 2026 All Rights Reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="hover:text-primary-500">Dashboard</Link>
          <Link to="/chat" className="hover:text-primary-500">AI Chat</Link>
          <Link to="/resources" className="hover:text-primary-500">Resources</Link>
          <Link to="/admin" className="hover:text-primary-500">Admin Portal</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
