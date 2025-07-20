'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../_utils/axiosInstance';
import { BASE_URL, API_PATHS } from '../_utils/apiPaths';
import axios from 'axios';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_CURRENT_USER);
      setUser(response.data);
    } catch (error) {
      console.log('No authenticated user found');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username, password) => {
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        username,
        password,
      });
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Login failed');
    }
  };

  const signOut = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails on server, clear user locally
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading, checkCurrentUser }}>
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