import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, BookOpen, Download, Trash2, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useBookmarks } from '../context/BookmarkContext';
import { MOCK_RESOURCES } from '../data/mockData';
import { fadeInUp, staggerContainer } from '../utils/animations';
import toast from 'react-hot-toast';

export const SavedResourcesPage = () => {
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useBookmarks();

  const savedList = MOCK_RESOURCES.filter((r) => bookmarks.includes(r.id));

  const handleDownload = (res) => {
    toast.success(`Downloaded "${res.title.slice(0, 32)}..."`, { icon: '📥' });
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
          Your offline-accessible collection of high-yield lecture slides, solved exam papers, and laboratory guides.
        </p>
      </motion.div>

      {savedList.length === 0 ? (
        <Card className="p-12 text-center max-w-md mx-auto space-y-4">
          <Bookmark className="w-12 h-12 mx-auto text-slate-400 opacity-60" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Your collection is empty
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click the bookmark icon on any lecture note or PYQ in the Resource Finder to save it for quick revision.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/resources')}
            rightIcon={ArrowRight}
          >
            Explore Resource Catalog
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedList.map((res) => (
            <Card
              key={res.id}
              hoverEffect
              glow
              className="p-5 flex flex-col justify-between border-slate-200/80 dark:border-white/10"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="indigo" size="sm">
                      {res.category}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {res.semester}
                    </Badge>
                  </div>

                  <button
                    onClick={() => toggleBookmark(res.id, res.title)}
                    className="p-1.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {res.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {res.rating}
                  </span>
                  <span>•</span>
                  <span>{res.fileSize}</span>
                </div>

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

