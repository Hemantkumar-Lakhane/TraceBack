import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { DEMO_USERS } from '../api/mockData';
import { supabase, isSupabaseConfigured } from '../api/supabaseClient';
import { getCampusAvatar } from '../api/chatService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('tb_user_session');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync token and user session to localStorage & Axios
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }

    if (user) {
      localStorage.setItem('tb_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('tb_user_session');
    }
    setLoading(false);
  }, [token, user]);

  // Check Supabase session if configured
  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setToken(session.access_token);
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            role: session.user.user_metadata?.role || 'STUDENT',
            studentId: session.user.user_metadata?.studentId || 'STU-' + session.user.id.slice(0, 5)
          });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setToken(session.access_token);
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            role: session.user.user_metadata?.role || 'STUDENT',
            studentId: session.user.user_metadata?.studentId || 'STU-' + session.user.id.slice(0, 5)
          });
        } else if (!localStorage.getItem('tb_is_demo_session')) {
          setToken(null);
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  /**
   * Real Authentication Login
   * Checks Supabase first if configured, otherwise connects to Spring Boot JWT /api/auth/login
   */
  const login = async (email, password) => {
    localStorage.removeItem('tb_is_demo_session');

    // 1. Supabase Real Auth (if environment keys configured)
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      if (data.session) {
        const u = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
          role: data.user.user_metadata?.role || 'STUDENT',
          studentId: data.user.user_metadata?.studentId || 'STU-001'
        };
        setToken(data.session.access_token);
        setUser(u);
        return { token: data.session.access_token, user: u };
      }
    }

    // 2. Real Spring Boot Backend MySQL Auth (/api/auth/login)
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token: jwtToken, user: userDto } = response.data;
      
      const fullUser = {
        id: userDto.id,
        name: userDto.name,
        email: email,
        role: userDto.role,
        studentId: userDto.studentId || (userDto.role === 'SECURITY' ? 'SEC-409' : userDto.role === 'ADMIN' ? 'ADM-101' : `1211010${userDto.id}`),
        department: userDto.department || (userDto.role === 'SECURITY' ? 'Campus Security' : userDto.role === 'ADMIN' ? 'Dean Office' : 'Computer Engineering'),
        phone: userDto.phone || '+91 98201 23456',
        avatar: userDto.avatar || getCampusAvatar(userDto.name, userDto.role)
      };

      setToken(jwtToken);
      setUser(fullUser);
      return { token: jwtToken, user: fullUser };
    } catch (err) {
      // If backend is running and returned 401 or other error, throw real error
      if (err.response) {
        const message = err.response.data?.message || err.response.data?.error || 'Invalid email or password';
        throw new Error(message);
      }

      // If backend is completely offline and user explicitly uses demo credentials:
      if (email.includes('admin')) {
        return handleDemoFallback('ADMIN');
      } else if (email.includes('security') || email.includes('officer')) {
        return handleDemoFallback('SECURITY');
      } else if (email.includes('alex') || email.includes('aarav') || email.includes('student')) {
        return handleDemoFallback('STUDENT');
      }

      throw new Error("Unable to connect to Authentication Server. Please ensure the backend is running on http://localhost:8080 or use demo credentials.");
    }
  };

  /**
   * Real Authentication Registration
   * Checks Supabase first if configured, otherwise connects to Spring Boot JWT /api/auth/register
   */
  const register = async (nameOrData, maybeEmail, maybePassword, extraData = {}) => {
    localStorage.removeItem('tb_is_demo_session');

    let name = nameOrData;
    let email = maybeEmail;
    let password = maybePassword;
    let extra = extraData;

    if (typeof nameOrData === 'object' && nameOrData !== null) {
      name = nameOrData.name;
      email = nameOrData.email;
      password = nameOrData.password;
      extra = nameOrData;
    }

    // 1. Supabase Real Auth (if environment keys configured)
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'STUDENT',
            studentId: extra.studentId || '12110104',
            department: extra.department || 'Computer Engineering',
            phone: extra.phone || '+91 98201 23456'
          }
        }
      });
      if (error) throw new Error(error.message);
      return { message: "User registered successfully in Supabase!" };
    }

    // 2. Real Spring Boot Backend MySQL Registration (/api/auth/register)
    try {
      await api.post('/api/auth/register', { name, email, password });
      // Automatically log in the user with the new credentials immediately!
      return await login(email, password);
    } catch (err) {
      if (err.response) {
        const msg = err.response.data?.message || (err.response.status === 409 ? 'Email already registered' : 'Registration failed');
        throw new Error(msg);
      }
      throw new Error("Unable to connect to backend server. Please check that Spring Boot is running on port 8080.");
    }
  };

  /**
   * Update current user profile fields in session & context
   */
  const updateUser = (updatedFields) => {
    setUser(prev => {
      const updated = { ...(prev || {}), ...updatedFields };
      localStorage.setItem('tb_user_session', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDemoFallback = (role) => {
    localStorage.setItem('tb_is_demo_session', 'true');
    if (role === 'ADMIN') {
      setToken('demo-jwt-admin-token');
      setUser(DEMO_USERS.admin);
      return { token: 'demo-jwt-admin-token', user: DEMO_USERS.admin };
    } else if (role === 'SECURITY') {
      setToken('demo-jwt-security-token');
      setUser(DEMO_USERS.security);
      return { token: 'demo-jwt-security-token', user: DEMO_USERS.security };
    } else if (role === 'ROHAN') {
      setToken('demo-jwt-rohan-token');
      setUser(DEMO_USERS.rohan);
      return { token: 'demo-jwt-rohan-token', user: DEMO_USERS.rohan };
    } else {
      setToken('demo-jwt-student-token');
      setUser(DEMO_USERS.student);
      return { token: 'demo-jwt-student-token', user: DEMO_USERS.student };
    }
  };

  const loginAs = async (roleOrKey) => {
    let email = 'aarav.sharma@vit.edu';
    let pw = '12110104';
    if (roleOrKey === 'ROHAN' || roleOrKey === 'rohan') {
      email = 'rohan.verma@vit.edu';
      pw = '12110208';
    } else if (roleOrKey === 'SECURITY' || roleOrKey === 'security') {
      email = 'rajesh.kumar@vit.edu';
      pw = 'SEC-409';
    } else if (roleOrKey === 'ADMIN' || roleOrKey === 'admin') {
      email = 'priya.nair@vit.edu';
      pw = 'ADM-101';
    } else if (roleOrKey === 'ANANYA' || roleOrKey === 'ananya') {
      email = 'ananya.iyer@vit.edu';
      pw = '12110305';
    }

    try {
      return await login(email, pw);
    } catch (e) {
      return handleDemoFallback(roleOrKey);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tb_user_session');
    localStorage.removeItem('tb_is_demo_session');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      updateUser,
      logout,
      loginAs,
      isAuthenticated: !!user,
      loading,
      isSupabase: isSupabaseConfigured()
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
