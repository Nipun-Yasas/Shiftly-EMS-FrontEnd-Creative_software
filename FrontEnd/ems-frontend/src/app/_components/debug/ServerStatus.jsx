'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '../../_utils/axiosInstance';

const ServerStatus = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Checking server connection...');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkServerStatus = async () => {
      try {
        // Try to make a simple request to check if server is running
        await axiosInstance.get('/actuator/health');
        setStatus('online');
        setMessage('✅ Backend server is running');
      } catch (error) {
        if (error.isNetworkError || error.message === 'Network Error' || !error.response) {
          setStatus('offline');
          setMessage('❌ Backend server is not running. Please start the server at http://localhost:8080');
        } else {
          setStatus('error');
          setMessage(`⚠️ Server responded with error: ${error.response?.status || 'Unknown error'}`);
        }
      }
    };

    checkServerStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Don't render on server-side
  if (!mounted) return null;

  const getStatusColor = () => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'offline': return '#F44336';
      case 'error': return '#FF9800';
      default: return '#2196F3';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#fff',
      padding: '8px 12px',
      borderRadius: '4px',
      border: `2px solid ${getStatusColor()}`,
      fontSize: '12px',
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {message}
    </div>
  );
};

export default ServerStatus;
