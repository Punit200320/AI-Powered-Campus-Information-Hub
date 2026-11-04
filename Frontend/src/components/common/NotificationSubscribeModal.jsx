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
  targetType = 'scholarship', // 'scholarship' | 'counselling' | 'general'
}) => {
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email || 'alex.vance@campus.edu');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [channels, setChannels] = useState(['EMAIL', 'SMS', 'WHATSAPP']);
  const [frequency, setFrequency] = useState('48h'); // '48h', 'instant', 'weekly'
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultData, setResultData] = useState(null);

  if (!isOpen) return null;

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
              Subscribe to Deadline &amp; Result Alerts
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
                label="Mobile Number (for SMS &amp; WhatsApp)"
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
                You will receive automated reminders before registration closes and when merit rounds are announced.
              </p>
            </div>

            {resultData?.delivery && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1.5 text-left text-xs font-mono">
                <div className="text-slate-400 font-semibold text-[10px] uppercase">Gateway Status:</div>
                <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Email: {resultData.delivery.emailStatus}</span>
                </div>
                <div className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SMS: {resultData.delivery.smsStatus}</span>
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
