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
  const { login } = useAuth();

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

