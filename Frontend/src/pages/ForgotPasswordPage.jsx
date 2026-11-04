import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Smartphone,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import toast from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { ssoLogin } = useAuth();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('alex.vance@campus.edu');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Request Reset OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid campus email address');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await apiClient.post('/auth/forgot-password', { email: email.trim() });
      if (res.data && res.data.success) {
        setDemoOtp(res.data.demoOtp || '');
        setOtp(res.data.demoOtp || ''); // pre-fill for convenient testing
        toast.success(res.data.message || 'Reset code sent to your email!', { icon: '📧' });
        setStep(2);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send reset code. Please check your email.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit code sent to your email');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await apiClient.post('/auth/verify-otp', {
        email: email.trim(),
        otp: otp.trim(),
      });
      if (res.data && res.data.success) {
        toast.success('Code verified successfully!', { icon: '✅' });
        setStep(3);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid or expired code.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await apiClient.post('/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword,
      });

      if (res.data && res.data.success) {
        toast.success('Password updated! Signing you in...', { icon: '🎉', duration: 4000 });
        if (res.data.token && res.data.user) {
          ssoLogin(res.data.user, res.data.token);
        }
        setStep(4);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to reset password. Please retry.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-100 selection:bg-primary-500/20 selection:text-primary-600 relative overflow-hidden">
      <div className="ambient-glow" />

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 dark:border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
            <Badge variant="indigo" size="sm">
              Account Recovery
            </Badge>
          </div>

          <div className="mb-6 space-y-1">
            <div className="w-10 h-10 rounded-xl bg-primary-600/15 border border-primary-500/30 flex items-center justify-center text-primary-500 mb-3 shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recover access to your CampusAI student or admin workspace
            </p>
          </div>

          {/* Stepper Progress Pills */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  step >= s ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Email Address */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Enter your registered campus email address. We will dispatch a 6-digit verification code to your inbox and SMS.
              </p>

              <Input
                label="Campus Email Address"
                type="email"
                placeholder="alex.vance@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={Mail}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
                rightIcon={ArrowRight}
              >
                Send 6-Digit Code
              </Button>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Code dispatched to {email}</span>
                </div>
                {demoOtp && (
                  <p className="font-mono text-[11px] pt-1">
                    Demo Verification Code: <strong className="text-base text-emerald-600 dark:text-emerald-400">{demoOtp}</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-2">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="626785"
                  className="w-full tracking-widest text-center text-xl font-mono font-bold py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Didn't get the code?</span>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-primary-500 hover:underline font-semibold"
                >
                  Resend Code
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
                rightIcon={ArrowRight}
              >
                Verify &amp; Continue
              </Button>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Choose a strong new password for your account.
              </p>

              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={Lock}
                rightIcon={showPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowPassword(!showPassword)}
                required
              />

              <Input
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={Lock}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
                rightIcon={ShieldCheck}
              >
                Update Password &amp; Log In
              </Button>
            </form>
          )}

          {/* STEP 4: Success State */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Password Updated Successfully!
                </h3>
                <p className="text-xs text-slate-500">
                  Redirecting to your personalized campus workspace...
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
