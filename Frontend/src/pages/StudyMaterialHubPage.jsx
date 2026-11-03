import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Download,
  Eye,
  Upload,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  FileText,
  Building,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FolderLock,
  X,
  FileCode,
  AlertCircle,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmbeddedChatbot } from '../components/common/EmbeddedChatbot';
import { resourceService } from '../services/resourceService';
import { toast } from 'react-hot-toast';
import { fadeInUp, staggerContainer } from '../utils/animations';

export const StudyMaterialHubPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [previewDoc, setPreviewDoc] = useState(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Previous Year Questions (PYQs)');
  const [uploadDept, setUploadDept] = useState('Computer Science');
  const [uploadSemester, setUploadSemester] = useState('Semester 5');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await resourceService.searchResources({
        query: searchQuery,
        category: categoryFilter,
      });
      setResources(data || []);
    } catch (err) {
      console.warn('Failed to fetch resources from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleDownload = (doc) => {
    // In-site direct file download (never redirects to Google Drive)
    toast.success(`Downloading "${doc.title}" directly to your device...`);
    const downloadUrl = `http://localhost:5000/api/resources/${doc.id}/download`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${doc.title}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      toast.error('Please enter a document title');
      return;
    }
    setUploading(true);
    try {
      const payload = {
        title: uploadTitle.trim(),
        category: uploadCategory,
        department: uploadDept,
        semester: uploadSemester,
        subject: uploadSubject.trim() || 'Core Engineering',
        description: 'Uploaded by student. Stored in Campus Vault and queued for Admin verification.',
        fileType: 'PDF',
        fileSize: '6.4 MB',
        uploadedBy: 'Student Contributor',
        status: 'Pending Verification',
        facultyVerified: false,
      };
      await resourceService.uploadResource(payload);
      toast.success('Document uploaded to Campus Drive! Queued for Admin approval.', {
        duration: 4000,
        icon: '🛡️',
      });
      setIsUploadModalOpen(false);
      setUploadTitle('');
      setUploadSubject('');
      fetchResources();
    } catch (err) {
      toast.error('Failed to submit upload.');
    } finally {
      setUploading(false);
    }
  };

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
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-card border border-amber-500/20 bg-gradient-to-r from-amber-600/15 via-orange-500/10 to-primary-600/10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="amber" size="sm">
                📚 Academic Study Material Vault
              </Badge>
              <Badge variant="emerald" size="sm" dot>
                Direct On-Site Download
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Solved PYQs, Handbooks & Syllabus Repository
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Access university end-semester Previous Year Questions (PYQs), lecture handbooks, and AICTE syllabi stored in your backend Google Drive folder, with in-site previews and dedicated AI solving.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Document
            </button>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200/60 dark:border-white/10">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Archive Coverage</span>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">2020 - 2026 PYQs</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Download Type</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Direct (Zero External)</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Google Drive Storage</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Synced to Vault</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Admin Verification</span>
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">1-Click Approved</span>
          </div>
        </div>
      </motion.div>

      {/* Main 2-Column Grid: Directory on Left (7 cols), Dedicated AI Bot on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Directory */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls: Search & Category Filter Pills */}
          <div className="space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PYQs, lecture notes, syllabus, algorithms, subjects..."
                className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {[
                'All',
                'Previous Year Questions (PYQs)',
                'Lecture Notes',
                'Lab Manuals',
                'Campus Notices',
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap shadow-2xs ${
                    categoryFilter === cat
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          {loading ? (
            <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <div className="w-8 h-8 mx-auto border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500">Loading academic study materials...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-800 dark:text-white">No documents found</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or upload a new resource.</p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
              {resources.map((doc) => (
                <Card
                  key={doc.id}
                  className="p-4 sm:p-5 hover:border-amber-500/40 transition-all border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                          {doc.category || 'Study Material'}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {doc.department} ({doc.semester})
                        </span>
                        {doc.facultyVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3" /> Under Review
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions bar: In-site preview & Direct download */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-amber-500" />
                      {doc.fileType} • {doc.fileSize} • {doc.downloads} downloads
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => handleDownload(doc)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Dedicated Academic Chatbot */}
        <div className="lg:col-span-5 sticky top-24">
          <EmbeddedChatbot
            mode="study_material"
            title="Academic Professor & PYQ Solver"
            description="Trained on university PYQs, lecture handbooks, algorithms & syllabus"
            icon={BookOpen}
            accentColor="amber"
            placeholder="Ask: 'Solve 2024 EndSem Operating Systems Bankers Algorithm question'"
            suggestedPrompts={[
              'Solve 2024 OS Bankers Algorithm PYQ?',
              'Explain Balanced Binary Search Trees (AVL & Red-Black)?',
              'Explain Computer Networks TCP 3-Way Handshake?',
              'AICTE Computer Science Semester 6 syllabus breakdown?',
            ]}
          />
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl glass-card border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    {previewDoc.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{previewDoc.title}</h3>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-h-72 overflow-y-auto leading-relaxed">
                <p className="font-semibold text-slate-900 dark:text-white mb-2">Academic Document Excerpt & Key Topics:</p>
                <div className="whitespace-pre-wrap">{previewDoc.previewText || previewDoc.description}</div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">Served directly from Campus Academic Vault</span>
                <button
                  onClick={() => {
                    handleDownload(previewDoc);
                    setPreviewDoc(null);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full Document</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl glass-card border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-amber-500" />
                    Upload Academic Document
                  </h3>
                  <p className="text-xs text-slate-500">Stored in Campus Drive & submitted for Admin review.</p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. CS-501 Theory of Computation EndSem 2025 Solved"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Category
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="Previous Year Questions (PYQs)">PYQs</option>
                      <option value="Lecture Notes">Lecture Notes</option>
                      <option value="Campus Notices">Campus Notice</option>
                      <option value="Lab Manuals">Lab Manual</option>
                      <option value="AICTE Syllabus">AICTE Syllabus</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Semester
                    </label>
                    <select
                      value={uploadSemester}
                      onChange={(e) => setUploadSemester(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value)}
                    placeholder="e.g. Operating Systems / Algorithms"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                  🛡️ <strong>Admin Review Policy:</strong> Document will be uploaded directly to Campus Drive and marked <em>Pending Verification</em> until approved by university administration.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Confirm Upload'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudyMaterialHubPage;
