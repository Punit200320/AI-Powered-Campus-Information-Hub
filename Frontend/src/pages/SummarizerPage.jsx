import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  Calendar,
  CheckSquare,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Download,
  Copy,
  Check,
  Clock,
  Layers,
  FileCheck,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { summarizerService } from '../services/summarizerService';
import { fadeInUp, staggerContainer } from '../utils/animations';
import toast from 'react-hot-toast';

export const SummarizerPage = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ stage: '', percent: 0 });
  const [summaryData, setSummaryData] = useState(null);
  const [copied, setCopied] = useState(false);

  const sampleDocs = summarizerService.getSampleDocs();

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setSummaryData(null);

    try {
      const summary = await summarizerService.summarizeDocument(selectedFile, (status) => {
        setProgress(status);
      });
      setSummaryData(summary);
      toast.success('Document analysis complete!');
    } catch (err) {
      toast.error('Failed to analyze document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = (sample) => {
    setFile({ name: sample.name, size: sample.size });
    processFile({ name: sample.name, size: sample.size });
  };

  const handleCopySummary = () => {
    if (!summaryData) return;
    const text = `${summaryData.title}\n\nOVERVIEW:\n${summaryData.executiveOverview}\n\nIMPORTANT DATES:\n${summaryData.importantDates.map((d) => `${d.label}: ${d.date}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="sm">
            AI Document Intelligence
          </Badge>
          <Badge variant="cyan" size="sm">
            Gemini Multimodal Parsing
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Campus Circular & Syllabus Summarizer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Instantly extract critical application deadlines, eligibility criteria, required documents, and execution steps from 30+ page university circulars and syllabi.
        </p>
      </motion.div>

      {/* Upload Zone & Samples Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Drop Zone */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`glass-card rounded-3xl p-8 border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
              isDragging
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-slate-300 dark:border-white/10 hover:border-primary-500/50'
            }`}
          >
            <input
              type="file"
              id="fileInput"
              accept=".pdf,.docx,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
            <label htmlFor="fileInput" className="cursor-pointer w-full flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-primary-500/10 text-primary-500 flex items-center justify-center mb-4 shadow-sm border border-primary-500/20">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Drop your campus document here, or <span className="text-primary-500 underline">browse</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Supports PDF, DOCX, and TXT up to 50MB (Placement policies, syllabi, exam timetables, regulations)
              </p>
            </label>

            {/* Selected File Details */}
            {file && (
              <div className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <FileText className="w-4 h-4 text-primary-500" />
                <span>{file.name}</span>
                {file.size && <span className="text-slate-400 font-normal">({file.size})</span>}
              </div>
            )}
          </div>
        </motion.div>

        {/* 1-Click Sample Previews */}
        <motion.div variants={fadeInUp} className="space-y-3">
          <Card className="p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              1-Click Sample Documents
            </h4>
            <div className="space-y-2">
              {sampleDocs.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleLoadSample(sample)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary-500/40 hover:bg-primary-500/5 cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white truncate max-w-[190px]">
                      {sample.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {sample.size} • {sample.pages} pages
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="px-2 py-1 text-xs">
                    Analyze
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Animated Multi-stage Processing Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="p-6 glass-card rounded-3xl border border-primary-500/30 text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary-500 animate-ping" />
              <h4 className="text-sm font-bold text-primary-600 dark:text-primary-400">
                {progress.stage || 'Synthesizing with Gemini AI...'}
              </h4>
            </div>

            {/* Progress bar */}
            <div className="max-w-md mx-auto w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-electric-cyan"
                animate={{ width: `${progress.percent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-xs text-slate-400">
              Parsing table schemas, calendar entities, and eligibility prerequisites...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render Structured Summary Results */}
      {summaryData && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Executive Overview Card */}
          <Card className="p-6 border-primary-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <Badge variant="indigo" size="sm" className="mb-2">
                  AI Synthesis Complete
                </Badge>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {summaryData.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopySummary}
                  leftIcon={copied ? Check : Copy}
                >
                  {copied ? 'Copied' : 'Copy Summary'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast.success('Exported clean Markdown summary!')}
                  leftIcon={Download}
                >
                  Export Markdown
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Executive Summary
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {summaryData.executiveOverview}
              </p>
            </div>
          </Card>

          {/* 4 Cards Grid for Structured Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Important Dates */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4 text-rose-500">
                <Calendar className="w-5 h-5" />
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  Important Dates & Deadlines
                </h4>
              </div>
              <div className="space-y-3">
                {summaryData.importantDates.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.label}
                    </span>
                    <Badge variant="rose" size="sm" className="shrink-0 font-bold">
                      {item.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* 2. Eligibility Requirements */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4 text-emerald-500">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  Eligibility Criteria
                </h4>
              </div>
              <div className="space-y-2.5">
                {summaryData.eligibilityRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 3. Required Documents Checklist */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4 text-primary-500">
                <FileCheck className="w-5 h-5" />
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  Mandatory Submission Checklist
                </h4>
              </div>
              <div className="space-y-2.5">
                {summaryData.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      id={`chk_${idx}`}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 mt-0.5"
                    />
                    <label htmlFor={`chk_${idx}`} className="cursor-pointer">
                      {doc}
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            {/* 4. Actionable Application Procedures */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4 text-secondary-500">
                <Layers className="w-5 h-5" />
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  Application Procedures
                </h4>
              </div>
              <div className="space-y-2.5">
                {summaryData.applicationProcedures.map((proc, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-lg bg-secondary-500/20 text-secondary-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{proc}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SummarizerPage;

