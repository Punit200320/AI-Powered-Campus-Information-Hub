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
                Fall 2026 Academic Term
              </Badge>
              <Badge variant="emerald" size="sm" dot>
                Active Enrolled
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
              onClick={() => navigate('/chat')}
              leftIcon={MessageSquare}
              className="shadow-glow-sm"
            >
              Ask AI Campus Bot
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/resources')}
              leftIcon={BookOpen}
            >
              Find Resources
            </Button>
          </div>
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
          className="p-4 hover:border-primary-500/40 bg-gradient-to-br from-primary-500/5 to-transparent flex flex-col items-start gap-2.5"
        >
          <div className="p-2.5 rounded-xl bg-primary-500 text-white shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">AI Campus Chat</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instant syllabus Q&A</p>
          </div>
        </Card>

        <Card
          onClick={() => navigate('/resources')}
          className="p-4 hover:border-cyan-500/40 bg-gradient-to-br from-cyan-500/5 to-transparent flex flex-col items-start gap-2.5"
        >
          <div className="p-2.5 rounded-xl bg-electric-cyan text-slate-900 shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Resource Finder</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Notes, PYQs, Lab files</p>
          </div>
        </Card>

        <Card
          onClick={() => navigate('/summarize')}
          className="p-4 hover:border-secondary-500/40 bg-gradient-to-br from-secondary-500/5 to-transparent flex flex-col items-start gap-2.5"
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
          className="p-4 hover:border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 to-transparent flex flex-col items-start gap-2.5"
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

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recommended Topics & Recent Resources */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Recommended Topics */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  AI Recommended Learning Focus
                </h3>
              </div>
              <Badge variant="indigo" size="sm">
                Based on Unit Tests
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Areas requiring revision based on diagnostic performance and upcoming mid-term dates:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_RECOMMENDED_TOPICS.map((topic, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border bg-gradient-to-br ${topic.color} flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="opacity-90">{topic.subject}</span>
                      <span>{topic.confidence}</span>
                    </div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      {topic.title}
                    </h5>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      {topic.priority}
                    </span>
                    <button
                      onClick={() => navigate('/quiz')}
                      className="text-xs font-semibold underline hover:opacity-80 transition-opacity"
                    >
                      {topic.actionText} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recently Uploaded Verified Study Resources */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-electric-cyan" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Recently Uploaded Study Resources
                </h3>
              </div>
              <button
                onClick={() => navigate('/resources')}
                className="text-xs font-semibold text-primary-500 hover:underline"
              >
                View all ({MOCK_RESOURCES.length}) →
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {MOCK_RESOURCES.slice(0, 3).map((res) => (
                <div
                  key={res.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-500 transition-colors">
                        {res.title}
                      </span>
                      {res.facultyVerified && (
                        <Badge variant="emerald" size="sm">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {res.subject} • {res.category} • {res.fileSize}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => navigate('/resources')}
                      rightIcon={ChevronRight}
                    >
                      Inspect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Searches Pills */}
          <Card className="p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Your Recent Semantic Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {MOCK_RECENT_SEARCHES.map((query, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/resources?q=${encodeURIComponent(query)}`)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors border border-slate-200/50 dark:border-white/5"
                >
                  🔍 {query}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Upcoming Notices & Deadlines */}
        <div className="space-y-6">
          {/* Deadlines Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Academic Deadlines & Notices
                </h3>
              </div>
              <Badge variant="rose" size="sm">
                4 Active
              </Badge>
            </div>

            <div className="space-y-3">
              {MOCK_NOTICES.map((notice) => (
                <div
                  key={notice.id}
                  className="p-3.5 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/5 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {notice.title}
                    </span>
                    <Badge
                      variant={notice.urgency === 'high' ? 'rose' : notice.urgency === 'medium' ? 'amber' : 'indigo'}
                      size="sm"
                    >
                      {notice.badge}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {notice.content}
                  </p>
                  <div className="text-[10px] text-slate-400 font-medium">
                    📅 {notice.date}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Today's Schedule Mini Tracker */}
          <Card className="p-6 bg-gradient-to-br from-primary-500/5 to-transparent">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Study Timetable Status
                </h4>
              </div>
              <button
                onClick={() => navigate('/planner')}
                className="text-xs font-semibold text-primary-500 hover:underline"
              >
                Open Planner →
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Completed 2 of 5 tasks today ({MOCK_STUDY_PLANNER.completedHoursToday} / {MOCK_STUDY_PLANNER.dailyHoursGoal} hrs target)
            </p>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-electric-cyan rounded-full transition-all duration-500"
                style={{ width: `${(MOCK_STUDY_PLANNER.completedHoursToday / MOCK_STUDY_PLANNER.dailyHoursGoal) * 100}%` }}
              />
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;

