import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-100">
      <div className="ambient-glow" />
      <div className="relative z-10 max-w-md space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-black text-primary-600">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Campus Page Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          The requested syllabus node or academic URL does not exist in the indexed database.
        </p>
        <div className="pt-2">
          <Link to="/dashboard">
            <Button variant="primary" size="md" leftIcon={ArrowLeft}>
              Return to Student Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

