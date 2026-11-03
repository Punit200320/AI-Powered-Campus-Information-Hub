import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  BookOpen,
  Download,
  Bookmark,
  Star,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  Tag,
  Eye,
  SlidersHorizontal,
  Upload,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useBookmarks } from '../context/BookmarkContext';
import { resourceService } from '../services/resourceService';
import { MOCK_RESOURCES } from '../data/mockData';
import { fadeInUp, staggerContainer } from '../utils/animations';
import toast from 'react-hot-toast';

export const ResourceFinderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('All');
  const [department, setDepartment] = useState('All');
  const [semester, setSemester] = useState('All');
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Previous Year Questions (PYQs)');
  const [uploadDept, setUploadDept] = useState('Computer Science');
  const [uploadSemester, setUploadSemester] = useState('Semester 5');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      toast.error('Please enter a document title');
      return;
    }
    setUploading(true);
    try {
      const res = await resourceService.uploadResource({
        title: uploadTitle,
        category: uploadCategory,
        department: uploadDept,
        semester: uploadSemester,
        subject: uploadSubject || 'General',
        description: `${uploadCategory} for ${uploadDept} (${uploadSemester})`,
        uploadedBy: 'Student Contributor',
      });
      if (res.resource) {
        setResources((prev) => [res.resource, ...prev]);
      }
      toast.success('Document submitted! Status: Pending Admin Approval. It will be published upon faculty review.', {
        icon: '⏳',
        duration: 5000,
      });
      setIsUploadModalOpen(false);
      setUploadTitle('');
      setUploadSubject('');
    } catch (err) {
      toast.error('Upload failed. Check backend connection.');
    } finally {
      setUploading(false);
    }
  };

  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  const CATEGORIES = [
    'All',
    'Lecture Notes',
    'Previous Year Questions (PYQs)',
    'Lab Manuals',
    'Research Papers',
  ];

  const DEPARTMENTS = [
    'All',
    'Computer Science',
    'Artificial Intelligence',
    'Information Technology',
    'Electronics',
  ];

  const SEMESTERS = ['All', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7'];

  useEffect(() => {
    const fetchFiltered = async () => {
      const results = await resourceService.searchResources({
        query,
        category,
        department,
        semester,
      });
      setResources(results);
    };
    fetchFiltered();
  }, [query, category, department, semester]);

  const handleDownload = (res) => {
    setIsDownloading(true);
    try {
      // Direct in-site file download without going to external Google Drive
      const downloadUrl = `http://localhost:5000/api/resources/${res.id}/download`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${res.title.replace(/[^a-zA-Z0-9.-]/g, '_')}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading "${res.title.slice(0, 35)}..." directly from Campus Vault!`, {
        icon: '📥',
      });
    } catch (err) {
      toast.error('Download error. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = (res) => {
    setSelectedResource(res);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header section */}
      <motion.div variants={fadeInUp} className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="sm">
            Semantic Vector Catalog
          </Badge>
          <Badge variant="emerald" size="sm">
            {resources.length} verified documents
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Smart Resource Finder
          </h1>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={Upload}
          >
            Upload to Drive & Vault
          </Button>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Search indexed course syllabi, professor lecture notes, solved previous year university exam papers, and laboratory guides.
        </p>

        {/* Direct In-Site Academic Categories (No external redirect) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <button
            onClick={() => setCategory('Previous Year Questions (PYQs)')}
            className={`flex items-center gap-2.5 p-3 rounded-2xl glass-card border text-left transition-all ${
              category === 'Previous Year Questions (PYQs)'
                ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/50 dark:bg-blue-900/20'
                : 'border-blue-500/20 hover:border-blue-500/50'
            }`}
          >
            <span className="text-2xl">📄</span>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">PYQ Archive</div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">View & Download On-Site</div>
            </div>
          </button>

          <button
            onClick={() => setCategory('Notices')}
            className={`flex items-center gap-2.5 p-3 rounded-2xl glass-card border text-left transition-all ${
              category === 'Notices'
                ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/20'
                : 'border-emerald-500/20 hover:border-emerald-500/50'
            }`}
          >
            <span className="text-2xl">📢</span>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Campus Notices</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Exam & Form Circulars</div>
            </div>
          </button>

          <button
            onClick={() => setCategory('Lecture Notes')}
            className={`flex items-center gap-2.5 p-3 rounded-2xl glass-card border text-left transition-all ${
              category === 'Lecture Notes'
                ? 'border-purple-500 ring-2 ring-purple-500/30 bg-purple-50/50 dark:bg-purple-900/20'
                : 'border-purple-500/20 hover:border-purple-500/50'
            }`}
          >
            <span className="text-2xl">📚</span>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Lecture Notes</div>
              <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">Verified Faculty Notes</div>
            </div>
          </button>

          <button
            onClick={() => setCategory('Brochures')}
            className={`flex items-center gap-2.5 p-3 rounded-2xl glass-card border text-left transition-all ${
              category === 'Brochures'
                ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/50 dark:bg-amber-900/20'
                : 'border-amber-500/20 hover:border-amber-500/50'
            }`}
          >
            <span className="text-2xl">📑</span>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Brochures & Curricula</div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Syllabus & Guidelines</div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Modern Search Bar */}
      <motion.div variants={fadeInUp} className="relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic (e.g. Dijkstra, Virtual Memory, PyTorch attention, Banker's algorithm)..."
            className="w-full glass-input rounded-2xl pl-12 pr-10 py-3.5 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Filter Row */}
      <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card">
        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Department & Semester Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="glass-input rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept} className="bg-slate-100 dark:bg-dark-surface">
                Dept: {dept}
              </option>
            ))}
          </select>

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="glass-input rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem} className="bg-slate-100 dark:bg-dark-surface">
                {sem}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Search Results Grid */}
      <motion.div variants={fadeInUp} className="space-y-4">
        {resources.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-3xl space-y-3">
            <BookOpen className="w-12 h-12 mx-auto text-slate-400 opacity-60" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching resources found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try searching with broader terms or clear your department and category filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery('');
                setCategory('All');
                setDepartment('All');
                setSemester('All');
              }}
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((res) => {
              const bookmarked = isBookmarked(res.id);
              return (
                <Card
                  key={res.id}
                  hoverEffect
                  glow
                  className="p-5 flex flex-col justify-between border-slate-200/80 dark:border-white/10"
                >
                  <div className="space-y-3">
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="indigo" size="sm">
                          {res.category}
                        </Badge>
                        <Badge variant="neutral" size="sm">
                          {res.semester}
                        </Badge>
                        {res.facultyVerified && (
                          <Badge variant="emerald" size="sm" icon={CheckCircle2}>
                            Faculty Verified
                          </Badge>
                        )}
                      </div>

                      <button
                        onClick={() => toggleBookmark(res.id, res.title)}
                        className={`p-1.5 rounded-xl border transition-colors ${
                          bookmarked
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                            : 'border-slate-200 dark:border-white/10 text-slate-400 hover:text-amber-500'
                        }`}
                        title={bookmarked ? 'Remove bookmark' : 'Bookmark resource'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug hover:text-primary-500 transition-colors cursor-pointer"
                          onClick={() => handlePreview(res)}>
                        {res.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                        {res.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {res.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-500/10 hover:text-primary-500 cursor-pointer transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer metadata & buttons */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {res.rating}
                      </span>
                      <span>•</span>
                      <span>{res.downloads.toLocaleString()} downloads</span>
                      <span>•</span>
                      <span>{res.fileSize}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(res)}
                        leftIcon={Eye}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDownload(res)}
                        leftIcon={Download}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Resource Detail Preview Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedResource?.title}
        subtitle={`${selectedResource?.department} • ${selectedResource?.semester} • Verified by ${selectedResource?.facultyName}`}
        maxWidth="max-w-2xl"
      >
        {selectedResource && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="indigo" size="sm">
                Category: {selectedResource.category}
              </Badge>
              <Badge variant="cyan" size="sm">
                File: {selectedResource.fileType} ({selectedResource.fileSize})
              </Badge>
              <Badge variant="emerald" size="sm">
                {selectedResource.pages} Pages
              </Badge>
              <Badge variant="amber" size="sm">
                Rating: {selectedResource.rating} / 5.0
              </Badge>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Document Summary & Syllabus Fit
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedResource.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1">
              <span className="text-primary-400 text-[11px] block font-semibold">
                // Sample Content Preview (Page 1)
              </span>
              <p className="text-slate-300">{selectedResource.previewText}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
              <div className="text-xs text-slate-400">
                Uploaded {selectedResource.uploadedAt}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleBookmark(selectedResource.id, selectedResource.title)}
                  leftIcon={Bookmark}
                >
                  {isBookmarked(selectedResource.id) ? 'Bookmarked' : 'Save for Later'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    handleDownload(selectedResource);
                    setIsModalOpen(false);
                  }}
                  leftIcon={Download}
                >
                  Download PDF ({selectedResource.fileSize})
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Academic Document to Drive & Vault"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload PYQs, notices, lecture notes, or brochures. The file record is saved in our secure campus Database and organized into your dedicated Google Drive academic folder.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. Operating Systems End-Sem PYQ 2025"
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category / Section
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900"
              >
                <option value="Previous Year Questions (PYQs)">Previous Year Questions (PYQs)</option>
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Notices">Notices & Circulars</option>
                <option value="Brochures">Brochures & Curricula</option>
                <option value="Lab Manuals">Lab Manuals</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={uploadDept}
                onChange={(e) => setUploadDept(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <select
                value={uploadSemester}
                onChange={(e) => setUploadSemester(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900"
              >
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                placeholder="e.g. Operating Systems"
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400">
            🛡️ <strong>Admin Approval Workflow:</strong> Uploaded study materials and notices are sent to the review queue. Once verified by Faculty / Administrator in the Admin portal, they are automatically published for all students to view and download directly on this site.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={uploading} leftIcon={Upload}>
              {uploading ? 'Storing...' : 'Save & Link to Drive'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default ResourceFinderPage;

