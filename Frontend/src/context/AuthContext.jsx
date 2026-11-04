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

  const login = async (email, password, role = 'student') => {
    // Simulated JWT Auth login
    await new Promise((res) => setTimeout(res, 500));
    const matchedUser = DEMO_USERS[role] || {
      ...DEMO_USERS.student,
      email,
      name: email.split('@')[0],
      role: role === 'admin' ? 'admin' : 'student',
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
