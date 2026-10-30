import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookmarkProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </BrowserRouter>
        </BookmarkProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

