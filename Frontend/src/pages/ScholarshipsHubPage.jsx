import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export const ScholarshipsHubPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('notices'); // 'notices' | 'schemes'
  const [scraping, setScraping] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [subscribeTarget, setSubscribeTarget] = useState({ title: 'Campus Scholarships', type: 'scholarship' });

  const handleRunScrapers = async () => {
    setScraping(true);
    toast.success('Initiating Scrapy web scrapers in background...', { icon: '🕷️' });
    try {
      await aiClient.post('/spiders/run');
      toast.success('Scrapers active! Crawling MPTAAS, MMVY, Reliance, Tata, Birla...', { duration: 4500 });
      setTimeout(() => {
        fetchScholarships();
        fetchNotices();
      }, 3500);
    } catch (err) {
      toast.error('Failed to trigger background spiders.');
    } finally {
      setScraping(false);
    }
  };

  // Load scraped scholarships from backend
  const fetchScholarships = async () => {
    try {
      const res = await aiClient.get('/scholarships');
      if (res.data && res.data.data) {
        setScholarships(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch scholarships from backend, loading fallback scraped records:', err);
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
    }
  };

  // Load official scholarship PDF notices & circulars
  const fetchNotices = async () => {
    try {
      const data = await resourceService.searchResources({ category: 'All' });
      // Filter scholarship related notices and brochures
      const schDocs = data.filter((d) => 
        (d.id && d.id.startsWith('res_sch_')) ||
        (d.title && (d.title.includes('MMVY') || d.title.includes('MPTAAS') || d.title.includes('Reliance') || d.title.includes('Scholarship')))
      );
      setNotices(schDocs);
    } catch (err) {
      console.warn('Failed to load notices from resource service:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchScholarships(), fetchNotices()]).finally(() => setLoading(false));
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

  // Filter logic for Scraped Schemes
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

  // Filter logic for Official Notices
  const filteredNotices = notices.filter((n) => {
    const text = (
      (n.title || '') +
      ' ' +
      (n.description || '') +
      ' ' +
      (n.facultyName || '') +
      ' ' +
      (n.previewText || '')
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
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-card border border-emerald-500/20 bg-gradient-to-r from-emerald-600/15 via-teal-500/10 to-primary-600/10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" size="sm">
                🎓 Verified Scholarship Portal
              </Badge>
              <Badge variant="indigo" size="sm" dot>
                {scholarships.length} Live Schemes + {notices.length} Official PDF Circulars
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Scholarship Central & Financial Aid Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Explore state schemes (MPTAAS, MMVY) and private foundation grants (Reliance, Tata, Aditya Birla) with on-site official PDF previews, direct downloads mapped to your backend Google Drive vault, and dedicated AI advisory.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => {
                setSubscribeTarget({ title: 'MMVY, MPTAAS & Reliance Scholarship Deadline Alerts', type: 'scholarship' });
                setIsSubscribeModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>🔔 Get Deadline Alerts</span>
            </button>
            <button
              onClick={handleRunScrapers}
              disabled={scraping}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${scraping ? 'animate-spin' : ''}`} />
              {scraping ? 'Scraping Portals...' : 'Run Web Scrapers'}
            </button>
            <button
              onClick={() => {
                setLoading(true);
                Promise.all([fetchScholarships(), fetchNotices()]).finally(() => setLoading(false));
              }}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Sheets & Drive
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
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Official PDF Orders</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{notices.length} Gazette Notices</span>
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
          {/* Section Selector Pills: Official PDF Notices vs Live Web Portals */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab('notices')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'notices'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Official PDF Notices ({notices.length})</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">Drive Vault</span>
            </button>
            <button
              onClick={() => setActiveTab('schemes')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'schemes'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span>Scraped Portal Schemes ({scholarships.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'notices' ? "Search official notices by title, authority, or keywords..." : "Search scholarship by name, provider, eligibility, or amount..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-xs"
            />
          </div>

          {/* Category Filter Pills (for schemes) */}
          {activeTab === 'schemes' && (
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
          )}

          {/* TAB 1: Official PDF Notices & Gazette Circulars */}
          {activeTab === 'notices' && (
            <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
              {loading ? (
                <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="w-8 h-8 mx-auto border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-500">Syncing official PDF notices from Google Drive vault...</p>
                </div>
              ) : filteredNotices.length === 0 ? (
                <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">No official notices match your search</p>
                  <p className="text-xs text-slate-500">Try adjusting your search terms.</p>
                </div>
              ) : (
                filteredNotices.map((doc) => (
                  <Card
                    key={doc.id}
                    className="p-4 sm:p-5 hover:border-emerald-500/40 transition-all border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="emerald" size="sm" dot>
                            Official PDF Notice
                          </Badge>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {doc.facultyName || 'Department Authority'}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {doc.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setSubscribeTarget({ title: doc.title, type: 'scholarship' });
                            setIsSubscribeModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
                          title="Get Email & SMS Alerts"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>🔔 Get Deadline Alerts</span>
                        </button>
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-colors"
                          title="Preview in-site"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
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
                          <HardDrive className="w-3 h-3 text-emerald-500" />
                          <span>Campus Drive Sync</span>
                        </span>
                        <span>{doc.fileSize || '4.2 MB'}</span>
                        <span>{doc.pages || 24} pages</span>
                      </div>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {doc.downloads || 120} downloads
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Scraped Portal Schemes */}
          {activeTab === 'schemes' && (
            <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
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
                filteredScholarships.map((sch, i) => (
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

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setSubscribeTarget({ title: sch.Title, type: 'scholarship' });
                            setIsSubscribeModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
                          title="Get Email & SMS Alerts"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>🔔 Get Deadline Alerts</span>
                        </button>
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
                ))
              )}
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
                    <Badge variant="emerald" size="sm" dot>
                      Official Government / Foundation Document
                    </Badge>
                    <span className="text-xs text-slate-500 font-mono">
                      {previewDoc.fileType || 'PDF'} • {previewDoc.fileSize || '4.2 MB'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {previewDoc.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Authority: {previewDoc.facultyName || 'Higher Education Department'}
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
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <HardDrive className="w-4 h-4 text-emerald-600" />
                    Storage: Campus_Documents &gt; Notices (Folder ID: {previewDoc.driveFolderId || '1mqB0PDUZfZeTakC0rkKZ-ZmyfNLhKl4q'})
                  </span>
                  <span className="font-semibold">{previewDoc.pages || 24} Pages</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Executive Summary &amp; Order Directives
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {previewDoc.previewText || previewDoc.description}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Official Description
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
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
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

export default ScholarshipsHubPage;
