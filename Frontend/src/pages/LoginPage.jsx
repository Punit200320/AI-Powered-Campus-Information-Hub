import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid campus email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const loggedUser = await login(email, password);
      toast.success(`Welcome back, ${loggedUser?.name || email.split('@')[0]}!`, {
        icon: '👋',
      });
      if (loggedUser?.role === 'admin' || email.trim().toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Authentication failed. Please verify credentials.');
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

      {/* Left Column: Premium Form Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 dark:border-white/10"
        >
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Campus<span className="text-primary-500">AI</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Academic Portal</p>
            </div>
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sign In to Your Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Unified authentication for students, faculty & administrators
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Campus Email Address"
              type="email"
              placeholder="e.g. admin@campus.edu or student email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={Mail}
              error={errors.email}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              error={errors.password}
            />

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Remember this device</span>
              </label>
              <Link to="/forgot-password" className="text-primary-500 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={ArrowRight}
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* OAuth2 - Google Single Sign-On */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            <span className="text-[11px] uppercase tracking-wide text-slate-400">or continue with</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          </div>

          <button
            type="button"
            aria-label="Continue with Google"
            onClick={() => {
              const authorizeUrl =
                import.meta.env.VITE_OAUTH_AUTHORIZE_URL || 'http://localhost:5000';
              window.location.href = `${authorizeUrl}/oauth2/authorization/google`;
            }}
            disabled={isLoading}
            className="w-full mt-4 inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
            </svg>
            Continue with Google
          </button>

          {/* Switch to Register */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have a campus account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Hero Graphic & Showcase */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 bg-gradient-to-br from-primary-900/40 via-dark-surface to-secondary-950/40 border-l border-white/10 overflow-hidden">
        <div className="max-w-lg space-y-8 z-10">
          <Badge variant="indigo" size="lg">
            University Identity Provider v2.4
          </Badge>

          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Seamless Single Sign-On for Campus Intelligence
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Access indexed lecture archives, dynamic course knowledge graphs, proctored AI quizzes, and departmental circular summaries with enterprise role-based security.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Instant sync with campus registrar & LMS credentials</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Role-governed vector collection access & document controls</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Real-time citation provenance tracking on all generated answers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
