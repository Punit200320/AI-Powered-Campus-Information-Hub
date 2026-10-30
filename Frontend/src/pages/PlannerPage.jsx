import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  Flame,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Shuffle,
  BarChart2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MOCK_STUDY_PLANNER } from '../data/mockData';
import { plannerService } from '../services/plannerService';
import { fadeInUp, staggerContainer } from '../utils/animations';
import toast from 'react-hot-toast';

export const PlannerPage = () => {
  const [tasks, setTasks] = useState(MOCK_STUDY_PLANNER.todaySchedule);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [streak, setStreak] = useState(MOCK_STUDY_PLANNER.weeklyStreak);

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            toast.success(`Completed "${t.title.slice(0, 28)}..."!`, { icon: '🎯' });
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const handleOptimizeAI = async () => {
    setIsOptimizing(true);
    try {
      const optimized = await plannerService.optimizeScheduleWithAI(tasks);
      setTasks(optimized);
      toast.success('Schedule optimized based on highest-retention circadian peak!', {
        icon: '⚡',
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="indigo" size="sm">
              Adaptive Study Roadmap
            </Badge>
            <Badge variant="amber" size="sm" icon={Flame}>
              {streak}-Day Streak
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Personalized Academic Study Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Target: <strong>{MOCK_STUDY_PLANNER.targetExam}</strong> • {MOCK_STUDY_PLANNER.daysLeft} Days Remaining
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOptimizeAI}
          isLoading={isOptimizing}
          leftIcon={Sparkles}
          className="shadow-glow-sm"
        >
          AI Optimize Schedule
        </Button>
      </motion.div>

      {/* Overview Metric Row */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Today's Progress</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {completedCount} of {tasks.length} Done
            </h3>
            <p className="text-[11px] text-emerald-500 mt-1 font-semibold">{progressPercent}% Achieved</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            {progressPercent}%
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Daily Study Hours</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {MOCK_STUDY_PLANNER.completedHoursToday} / {MOCK_STUDY_PLANNER.dailyHoursGoal} hrs
            </h3>
            <p className="text-[11px] text-primary-500 mt-1 font-semibold">1.3 hrs remaining</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Weekly Consistency</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {streak} Days Consecutive
            </h3>
            <p className="text-[11px] text-amber-500 mt-1 font-semibold">🔥 Top 5% in CSE Dept</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </Card>
      </motion.div>

      {/* Main Grid: Today's Tasks + Weak Topics Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Today's Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Today's Scheduled Focus Blocks
                </h3>
              </div>
              <Badge variant="indigo" size="sm">
                Friday, Oct 30
              </Badge>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.005 }}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer select-none ${
                    task.completed
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-slate-200 dark:border-white/10 hover:border-primary-500/40 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                  onClick={() => toggleTask(task.id)}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-primary-500 hover:scale-110 transition-transform shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                          {task.subject}
                        </span>
                        <span className="text-[11px] text-slate-400">• {task.time}</span>
                      </div>

                      <Badge
                        variant={task.priority === 'high' ? 'rose' : task.priority === 'medium' ? 'amber' : 'neutral'}
                        size="sm"
                      >
                        {task.priority.toUpperCase()} PRIORITY
                      </Badge>
                    </div>

                    <h4
                      className={`text-sm font-bold text-slate-900 dark:text-white ${
                        task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Weekly Calendar Overview */}
          <Card className="p-6">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              Weekly Study Load (Monday - Sunday)
            </h4>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {MOCK_STUDY_PLANNER.weeklyCalendar.map((d, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 ${
                    d.status === 'completed'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : d.status === 'in-progress'
                      ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-300 font-bold'
                      : 'border-slate-200 dark:border-white/10 text-slate-400'
                  }`}
                >
                  <span className="font-bold">{d.day}</span>
                  <span className="text-[10px] opacity-75">{d.date}</span>
                  <span className="text-[11px] font-semibold mt-1">
                    {d.hours > 0 ? `${d.hours}h` : '-'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Weak Topic Mastery Breakdown */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5 text-primary-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Syllabus Mastery Diagnostics
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Algorithmically mapped from your recent mock quiz results and lab assignment grades:
            </p>

            <div className="space-y-4">
              {MOCK_STUDY_PLANNER.topicsMastery.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{item.topic}</span>
                    <span style={{ color: item.color }}>{item.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <span className="font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                AI Recommendation:
              </span>
              <p>
                Allocate 45 minutes on Saturday morning to re-read Banker's Algorithm deadlock avoidance notes in the <strong>Resource Finder</strong>.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default PlannerPage;

