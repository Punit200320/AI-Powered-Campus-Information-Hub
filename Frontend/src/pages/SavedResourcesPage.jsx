import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, BookOpen, Download, Trash2, ArrowRight, Star, FileText } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useBookmarks } from '../context/BookmarkContext';
import { resourceService } from '../services/resourceService';
import { MOCK_RESOURCES } from '../data/mockData';
import { fadeInUp, staggerContainer } from '../utils/animations';
import toast from 'react-hot-toast';

export const SavedResourcesPage = () => {
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [allResources, setAllResources] = useState(MOCK_RESOURCES);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await resourceService.searchResources();
        if (data && data.length > 0) {
          setAllResources(data);
        }
      } catch (err) {
        console.warn('Fallback to mock resources for saved list');
      }
    };
    load();
  }, []);

  const savedList = allResources.filter((r) => bookmarks.includes(r.id));

  const handleDownload = (res) => {
    toast.success(`Downloading "${res.title.slice(0, 32)}..." PDF directly to your device`, { icon: '📥' });
    const downloadUrl = `http://localhost:5000/api/resources/${res.id}/download`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${res.title.replace(/[^a-zA-Z0-9.-]/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="amber" size="sm" icon={Bookmark}>
            Starred Library
          </Badge>
          <Badge variant="indigo" size="sm">
            {savedList.length} Items Saved
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Saved Study Materials
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Your offline-accessible collection of high-yield lecture slides, solved exam papers, and laboratory guides with direct on-site downloading.
        </p>
      </motion.div>

      {savedList.length === 0 ? (
        <Card className="p-12 text-center max-w-md mx-auto space-y-4">
          <Bookmark className="w-12 h-12 mx-auto text-slate-400 opacity-60" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Your collection is empty
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click the bookmark icon on any lecture note or PYQ in the Study Material Vault to save it for quick revision.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/study-material')}
            rightIcon={ArrowRight}
          >
            Explore Study Vault
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedList.map((res) => (
            <Card
              key={res.id}
              hoverEffect
              className="p-5 flex flex-col justify-between space-y-4 border border-slate-200/80 dark:border-white/10"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="indigo" size="sm">
                    {res.category || 'Academic Resource'}
                  </Badge>
                  <button
                    onClick={() => toggleBookmark(res.id)}
                    className="p-1 text-amber-500 hover:text-slate-400 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {res.department} • {res.semester}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {res.fileType || 'PDF'} • {res.fileSize || '6 MB'}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(res)}
                  leftIcon={Download}
                >
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SavedResourcesPage;
