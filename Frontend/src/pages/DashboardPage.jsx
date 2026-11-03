import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  MessageSquare,
  FileText,
  HelpCircle,
  Calendar,
  Clock,
  Award,
  ArrowRight,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  ChevronRight,
  Flame,
  Compass,
  GraduationCap,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import {
  MOCK_RESOURCES,
  MOCK_NOTICES,
  MOCK_RECENT_SEARCHES,
  MOCK_RECOMMENDED_TOPICS,
  MOCK_STUDY_PLANNER,
} from '../data/mockData';
import { fadeInUp, staggerContainer } from '../utils/animations';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dynamic greeting based on current local time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const STATS = [
    { label: 'Weekly Study Hours', value: '42.5 hrs', change: '+14% vs last week', icon: Clock, color: 'text-primary-500 bg-primary-500/10' },
    { label: 'Documents Analyzed', value: '18 Docs', change: '4 new this week', icon: FileText, color: 'text-secondary-500 bg-secondary-500/10' },
    { label: 'MCQs Practiced', value: '154 MCQs', change: '88% accuracy rate', icon: HelpCircle, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Study Streak', value: '7 Days', change: '🔥 Personal Best', icon: Flame, color: 'text-amber-500 bg-amber-500/10' },
  ];

  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Top Welcome Banner */}
      <motion.div
        variants={fadeInUp}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-card border border-primary-500/20 bg-gradient-to-r from-primary-600/15 via-secondary-500/10 to-electric-cyan/10"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" size="sm">
                Academic Hub 2026
              </Badge>
              <Badge variant="emerald" size="sm" dot>
                All 3 Portals & Chatbots Active
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {greeting}, {user?.name || 'Alex'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              {user?.department || 'Computer Science & Engineering'} • {user?.semester || '6th Semester'} • ID: {user?.studentId || '2026-CS-882'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/scholarships')}
              leftIcon={Award}
              className="shadow-glow-sm"
            >
              Scholarships Hub
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/counselling')}
              leftIcon={Compass}
            >
              Counselling Portal
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 3 Dedicated Core Hubs with Specialized AI Chatbots */}
      <motion.div variants={fadeInUp} className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Specialized Hubs & Dedicated Chatbots
            </h2>
          </div>
          <span className="text-xs text-slate-400">Each hub contains its own live scrapers & dedicated AI advisor</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Hub 1: Scholarship Hub */}
          <Card
            onClick={() => navigate('/scholarships')}
            className="p-6 cursor-pointer hover:border-emerald-500/50 hover:shadow-lg transition-all border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent relative overflow-hidden group"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <Badge variant="emerald" size="sm">
                Dedicated Bot Inside
              </Badge>
            </div>

            <div className="mt-4 space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>Scholarships Central</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                49+ Scraped government (MPTAAS, MMVY) & corporate (Reliance, Tata, Birla) schemes with an integrated <strong>Scholarship AI Advisor</strong>.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Open Schemes & Chatbot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Card>

          {/* Hub 2: Counselling Hub */}
          <Card
            onClick={() => navigate('/counselling')}
            className="p-6 cursor-pointer hover:border-indigo-500/50 hover:shadow-lg transition-all border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent relative overflow-hidden group"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                <Compass className="w-6 h-6" />
              </div>
              <Badge variant="indigo" size="sm">
                Dedicated Bot Inside
              </Badge>
            </div>

            <div className="mt-4 space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                <span>Counselling & Seat Allocation</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                MP DTE Centralized, CLC, Lateral Entry, TFW 100% waiver, JoSAA & CSAB rounds with an integrated <strong>Counselling & Admissions AI</strong>.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Open Seat Matrix & Chatbot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Card>

          {/* Hub 3: Study Material Hub */}
          <Card
            onClick={() => navigate('/study-material')}
            className="p-6 cursor-pointer hover:border-amber-500/50 hover:shadow-lg transition-all border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent relative overflow-hidden group"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <Badge variant="amber" size="sm">
                Dedicated Bot Inside
              </Badge>
            </div>

            <div className="mt-4 space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>Academic Study Material Vault</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Solved PYQs, lecture notes & AICTE syllabus with in-site download, Google Drive sync & an integrated <strong>Academic Professor & PYQ Solver</strong>.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>Open Vault & PYQ Solver</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Stats Cards Row */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} hoverEffect glow className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {stat.value}
                </h3>
                <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> {stat.change}
                </span>
              </div>
              <div className={`p-3.5 rounded-2xl ${stat.color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </Card>
          );
        })}
      </motion.div>

      {/* Quick Launch Action Cards */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card
          onClick={() => navigate('/chat')}
          className="p-4 hover:border-primary-500/40 bg-gradient-to-br from-primary-500/5 to-transparent flex flex-col items-start gap-2.5 cursor-pointer"
        >
          <div className="p-2.5 rounded-xl bg-primary-500 text-white shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">General Campus AI</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Campus guidelines & chat</p>
          </div>
        </Card>

        <Card
          onClick={() => navigate('/study-material')}
          className="p-4 hover:border-cyan-500/40 bg-gradient-to-br from-cyan-500/5 to-transparent flex flex-col items-start gap-2.5 cursor-pointer"
        >
          <div className="p-2.5 rounded-xl bg-electric-cyan text-slate-900 shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Resource Vault</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Notes, PYQs, Lab files</p>
          </div>
        </Card>

        <Card
          onClick={() => navigate('/summarize')}
          className="p-4 hover:border-secondary-500/40 bg-gradient-to-br from-secondary-500/5 to-transparent flex flex-col items-start gap-2.5 cursor-pointer"
        >
          <div className="p-2.5 rounded-xl bg-secondary-600 text-white shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Summarizer</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Extract PDF deadlines</p>
          </div>
        </Card>

        <Card
          onClick={() => navigate('/quiz')}
          className="p-4 hover:border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 to-transparent flex flex-col items-start gap-2.5 cursor-pointer"
        >
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-sm">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Question Gen</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Unit practice MCQs</p>
          </div>
        </Card>
      </motion.div>

      {/* Bottom 2-Column Section: Top Academic Resources & Campus Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div variants={fadeInUp} className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Featured Academic PYQs & Notes
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/study-material')} rightIcon={ChevronRight}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {MOCK_RESOURCES.slice(0, 3).map((resource) => (
              <Card
                key={resource.id}
                hoverEffect
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500 shrink-0 mt-0.5 sm:mt-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                        {resource.category}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {resource.department}
                      </span>
                      {resource.facultyVerified && (
                        <Badge variant="emerald" size="sm" dot>
                          Verified
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
                      {resource.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-white/5">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/study-material')}
                    leftIcon={Download}
                  >
                    Direct Vault
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Right Sidebar: Campus Notices */}
        <motion.div variants={fadeInUp} className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Campus Circulars
              </h2>
            </div>
            <Badge variant="secondary" size="sm">
              Live
            </Badge>
          </div>

          <Card className="p-4 space-y-3">
            {MOCK_NOTICES.map((notice) => (
              <div
                key={notice.id}
                className="p-3 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <Badge variant={notice.priority === 'urgent' ? 'crimson' : 'indigo'} size="sm">
                    {notice.category}
                  </Badge>
                  <span className="text-[11px] text-slate-400">{notice.date}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-2 leading-snug">
                  {notice.title}
                </h4>
              </div>
            ))}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
