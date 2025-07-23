"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Alert,
  Stack
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Storage,
  Person,
  DataUsage,
  Refresh,
  CheckCircle,
  Warning,
  Info,
  Delete,
  Backup
} from '@mui/icons-material';
import {
  getCurrentUserId,
  getAllUserData,
  getUserDataKeys,
  hasUserData,
  backupUserData,
  clearAllUserData,
  getDataTimestamp,
  isDataFresh
} from '../_utils/localStorageUtils';

const UserDataStatus = () => {
  const [expanded, setExpanded] = useState(false);
  const [userData, setUserData] = useState({});
  const [userKeys, setUserKeys] = useState([]);
  const [userId, setUserId] = useState('');
  const [hasData, setHasData] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refreshData = () => {
    try {
      const currentUserId = getCurrentUserId();
      const allData = getAllUserData();
      const keys = getUserDataKeys();
      const dataExists = hasUserData();

      setUserId(currentUserId);
      setUserData(allData);
      setUserKeys(keys);
      setHasData(dataExists);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing user data status:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleBackup = () => {
    try {
      const backup = backupUserData();
      refreshData();
    } catch (error) {
      console.error('Error backing up user data:', error);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all user data? This action cannot be undone.')) {
      try {
        clearAllUserData();
        refreshData();
      } catch (error) {
        console.error('Error clearing user data:', error);
      }
    }
  };

  const getDataSize = (data) => {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return 0;
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDataStatus = (key) => {
    const timestamp = getDataTimestamp(key);
    if (!timestamp) return { status: 'new', icon: <Info color="info" />, text: 'New data' };
    
    const isFresh = isDataFresh(key, 24 * 60 * 60 * 1000); // 24 hours
    if (isFresh) {
      return { status: 'fresh', icon: <CheckCircle color="success" />, text: 'Recently updated' };
    } else {
      return { status: 'stale', icon: <Warning color="warning" />, text: 'Needs refresh' };
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, maxWidth: 400 }}>
      <Paper 
        elevation={8} 
        sx={{ 
          p: 2, 
          borderRadius: 3,
          background: theme => theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #0f121a 0%, #1c1e2e 100%)'
            : 'background.paper',
          border: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Storage color="primary" />
            <Typography variant="subtitle2" sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
              Data Status
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" onClick={refreshData} sx={{ color: 'text.secondary' }}>
              <Refresh fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{ color: 'text.secondary' }}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip 
            label={hasData ? 'Data Found' : 'No Data'} 
            size="small" 
            color={hasData ? 'success' : 'default'}
            icon={hasData ? <CheckCircle /> : <Info />}
            sx={{ fontFamily: 'var(--font-lexend)' }}
          />
          <Chip 
            label={`${userKeys.length} items`} 
            size="small" 
            variant="outlined"
            sx={{ fontFamily: 'var(--font-lexend)' }}
          />
        </Stack>

       

        <Collapse in={expanded}>
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)' }}>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </Typography>
          </Box>

          {userKeys.length > 0 ? (
            <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
              {userKeys.map((key) => {
                const data = userData[key];
                const dataStatus = getDataStatus(key);
                const size = getDataSize(data);
                
                return (
                  <ListItem key={key} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {dataStatus.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" sx={{ fontFamily: 'var(--font-lexend)', fontWeight: 500 }}>
                          {key}
                        </Typography>
                      }
                      secondary={
                        <span>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)' }}>
                            {dataStatus.text} • {formatBytes(size)}
                          </Typography>
                          {Array.isArray(data) && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)', display: 'block' }}>
                              {data.length} items
                            </Typography>
                          )}
                        </span>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Alert severity="info" sx={{ mb: 1, fontFamily: 'var(--font-lexend)' }}>
              No persistent data found. Data will be created when you use the app.
            </Alert>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Backup />}
              onClick={handleBackup}
              sx={{ fontFamily: 'var(--font-lexend)' }}
            >
              Backup
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleClearAll}
              sx={{ fontFamily: 'var(--font-lexend)' }}
            >
              Clear All
            </Button>
          </Stack>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default UserDataStatus; 