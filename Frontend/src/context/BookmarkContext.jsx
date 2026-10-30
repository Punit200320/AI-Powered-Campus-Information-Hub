import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('campusai_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['res_01', 'res_03', 'res_05'];
      }
    }
    return ['res_01', 'res_03', 'res_05']; // Default bookmarked resource IDs
  });

  useEffect(() => {
    localStorage.setItem('campusai_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (resourceId, resourceTitle) => {
    setBookmarks((prev) => {
      const exists = prev.includes(resourceId);
      if (exists) {
        toast.success(`Removed "${resourceTitle || 'Resource'}" from saved items`, {
          icon: '🔖',
          style: {
            borderRadius: '10px',
            background: '#1e293b',
            color: '#fff',
          },
        });
        return prev.filter((id) => id !== resourceId);
      } else {
        toast.success(`Saved "${resourceTitle || 'Resource'}" to your collection!`, {
          icon: '✨',
          style: {
            borderRadius: '10px',
            background: '#1e293b',
            color: '#fff',
          },
        });
        return [...prev, resourceId];
      }
    });
  };

  const isBookmarked = (resourceId) => bookmarks.includes(resourceId);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        toggleBookmark,
        isBookmarked,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};

