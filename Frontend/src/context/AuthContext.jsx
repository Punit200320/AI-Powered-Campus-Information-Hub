import apiClient from '../services/api';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_USERS = {
  student: {
    id: 'usr_std_001',
    name: 'Alex Vance',
    email: 'alex.vance@campus.edu',
    role: 'student',
    studentId: '2026-CS-882',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    gpa: '3.88',
    credits: 114,
  },
  admin: {
    id: 'usr_adm_001',
    name: 'Punit Chandel',
    email: 'admin@campus.edu',
    role: 'admin',
    department: 'Campus IT & Academic Operations',
    designation: 'Chief Administrator & Campus Controller',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    accessLevel: 'SuperAdmin',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusai_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'faculty') {
          return DEMO_USERS.student;
        }
        return parsed;
      } catch (e) {
        return DEMO_USERS.student;
      }
    }
    return DEMO_USERS.student; // Default active demo user
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!user);
  const [token, setToken] = useState(() => localStorage.getItem('campusai_token'));

  useEffect(() => {
    if (user) {
      localStorage.setItem('campusai_user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('campusai_user');
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = async (email, password, role) => {
    const cleanEmail = (email || '').trim();
    const isAdminCandidate = role === 'admin' || cleanEmail.toLowerCase().includes('admin');
    const computedRole = isAdminCandidate ? 'admin' : 'student';

    try {
      const res = await apiClient.post('/auth/login', { email: cleanEmail, password });
      if (res.data && res.data.user) {
        const u = {
          ...res.data.user,
          name: res.data.user.name || cleanEmail.split('@')[0],
          email: res.data.user.email || cleanEmail,
          role: res.data.user.role || computedRole,
        };
        if (res.data.token) {
          localStorage.setItem('campusai_token', res.data.token);
          setToken(res.data.token);
        }
        setUser(u);
        return u;
      }
    } catch (err) {
      console.warn('Backend login fallback:', err.message);
    }

    // Dynamic session fallback
    let matchedUser;
    const lowerEmail = cleanEmail.toLowerCase();
    if (lowerEmail === 'admin@campus.edu') {
      matchedUser = DEMO_USERS.admin;
    } else if (lowerEmail === 'alex.vance@campus.edu') {
      matchedUser = DEMO_USERS.student;
    } else {
      matchedUser = {
        id: `usr_${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: computedRole,
        department: isAdminCandidate ? 'Campus IT & Academic Operations' : 'Computer Science & Engineering',
        semester: isAdminCandidate ? 'Staff' : '6th Semester',
        studentId: isAdminCandidate ? 'FAC-2026-001' : '2026-CS-991',
        avatar: isAdminCandidate
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      };
    }
    setUser(matchedUser);
    return matchedUser;
  };

  const register = async (userData) => {
    await new Promise((res) => setTimeout(res, 600));
    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role === 'admin' ? 'admin' : 'student',
      department: userData.department || 'Computer Science & Engineering',
      semester: userData.semester || '1st Semester',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campusai_token');
  };

  const ssoLogin = (ssoUser, jwt) => {
    if (jwt) {
      setToken(jwt);
      localStorage.setItem('campusai_token', jwt);
    }
    if (ssoUser && ssoUser.role === 'faculty') {
      ssoUser.role = 'student';
    }
    setUser(ssoUser);
  };

  const switchRole = (newRole) => {
    if (DEMO_USERS[newRole]) {
      setUser(DEMO_USERS[newRole]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        token,
        login,
        register,
        logout,
        switchRole,
        ssoLogin,
        isStudent: user?.role === 'student',
        isFaculty: false,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
