import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  CheckCircle2,
  X,
  Sparkles,
  Calendar,
  Shield,
  Send,
  AlertCircle,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Badge } from './Badge';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/api';
import toast from 'react-hot-toast';

export const NotificationSubscribeModal = ({
  isOpen,
  onClose,
  targetTitle = 'Campus Updates',
  targetType = 'scholarship', // 'scholarship' | 'counselling' | 'exam' | 'study_material' | 'general'
}) => {
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email || 'alex.vance@campus.edu');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('Semester 6');
  const [channels, setChannels] = useState(['EMAIL', 'SMS', 'WHATSAPP']);
  const [frequency, setFrequency] = useState('48h'); // '48h', 'instant', 'weekly'
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultData, setResultData] = useState(null);

  if (!isOpen) return null;

  const isExamOrStudy = targetType === 'exam' || targetType === 'study_material';

  // Dynamic preview message matching user's exact specification
  const getAlertPreview = () => {
    if (targetType === 'scholarship' || targetTitle.toLowerCase().includes('mmvy') || targetTitle.toLowerCase().includes('scholarship')) {
      return 'Reminder: MMVY Scholarship form closing on Nov 30! Complete verification on portal.';
    }
    if (targetType === 'counselling' || targetTitle.toLowerCase().includes('dte') || targetTitle.toLowerCase().includes('josaa') || targetTitle.toLowerCase().includes('counselling')) {
      return 'Live Alert: MP DTE Round 1 Allotment & JoSAA Seat Allocation is announced! Check merit rank & cutoff.';
    }
    if (isExamOrStudy) {
      return `Semester Exam Alert: ${branch} (${semester}) Final Exam Date Sheet & Solved PYQs (2020-2026) are uploaded to Campus Vault!`;
    }
    return `Campus Notice: Official circular published for ${targetTitle}. Check details immediately.`;
  };

  const toggleChannel = (ch) => {
    if (channels.includes(ch)) {
      if (channels.length > 1) {
        setChannels(channels.filter((c) => c !== ch));
      }
    } else {
      setChannels([...channels, ch]);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() && !phone.trim()) {
      toast.error('Please provide an email or phone number');
      return;
    }
    setIsLoading(true);

    try {
      const payload = {
        email: email.trim(),
        phone: phone.trim(),
        targetTitle,
        targetType,
        branch: isExamOrStudy ? branch : undefined,
        semester: isExamOrStudy ? semester : undefined,
        channels,
        frequency,
      };

      const res = await apiClient.post('/notifications/subscribe', payload);
      if (res.data && res.data.success) {
        setResultData(res.data);
        setIsSuccess(true);
        toast.success('Alerts active! Confirmation sent to your devices.', {
          icon: '🔔',
          duration: 4000,
        });
      }
    } catch (err) {
      toast.error('Failed to register notification subscription.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" size="sm" icon={Bell}>
                Instant Alert Service
              </Badge>
              <Badge variant="emerald" size="sm" dot>
                SMS + Email + WhatsApp
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isExamOrStudy
                ? 'Semester Exam & New PYQ Alerts'
                : targetType === 'counselling'
                ? 'Counselling & Seat Allotment Live Alerts'
                : 'Scholarship Deadline & Renewal Alerts'}
            </h2>
            <p className="text-xs text-slate-500 truncate max-w-sm">
              Topic: <strong className="text-slate-700 dark:text-slate-300">{targetTitle}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {!isSuccess ? (
          <form onSubmit={handleSubscribe} className="p-6 space-y-4">
            {/* Live Message Preview Box */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Automatic 48-Hour Alert Preview:
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-200/60 dark:bg-indigo-900/60">
                  SMS / WhatsApp / Email
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 font-mono italic bg-white/70 dark:bg-black/20 p-2.5 rounded-xl border border-indigo-100 dark:border-white/5">
                "{getAlertPreview()}"
              </p>
            </div>

            {/* Branch and Semester if Exam/PYQ */}
            {isExamOrStudy && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                    Your Branch / Department
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Technology">IT</option>
                    <option value="Artificial Intelligence & DS">AI & DS</option>
                    <option value="Mechanical Engineering">Mechanical</option>
                    <option value="Electronics & Communication">ECE</option>
                    <option value="Civil Engineering">Civil</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1">
                    Current Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Semester 1">1st Semester</option>
                    <option value="Semester 2">2nd Semester</option>
                    <option value="Semester 3">3rd Semester</option>
                    <option value="Semester 4">4th Semester</option>
                    <option value="Semester 5">5th Semester</option>
                    <option value="Semester 6">6th Semester</option>
                    <option value="Semester 7">7th Semester</option>
                    <option value="Semester 8">8th Semester</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Input
                label="Notification Email Address"
                type="email"
                placeholder="alex.vance@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={Mail}
                required
              />

              <Input
                label="Mobile Number (for SMS & WhatsApp)"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={Smartphone}
                required
              />
            </div>

            {/* Delivery Channels */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                Preferred Notification Channels
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'EMAIL', label: 'Email Digest', icon: Mail },
                  { id: 'SMS', label: 'SMS Texts', icon: Smartphone },
                  { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare },
                ].map((c) => {
                  const Icon = c.icon;
                  const isChecked = channels.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleChannel(c.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                        isChecked
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-white/10 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alert Frequency */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                Alert Trigger Frequency
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '48h', label: '48h Before' },
                  { id: 'instant', label: 'Instant Updates' },
                  { id: 'weekly', label: 'Weekly Summary' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrequency(f.id)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      frequency === f.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={isLoading}
              rightIcon={Send}
            >
              Activate Real-Time Alerts
            </Button>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Alerts Successfully Activated!
              </h3>
              <p className="text-xs text-slate-500">
                Automated 48-hour reminders and live announcements will be dispatched directly to your mobile number and email.
              </p>
            </div>

            {resultData?.delivery && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1.5 text-left text-xs font-mono">
                <div className="text-slate-400 font-semibold text-[10px] uppercase">Gateway Dispatch Status:</div>
                <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Email: {resultData.delivery.emailStatus}</span>
                </div>
                <div className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SMS: {resultData.delivery.smsStatus}</span>
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>WhatsApp: {resultData.delivery.whatsappStatus}</span>
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="md"
              onClick={onClose}
              className="mt-2"
            >
              Done
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NotificationSubscribeModal;
