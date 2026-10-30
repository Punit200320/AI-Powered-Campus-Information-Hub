import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Shield,
  Building,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const ROLES = [
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'faculty', label: 'Faculty', icon: Briefcase },
    { id: 'admin', label: 'Admin', icon: Shield },
  ];

  const DEPARTMENTS = [
    'Computer Science & Engineering',
    'Artificial Intelligence & Data Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Business Administration (MBA)',
  ];

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Campus email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({ name, email, role, department });
      toast.success('Registration successful! Welcome to CampusAI.', {
        icon: '🎉',
      });
      navigate('/dashboard');
    } catch (err) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-100 selection:bg-primary-500/20 selection:text-primary-600 relative overflow-hidden">
      <div className="ambient-glow" />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 dark:border-white/10"
        >
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Campus<span className="text-primary-500">AI</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Create Account</p>
            </div>
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Register for CampusAI
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Join your university's intelligent learning ecosystem
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-2 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500/15 text-primary-600 dark:text-primary-300 font-semibold'
                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Jordan Miller"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={User}
              error={errors.name}
            />

            <Input
              label="Campus Email Address"
              type="email"
              placeholder="name@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={Mail}
              error={errors.email}
            />

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1.5">
                Department
              </label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-100 dark:bg-dark-surface text-slate-900 dark:text-white">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Choose Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              error={errors.password}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={ArrowRight}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              Sign in to your account
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 bg-gradient-to-br from-primary-950 via-dark-surface to-secondary-900/40 border-l border-white/10">
        <div className="max-w-lg space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Transform Your Academic Experience
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Gain immediate access to verified campus notes, AI question generation tailored to your university syllabus, and deadline trackers synchronized across all your courses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

