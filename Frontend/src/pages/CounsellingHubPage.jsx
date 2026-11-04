import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
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
  Shield,
  Layers,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmbeddedChatbot } from '../components/common/EmbeddedChatbot';
import { aiClient } from '../services/api';
import { fadeInUp, staggerContainer } from '../utils/animations';

export const CounsellingHubPage = () => {
  const [counsellingList, setCounsellingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [scraping, setScraping] = useState(false);

  const handleRunScrapers = async () => {
    setScraping(true);
    toast.success('Initiating Scrapy counselling spiders in background...', { icon: '🏛️' });
    try {
      await aiClient.post('/spiders/run');
      toast.success('Scrapers active! Crawling MP DTE, JoSAA, CSAB seat allocations...', { duration: 4500 });
      setTimeout(fetchCounselling, 3500);
    } catch (err) {
      toast.error('Failed to trigger background spiders.');
    } finally {
      setScraping(false);
    }
  };

  // Load scraped counselling tracks from backend
  const fetchCounselling = async () => {
    setLoading(true);
    try {
      const res = await aiClient.get('/counselling');
      if (res.data && res.data.data) {
        setCounsellingList(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch from backend, loading fallback counselling tracks:', err);
      setCounsellingList([
        {
          Title: 'MP DTE B.Tech / B.E. Centralized Online Counselling 2026 (Round 1 & 2)',
          Provider: 'Directorate of Technical Education (DTE), Madhya Pradesh & MPOnline',
          Amount: 'TFW (Tuition Fee Waiver) Scheme Available (100% Tuition Waived) + Govt College Allotment',
          Deadline: 'Round 1 Choice Filling: July 2026 | Round 2: August 2026',
          Eligibility: '10+2 with Physics & Mathematics (min 45% marks) + Valid JEE Main 2026 Rank Card (MP Domicile 95% quota, All India 5% quota).',
          Link: 'https://dte.mponline.gov.in/'
        },
        {
          Title: 'MP DTE College Level Counselling (CLC) Round 2026 for Engineering',
          Provider: 'DTE MP & Participating Engineering Institutes (SGSITS, IET DAVV, JEC, MITS)',
          Amount: 'Institutional Vacant Seat Allocation across Government & Autonomous Institutes',
          Deadline: 'August - September 2026 (Direct College Reporting)',
          Eligibility: 'Candidates who appeared in JEE Main or 12th Board Examination with PCM. Direct physical reporting at participating colleges.',
          Link: 'https://dte.mponline.gov.in/'
        },
        {
          Title: 'MP DTE Lateral Entry B.Tech / B.E. Counselling 2026 (Diploma to 2nd Year)',
          Provider: 'Directorate of Technical Education (DTE), MP',
          Amount: 'Direct Admission into 3rd Semester (2nd Year) B.Tech Engineering Programmes',
          Deadline: 'June - July 2026',
          Eligibility: '3-Year Engineering Diploma from recognized Board (AICTE approved) with minimum 45% aggregate marks (40% for SC/ST/OBC of MP).',
          Link: 'https://dte.mponline.gov.in/'
        },
        {
          Title: 'MP DTE Tuition Fee Waiver (TFW) Scheme under B.Tech Allotment',
          Provider: 'Government of Madhya Pradesh Technical Education Dept',
          Amount: '100% Tuition Fee Exemption for the complete 4-year degree course',
          Deadline: 'Applied simultaneously during MP DTE Online Choice Filling',
          Eligibility: 'Merit rank in JEE Main + Annual family income of parents from all sources less than ₹8 Lakhs + MP Domicile Certificate.',
          Link: 'https://dte.mponline.gov.in/'
        },
        {
          Title: 'JoSAA 2026 Centralized Seat Allocation (IITs, NITs, IIITs & GFTIs)',
          Provider: 'Joint Seat Allocation Authority (JoSAA) & Ministry of Education',
          Amount: 'Central Govt Institute Seat Allotment + Fee Remission for SC/ST/PH/Income < 1L & 5L',
          Deadline: 'Registration & Choice Filling: June 2026 | Rounds 1 to 5 Allotment: June - July 2026',
          Eligibility: 'JEE (Advanced) 2026 rank for IITs; JEE (Main) 2026 Paper 1/2 rank for NITs, IIITs, and GFTIs. Must satisfy 75% aggregate in 12th board.',
          Link: 'https://josaa.nic.in/'
        },
        {
          Title: 'CSAB Special Rounds 2026 (Central Seat Allocation Board for NIT+ System)',
          Provider: 'Central Seat Allocation Board (CSAB) & National Institute of Technology',
          Amount: 'Direct Allotment to Vacant Seats in 32 NITs, 26 IIITs, and 38 Other-GFTIs',
          Deadline: 'Registration & Fresh Choice Filling: July - August 2026 (2 Special Rounds)',
          Eligibility: 'Candidates who appeared in JEE (Main) 2026 and meet basic eligibility. Open to all registered or non-registered JoSAA candidates.',
          Link: 'https://csab.nic.in/'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselling();
  }, []);

  // Filter logic
  const filteredCounselling = counsellingList.filter((c) => {
    const text = (
      (c.Title || '') +
      ' ' +
      (c.Provider || '') +
      ' ' +
      (c.Eligibility || '') +
      ' ' +
      (c.Amount || '')
    ).toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter === 'All') return true;
    if (categoryFilter === 'MP DTE') {
      return text.includes('dte') || text.includes('mponline') || text.includes('clc') || text.includes('madhya pradesh');
    }
    if (categoryFilter === 'JoSAA (IIT/NIT)') {
      return text.includes('josaa') || text.includes('iit') || text.includes('advanced');
    }
    if (categoryFilter === 'CSAB Special') {
      return text.includes('csab') || text.includes('supernumerary') || text.includes('neut');
    }
    if (categoryFilter === 'TFW 100% Waiver') {
      return text.includes('tfw') || text.includes('tuition fee waiver') || text.includes('remission');
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
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-card border border-indigo-500/20 bg-gradient-to-r from-indigo-600/15 via-blue-500/10 to-primary-600/10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" size="sm">
                🏛️ Centralized Admissions Portal
              </Badge>
              <Badge variant="emerald" size="sm" dot>
                MP DTE & JoSAA/CSAB Synchronized
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineering & Professional Counselling Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Track seat matrices, round timelines, opening & closing rank cutoffs, Tuition Fee Waiver (TFW 100% waiver), and direct official portal registrations.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleRunScrapers}
              disabled={scraping}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${scraping ? 'animate-spin' : ''}`} />
              {scraping ? 'Scraping Portals...' : 'Run Web Scrapers'}
            </button>
            <button
              onClick={fetchCounselling}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Sheets
            </button>
          </div>
        </div>

        {/* Quick Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200/60 dark:border-white/10">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Tracked Authorities</span>
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">MP DTE + JoSAA + CSAB</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">TFW Scheme</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">100% Tuition Waiver</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Target Institutes</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">IITs, NITs, SGSITS, IET</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Counselling Rounds</span>
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Rounds 1-6 + CLC</span>
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
                placeholder="Search counselling by exam, college, round, quota, or authority..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {['All', 'MP DTE', 'JoSAA (IIT/NIT)', 'CSAB Special', 'TFW 100% Waiver'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap shadow-2xs ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <span className="ml-auto text-xs text-slate-400 shrink-0">
                Showing {filteredCounselling.length} of {counsellingList.length}
              </span>
            </div>
          </div>

          {/* Cards List */}
          {loading ? (
            <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <div className="w-8 h-8 mx-auto border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500">Loading scraped counselling records...</p>
            </div>
          ) : filteredCounselling.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-800 dark:text-white">No counselling tracks match your filter</p>
              <p className="text-xs text-slate-500">Try adjusting your search keywords or category filters.</p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredCounselling.map((trk, i) => (
                <Card
                  key={i}
                  className="p-4 sm:p-5 hover:border-indigo-500/40 transition-all border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider truncate max-w-xs">
                          {trk.Provider || 'Counselling Authority'}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {trk.Title || 'Admissions Allotment Track'}
                      </h3>
                    </div>

                    <a
                      href={trk.Link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Benefit / Quota banner */}
                  <div className="mt-3 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      {trk.Amount || 'Seat Allocation & Fee Remission'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {trk.Deadline || 'Official Schedule'}
                    </span>
                  </div>

                  {/* Eligibility notes */}
                  <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Eligibility & Rank: </strong>
                    {trk.Eligibility || 'Refer to official counselling guidelines.'}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Dedicated Counselling Chatbot */}
        <div className="lg:col-span-5 sticky top-24">
          <EmbeddedChatbot
            mode="counselling"
            title="Counselling & Admissions AI"
            description="Specialized in MP DTE B.Tech, CLC, Lateral Entry, TFW & JoSAA/CSAB"
            icon={Compass}
            accentColor="indigo"
            placeholder="Ask: 'What is the cutoff for SGSITS Indore CSE in MP DTE?'"
            suggestedPrompts={[
              'MP DTE B.Tech Round 1 & 2 choice filling dates?',
              'TFW 100% Tuition Fee Waiver eligibility?',
              'JoSAA Round 6 closing ranks for NIT CSE?',
              'CSAB Special Round vacant seats and rules?',
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CounsellingHubPage;

