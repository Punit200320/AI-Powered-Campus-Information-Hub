import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FileText,
  Download,
  Eye,
  X,
  HardDrive,
  BookOpen,
  Bell,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmbeddedChatbot } from '../components/common/EmbeddedChatbot';
import { NotificationSubscribeModal } from '../components/common/NotificationSubscribeModal';
import { aiClient } from '../services/api';
import { resourceService } from '../services/resourceService';
import { fadeInUp, staggerContainer } from '../utils/animations';

export const CounsellingHubPage = () => {
  const [counsellingList, setCounsellingList] = useState([]);
  const [brochures, setBrochures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('brochures'); // 'brochures' | 'tracks'
  const [scraping, setScraping] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [subscribeTarget, setSubscribeTarget] = useState({ title: 'Admissions & Allotment Rounds', type: 'counselling' });

  const handleRunScrapers = async () => {
    setScraping(true);
    toast.success('Initiating Scrapy counselling spiders in background...', { icon: '🏛️' });
    try {
      await aiClient.post('/spiders/run');
      toast.success('Scrapers active! Crawling MP DTE, JoSAA, CSAB seat allocations...', { duration: 4500 });
      setTimeout(() => {
        fetchCounselling();
        fetchBrochures();
      }, 3500);
    } catch (err) {
      toast.error('Failed to trigger background spiders.');
    } finally {
      setScraping(false);
    }
  };

  // Load scraped counselling tracks from backend
  const fetchCounselling = async () => {
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
          Amount: 'Spot & Vacant Seat Allocation in NITs, IIEST, IIITs and Other-GFTIs',
          Deadline: 'Special Round 1 & 2: Late July - August 2026',
          Eligibility: 'Valid JEE Main 2026 CRL rank. Candidates who did not register in JoSAA, did not get alloted, or withdrew are eligible.',
          Link: 'https://csab.nic.in/'
        }
      ]);
    }
  };

  // Load official admission rulebooks and brochures
  const fetchBrochures = async () => {
    try {
      const data = await resourceService.searchResources({ category: 'All' });
      // Filter counselling related brochures and notices
      const counselDocs = data.filter((d) =>
        (d.id && d.id.startsWith('res_counsel_')) ||
        (d.title && (d.title.includes('DTE') || d.title.includes('JoSAA') || d.title.includes('CSAB') || d.title.includes('Counselling') || d.title.includes('Rulebook')))
      );
      setBrochures(counselDocs);
    } catch (err) {
      console.warn('Failed to load brochures from resource service:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCounselling(), fetchBrochures()]).finally(() => setLoading(false));
  }, []);

  const handleDownload = (doc) => {
    toast.success(`Downloading "${doc.title}" PDF directly to your device...`);
    const downloadUrl = `http://localhost:5000/api/resources/${doc.id}/download`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${doc.title}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic for Scraped Tracks
  const filteredCounselling = counsellingList.filter((item) => {
    const text = (
      (item.Title || '') +
      ' ' +
      (item.Provider || '') +
      ' ' +
      (item.Eligibility || '') +
      ' ' +
      (item.Amount || '')
    ).toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter === 'All') return true;
    if (categoryFilter === 'MP DTE') {
      return text.includes('dte') || text.includes('clc') || text.includes('tfw') || text.includes('lateral');
    }
    if (categoryFilter === 'JoSAA/IIT') {
      return text.includes('josaa') || text.includes('iit') || text.includes('advanced');
    }
    if (categoryFilter === 'CSAB/NIT') {
      return text.includes('csab') || text.includes('nit') || text.includes('special round');
    }
    return true;
  });

  // Filter logic for Brochures
  const filteredBrochures = brochures.filter((b) => {
    const text = (
      (b.title || '') +
      ' ' +
      (b.description || '') +
      ' ' +
      (b.facultyName || '') +
      ' ' +
      (b.previewText || '')
    ).toLowerCase();
    return text.includes(searchQuery.toLowerCase());
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
                {counsellingList.length} Admission Tracks + {brochures.length} Official PDF Rulebooks
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Counselling &amp; Seat Allotment Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Navigate MP DTE Engineering (General, CLC, Lateral, TFW) and national admissions (JoSAA, CSAB) with on-site PDF brochure previews, direct downloads mapped to your backend Google Drive vault, and dedicated admission AI.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => {
                setSubscribeTarget({ title: 'MP DTE Round 1, JoSAA & CLC Live Allotment Alerts', type: 'counselling' });
                setIsSubscribeModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>🔔 Get Allotment Alerts</span>
            </button>
            <button
              onClick={handleRunScrapers}
              disabled={scraping}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${scraping ? 'animate-spin' : ''}`} />
              {scraping ? 'Scraping Portals...' : 'Run Web Scrapers'}
            </button>
            <button
              onClick={() => {
                setLoading(true);
                Promise.all([fetchCounselling(), fetchBrochures()]).finally(() => setLoading(false));
              }}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Sheets &amp; Drive
            </button>
          </div>
        </div>

        {/* Quick Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200/60 dark:border-white/10">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Total Tracks</span>
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{counsellingList.length} Tracks</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Official PDF Rulebooks</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{brochures.length} Rulebooks</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">State Portals</span>
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">MP DTE (CLC, TFW)</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">National Portals</span>
            <span className="text-xl font-bold text-secondary-600 dark:text-secondary-400">JoSAA &amp; CSAB Special</span>
          </div>
        </div>
      </motion.div>

      {/* Main 2-Column Grid: Directory on Left (7 cols), Dedicated AI Bot on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Directory */}
        <div className="lg:col-span-7 space-y-4">
          {/* Section Selector Pills: Official PDF Brochures vs Live Web Tracks */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab('brochures')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'brochures'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Official PDF Rulebooks ({brochures.length})</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">Drive Vault</span>
            </button>
            <button
              onClick={() => setActiveTab('tracks')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'tracks'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-primary-500" />
              <span>Counselling Tracks ({counsellingList.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'brochures' ? "Search official rulebooks by title, authority, or keywords..." : "Search counselling by title, rounds, quota, or eligibility..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xs"
            />
          </div>

          {/* Category Filter Pills (for tracks) */}
          {activeTab === 'tracks' && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {['All', 'MP DTE', 'JoSAA/IIT', 'CSAB/NIT'].map((cat) => (
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
          )}

          {/* TAB 1: Official PDF Rulebooks & Brochures */}
          {activeTab === 'brochures' && (
            <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
              {loading ? (
                <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="w-8 h-8 mx-auto border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-500">Syncing official admission rulebooks from Google Drive vault...</p>
                </div>
              ) : filteredBrochures.length === 0 ? (
                <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">No official rulebooks match your search</p>
                  <p className="text-xs text-slate-500">Try adjusting your search terms.</p>
                </div>
              ) : (
                filteredBrochures.map((doc) => (
                  <Card
                    key={doc.id}
                    className="p-4 sm:p-5 hover:border-indigo-500/40 transition-all border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="indigo" size="sm" dot>
                            Official Admission Rulebook
                          </Badge>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {doc.facultyName || 'Admission Authority'}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {doc.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setSubscribeTarget({ title: doc.title, type: 'counselling' });
                            setIsSubscribeModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
                          title="Get Email & SMS Alerts"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>🔔 Get Allotment Alerts</span>
                        </button>
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
                          title="Preview in-site"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                          title="Download PDF directly"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* Metadata & Synopsis */}
                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {doc.previewText || doc.description}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3 text-indigo-500" />
                          <span>Campus Drive Sync</span>
                        </span>
                        <span>{doc.fileSize || '11.4 MB'}</span>
                        <span>{doc.pages || 68} pages</span>
                      </div>
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {doc.downloads || 420} downloads
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Scraped Tracks */}
          {activeTab === 'tracks' && (
            <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
              {loading ? (
                <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="w-8 h-8 mx-auto border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-500">Loading scraped counselling records...</p>
                </div>
              ) : filteredCounselling.length === 0 ? (
                <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">No tracks match your filter</p>
                  <p className="text-xs text-slate-500">Try adjusting your search keywords or category filters.</p>
                </div>
              ) : (
                filteredCounselling.map((item, i) => (
                  <Card
                    key={i}
                    className="p-4 sm:p-5 hover:border-indigo-500/40 transition-all border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider truncate max-w-xs">
                            {item.Provider || 'Central / State Authority'}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {item.Title || 'Admissions Counselling Track'}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setSubscribeTarget({ title: item.Title, type: 'counselling' });
                            setIsSubscribeModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
                          title="Get Email & SMS Alerts"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>🔔 Get Allotment Alerts</span>
                        </button>
                      <a
                        href={item.Link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <span>Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      </div>
                    </div>

                    {/* Benefit / Fee waiver banner */}
                    <div className="mt-3 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 truncate max-w-md">
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.Amount || 'State Quota Seat Allotment'}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 ml-2">
                        <Calendar className="w-3 h-3" />
                        {item.Deadline ? item.Deadline.split('|')[0] : 'Active Schedule'}
                      </span>
                    </div>

                    {/* Eligibility notes */}
                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      <strong className="text-slate-800 dark:text-slate-200">Eligibility &amp; Norms: </strong>
                      {item.Eligibility || 'Refer to official DTE/JoSAA guidelines.'}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Column: Dedicated Counselling Chatbot */}
        <div className="lg:col-span-5 sticky top-24">
          <EmbeddedChatbot
            mode="counselling"
            title="Counselling &amp; Admissions AI"
            description="Trained on MP DTE, CLC, TFW Quota, JoSAA and CSAB procedures"
            icon={Compass}
            accentColor="indigo"
            placeholder="Ask: 'What rank is required for SGSITS Indore CSE in MP DTE?'"
            suggestedPrompts={[
              'How to apply for MP DTE TFW 100% fee waiver?',
              'College Level Counselling (CLC) round process in MP?',
              'JoSAA float, freeze, and slide rules?',
              'CSAB Special Round eligibility after JoSAA?',
            ]}
          />
        </div>
      </div>

      {/* In-Site Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="indigo" size="sm" dot>
                      Official Admission Authority Document
                    </Badge>
                    <span className="text-xs text-slate-500 font-mono">
                      {previewDoc.fileType || 'PDF'} • {previewDoc.fileSize || '11.4 MB'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {previewDoc.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Authority: {previewDoc.facultyName || 'Directorate of Technical Education'}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-800 dark:text-indigo-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <HardDrive className="w-4 h-4 text-indigo-600" />
                    Storage: Campus_Documents &gt; Brochures (Folder ID: {previewDoc.driveFolderId || '1xeX6Up5WTWc2LU2haBeo2boxAO28Ncsh'})
                  </span>
                  <span className="font-semibold">{previewDoc.pages || 68} Pages</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Official Synopsis &amp; Business Rules
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {previewDoc.previewText || previewDoc.description}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Full Description
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {previewDoc.description}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Direct In-Site Download (No external redirection)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleDownload(previewDoc);
                      setPreviewDoc(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Document</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Real-time Email & SMS Notification Subscription Modal */}
      <NotificationSubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        targetTitle={subscribeTarget.title}
        targetType={subscribeTarget.type}
      />
    </motion.div>
  );
};

export default CounsellingHubPage;
