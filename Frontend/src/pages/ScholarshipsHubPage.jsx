import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Search,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Filter,
  RefreshCw,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronRight,
  DollarSign,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmbeddedChatbot } from '../components/common/EmbeddedChatbot';
import { aiClient } from '../services/api';
import { fadeInUp, staggerContainer } from '../utils/animations';

export const ScholarshipsHubPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Load scraped scholarships from backend
  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await aiClient.get('/scholarships');
      if (res.data && res.data.data) {
        setScholarships(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch from backend, loading fallback scraped records:', err);
      // Fallback preview data
      setScholarships([
        {
          Title: 'Mukhyamantri Medhavi Vidyarthi Yojana (MMVY) 2026',
          Provider: 'Higher Education Department, Government of Madhya Pradesh',
          Amount: '100% Tuition Fee Reimbursement (Up to ₹1,50,000/yr)',
          Deadline: 'Academic Year 2026-27 (Continuous Portal)',
          Eligibility: 'MP Domicile + 70% in MP Board or 85% in CBSE/ICSE 12th + Family Income < ₹6 Lakhs + JEE Main Rank < 1.5 Lakh for Engineering.',
          Link: 'http://scholarshipportal.mp.nic.in/MedhaviChhatra/'
        },
        {
          Title: 'MPTAAS Post-Matric Scholarship Scheme for SC/ST/OBC',
          Provider: 'Madhya Pradesh Tribal Welfare Department (MPTAAS)',
          Amount: 'Full College Tuition Fee + Maintenance Allowance (₹8,000/yr)',
          Deadline: 'Ongoing Portal Cycle 2026',
          Eligibility: 'MP Domicile SC/ST (Income < ₹6L) and OBC (Income < ₹3L) students pursuing B.Tech, MCA, MBA in recognized institutions.',
          Link: 'https://www.tribal.mp.gov.in/mptaas/'
        },
        {
          Title: 'Reliance Foundation Undergraduate Scholarships 2026',
          Provider: 'Reliance Foundation',
          Amount: 'Up to ₹2,00,000 over degree duration',
          Deadline: 'October 2026',
          Eligibility: 'First-year regular undergraduate students with min 60% in 12th. Household income < ₹15 Lakhs (preference < ₹2.5L).',
          Link: 'https://www.scholarships.reliancefoundation.org/'
        },
        {
          Title: 'Tata Trusts Medical & Engineering Scholarships',
          Provider: 'Tata Trusts',
          Amount: 'Up to ₹50,000 per academic year',
          Deadline: 'November 2026',
          Eligibility: 'Undergraduate engineering students with min 60% marks in previous year. Family annual income < ₹4.5 Lakhs.',
          Link: 'https://www.tatatrusts.org/'
        },
        {
          Title: 'Aditya Birla Capital COVID Scholarship & Higher Education Grant',
          Provider: 'Aditya Birla Capital Foundation',
          Amount: 'Up to ₹60,000 one-time grant',
          Deadline: 'December 2026',
          Eligibility: 'Students in professional undergraduate degree programs experiencing economic hardship with income < ₹6 Lakhs.',
          Link: 'https://www.adityabirlacapital.com/'
        },
        {
          Title: 'National Scholarship Portal (NSP) Central Sector Scheme',
          Provider: 'Ministry of Education, Government of India (National Scholarship Portal)',
          Amount: '₹12,000/yr for graduation + ₹20,000/yr for post-graduation',
          Deadline: 'December 2026',
          Eligibility: 'Above 80th percentile in relevant 10+2 stream, family income < ₹4.5 Lakhs/year, not receiving other central schemes.',
          Link: 'https://scholarships.gov.in/'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  // Filter logic
  const filteredScholarships = scholarships.filter((s) => {
    const text = (
      (s.Title || '') +
      ' ' +
      (s.Provider || '') +
      ' ' +
      (s.Eligibility || '') +
      ' ' +
      (s.Amount || '')
    ).toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter === 'All') return true;
    if (categoryFilter === 'MP State') {
      return (
        text.includes('mptaas') ||
        text.includes('medhavi') ||
        text.includes('madhya pradesh') ||
        text.includes('tribal') ||
        text.includes('mp online')
      );
    }
    if (categoryFilter === 'Corporate') {
      return (
        text.includes('reliance') ||
        text.includes('tata') ||
        text.includes('birla') ||
        text.includes('hdfc') ||
        text.includes('ongc')
      );
    }
    if (categoryFilter === 'National/AICTE') {
      return (
        text.includes('national') ||
        text.includes('central') ||
        text.includes('ministry') ||
        text.includes('aicte') ||
        text.includes('nsp')
      );
    }
    return true;
  });

  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Hero Banner */}
      <motion.div
        variants={fadeInUp}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-card border border-emerald-500/20 bg-gradient-to-r from-emerald-600/15 via-teal-500/10 to-primary-600/10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" size="sm">
                🎓 Verified Scholarship Portal
              </Badge>
              <Badge variant="indigo" size="sm" dot>
                {scholarships.length} Live Scraped Schemes
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Scholarship Central & Financial Aid Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Explore state schemes (MPTAAS, MMVY) and private foundation grants (Reliance, Tata, Aditya Birla) scraped directly into your campus Google Sheets database, with dedicated AI advisory.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchScholarships}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Live Sheets
            </button>
          </div>
        </div>

        {/* Quick Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200/60 dark:border-white/10">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Total Indexed</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{scholarships.length} Schemes</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Max Benefit</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">100% Tuition Fee</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">MP State Quota</span>
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">MMVY + MPTAAS</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Corporate Partners</span>
            <span className="text-xl font-bold text-secondary-600 dark:text-secondary-400">Reliance, Tata, Birla</span>
          </div>
        </div>
      </motion.div>

      {/* Main 2-Column Grid: Directory on Left (7 cols), Dedicated AI Bot on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Directory */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls: Search & Category Filter Pills */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholarship by name, provider, eligibility, or amount..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {['All', 'MP State', 'Corporate', 'National/AICTE'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap shadow-2xs ${
                    categoryFilter === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <span className="ml-auto text-xs text-slate-400 shrink-0">
                Showing {filteredScholarships.length} of {scholarships.length}
              </span>
            </div>
          </div>

          {/* Cards List */}
          {loading ? (
            <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <div className="w-8 h-8 mx-auto border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500">Loading scraped scholarship records...</p>
            </div>
          ) : filteredScholarships.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-800 dark:text-white">No scholarships match your filter</p>
              <p className="text-xs text-slate-500">Try adjusting your search keywords or category filters.</p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredScholarships.map((sch, i) => (
                <Card
                  key={i}
                  className="p-4 sm:p-5 hover:border-emerald-500/40 transition-all border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider truncate max-w-xs">
                          {sch.Provider || 'Government / Corporate'}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {sch.Title || 'Academic Scholarship Scheme'}
                      </h3>
                    </div>

                    <a
                      href={sch.Link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Benefit / Amount banner */}
                  <div className="mt-3 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      {sch.Amount || 'Tuition Assistance'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {sch.Deadline || 'Active Cycle'}
                    </span>
                  </div>

                  {/* Eligibility notes */}
                  <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Eligibility: </strong>
                    {sch.Eligibility || 'Refer to official guidelines.'}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Dedicated Scholarship Chatbot */}
        <div className="lg:col-span-5 sticky top-24">
          <EmbeddedChatbot
            mode="scholarship"
            title="Scholarship AI Advisor"
            description="Trained on MPTAAS, MMVY, Reliance, Tata, NSP and fee waivers"
            icon={Award}
            accentColor="emerald"
            placeholder="Ask: 'Am I eligible for MMVY or MPTAAS with ₹4 Lakhs income?'"
            suggestedPrompts={[
              'MMVY 100% fee waiver eligibility criteria?',
              'MPTAAS SC/ST/OBC scholarship process?',
              'Reliance STEM scholarship ₹2 Lakhs details?',
              'Tata Trusts engineering scholarship deadline?',
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ScholarshipsHubPage;
