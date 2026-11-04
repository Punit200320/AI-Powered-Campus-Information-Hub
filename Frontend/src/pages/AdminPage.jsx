import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  Database,
  FileText,
  Activity,
  Trash2,
  CheckCircle2,
  Upload,
  Search,
  Sparkles,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { MOCK_ADMIN_DATA } from '../data/mockData';
import { adminService } from '../services/adminService';
import { fadeInUp, staggerContainer } from '../utils/animations';
import toast from 'react-hot-toast';

export const AdminPage = () => {
  const [docQueue, setDocQueue] = useState(MOCK_ADMIN_DATA.documentsQueue);
  const [selectedDocToDelete, setSelectedDocToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchDocQuery, setSearchDocQuery] = useState('');

  // New document form state
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');

  const handleDeleteConfirm = async () => {
    if (!selectedDocToDelete) return;
    await adminService.deleteDocument(selectedDocToDelete.id);
    setDocQueue((prev) => prev.filter((d) => d.id !== selectedDocToDelete.id));
    toast.success(`Removed "${selectedDocToDelete.title}" from vector store.`, {
      icon: '🗑️',
    });
    setIsDeleteModalOpen(false);
    setSelectedDocToDelete(null);
  };

  const handleApprove = async (docId) => {
    await adminService.approveDocument(docId);
    setDocQueue((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'Indexed' } : d))
    );
    toast.success('Document approved and vector index synchronized!', {
      icon: '✅',
    });
  };

  const handleCreateDocument = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Document title is required');
      return;
    }

    const newDoc = {
      id: `doc_adm_${Date.now()}`,
      title: newTitle,
      department: newDept,
      uploadedBy: 'Dr. Evelyn Reed',
      status: 'Indexed',
      chunks: Math.floor(Math.random() * 200) + 50,
      uploadDate: 'Just now',
      vectorId: `qdrant_col_${Date.now()}`,
    };

    setDocQueue([newDoc, ...docQueue]);
    toast.success(`Indexed "${newTitle}" with ${newDoc.chunks} vector embeddings!`, {
      icon: '🚀',
    });
    setNewTitle('');
    setIsUploadModalOpen(false);
  };

  const filteredDocs = docQueue.filter(
    (d) =>
      d.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      d.uploadedBy.toLowerCase().includes(searchDocQuery.toLowerCase())
  );

  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="indigo" size="sm">
              Administrator Operations Portal
            </Badge>
            <Badge variant="emerald" size="sm" dot>
              Qdrant Vector Cluster Healthy
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Operations & RAG Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Monitor real-time student query volumes, vector storage allocations, and approve new academic handouts.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsUploadModalOpen(true)}
          leftIcon={Upload}
          className="shadow-glow-sm"
        >
          Index New Academic Document
        </Button>
      </motion.div>

      {/* Top 4 Metrics Cards */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Total Enrolled Students</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {MOCK_ADMIN_DATA.metrics.totalStudents.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-500 font-semibold mt-1">+120 this semester</p>
          </div>
          <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-500">
            <Users className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">AI Queries Today</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {MOCK_ADMIN_DATA.metrics.aiQueriesToday.toLocaleString()}
            </h3>
            <p className="text-[11px] text-primary-500 font-semibold mt-1">240ms avg latency</p>
          </div>
          <div className="p-3 rounded-2xl bg-secondary-500/10 text-secondary-500">
            <Activity className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Vector Storage Size</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {MOCK_ADMIN_DATA.metrics.vectorStorageSize}
            </h3>
            <p className="text-[11px] text-electric-cyan font-semibold mt-1">1,284 indexed files</p>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Database className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">System Uptime</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {MOCK_ADMIN_DATA.metrics.systemUptime}
            </h3>
            <p className="text-[11px] text-emerald-500 font-semibold mt-1">Zero outages logged</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </Card>
      </motion.div>

      {/* Recharts Analytics Chart */}
      <motion.div variants={fadeInUp}>
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Real-Time Query Traffic Distribution (Today)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hourly telemetry of student interactions and token throughput across campus
              </p>
            </div>
            <Badge variant="indigo" size="sm">
              Live WebSocket Stream
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ADMIN_DATA.queryTrends}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="queries"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorQueries)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Two columns: Document Management Table + Most Asked Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Document Management Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Document Knowledge Base & Vector Index
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage syllabus sources, approve faculty uploads, or revoke access
                </p>
              </div>

              {/* Table search filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter table..."
                  value={searchDocQuery}
                  onChange={(e) => setSearchDocQuery(e.target.value)}
                  className="glass-input rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 pr-4">Document Title</th>
                    <th className="pb-3 px-3">Department</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Chunks</th>
                    <th className="pb-3 pl-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {doc.title}
                        </div>
                        <div className="text-[10px] text-slate-400">Uploaded by {doc.uploadedBy}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                        {doc.department}
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge
                          variant={doc.status === 'Indexed' ? 'emerald' : 'amber'}
                          size="sm"
                          dot
                        >
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-500">
                        {doc.chunks}
                      </td>
                      <td className="py-3.5 pl-3 text-right space-x-1">
                        {doc.status !== 'Indexed' && (
                          <button
                            onClick={() => handleApprove(doc.id)}
                            className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10"
                            title="Approve & Index"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedDocToDelete(doc);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                          title="Delete from Vector Store"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Most Asked Questions */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-primary-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Trending Student Inquiries
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Top requested topics processed by the RAG pipeline this week:
            </p>

            <div className="space-y-3">
              {MOCK_ADMIN_DATA.popularQueries.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 max-w-[200px]">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      "{item.query}"
                    </div>
                    <Badge variant="indigo" size="sm" className="text-[10px] px-1.5 py-0">
                      {item.department}
                    </Badge>
                  </div>
                  <span className="font-mono text-slate-500 font-bold">
                    {item.count} asks
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Destructive Action Modal: Delete Document */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Vector Deletion"
        subtitle="This action permanently purges high-dimensional embeddings."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              Are you sure you want to remove <strong>"{selectedDocToDelete?.title}"</strong>? Students will no longer receive citations or AI summaries grounded in this file.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>

      {/* Index New Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Index Faculty Document to Vector DB"
        subtitle="Upload course materials to make them searchable and referenceable by the AI chatbot."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateDocument} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 block mb-1">
              Document Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Systems Lab Experiments 2026"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 block mb-1">
              Academic Department
            </label>
            <select
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              rightIcon={Sparkles}
            >
              Index & Synchronize
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default AdminPage;

