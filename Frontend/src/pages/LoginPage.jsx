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
  GraduationCap,
  Briefcase,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogleOAuth2 } = useAuth();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('alex.vance@campus.edu');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const ROLES = [
    { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Alex Vance (CS 6th Sem)' },
    { id: 'faculty', label: 'Faculty', icon: Briefcase, desc: 'Dr. Evelyn Reed (AI Lead)' },
    { id: 'admin', label: 'Admin', icon: Shield, desc: 'Marcus Brody (IT Ops)' },
  ];

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') setEmail('alex.vance@campus.edu');
    if (selectedRole === 'faculty') setEmail('e.reed@campus.edu');
    if (selectedRole === 'admin') setEmail('m.brody@campus.admin');
  };

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
      await login(email, password, role);
      toast.success(`Welcome back, ${DEMO_USERS[role]?.name || 'Scholar'}!`, {
        icon: '👋',
      });
      if (role === 'admin') {
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

  const handleGoogleOAuth2 = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogleOAuth2({
        idToken: 'demo_google_id_token',
        role,
        department: 'Computer Science & Engineering',
      });
      toast.success(`Google OAuth2 verified! Signed in as ${role}.`, {
        icon: '🔐',
      });
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Google OAuth2 verification failed.');
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
              Select your academic role and authenticate
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-2">
              Select Academic Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500/15 text-primary-600 dark:text-primary-300 shadow-sm'
                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-semibold">{r.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 text-center">
              Active persona: <strong className="text-primary-500">{DEMO_USERS[role]?.name}</strong>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Campus Email Address"
              type="email"
              placeholder="username@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={Mail}
              error={errors.email}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
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
              <a href="#" className="text-primary-500 hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={ArrowRight}
            >
              Sign In as {ROLES.find((r) => r.id === role)?.label}
            </Button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-white/10 w-full absolute" />
              <span className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-3 text-[11px] uppercase tracking-wider text-slate-400 relative z-10 font-semibold">
                Or Single Sign-On
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleOAuth2}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google OAuth 2.0</span>
            </button>
          </form>

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

