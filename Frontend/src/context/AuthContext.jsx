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
  faculty: {
    id: 'usr_fac_102',
    name: 'Dr. Evelyn Reed',
    email: 'e.reed@campus.edu',
    role: 'faculty',
    department: 'Computer Science & AI Lab',
    designation: 'Associate Professor & AI Research Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    coursesTaught: ['Advanced Algorithms', 'Neural Networks', 'Distributed Systems'],
  },
  admin: {
    id: 'usr_adm_999',
    name: 'Marcus Brody',
    email: 'm.brody@campus.admin',
    role: 'admin',
    department: 'Campus IT & Academic Operations',
    designation: 'Senior System Administrator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    accessLevel: 'SuperAdmin',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusai_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS.student;
      }
    }
    return DEMO_USERS.student; // Default active demo user
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!user);

  useEffect(() => {
    if (user) {
      localStorage.setItem('campusai_user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('campusai_user');
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = async (email, password, role = 'student') => {
    // Simulated JWT Auth login
    await new Promise((res) => setTimeout(res, 500));
    const matchedUser = DEMO_USERS[role] || {
      ...DEMO_USERS.student,
      email,
      name: email.split('@')[0],
      role,
    };
    setUser(matchedUser);
    return matchedUser;
  };

  const register = async (userData) => {
    await new Promise((res) => setTimeout(res, 600));
    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'student',
      department: userData.department || 'Computer Science & Engineering',
      semester: userData.semester || '1st Semester',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
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
        login,
        register,
        logout,
        switchRole,
        isStudent: user?.role === 'student',
        isFaculty: user?.role === 'faculty',
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

