'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../_utils/axiosInstance';
import { API_PATHS } from '../_utils/apiPaths';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_CURRENT_USER);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const signIn = async (username, password) => {
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { username, password });
      setUser(response.data);
    } catch (error) {
      throw new Error(error.message || 'Invalid username or password');
    }
  };

  const signOut = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
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