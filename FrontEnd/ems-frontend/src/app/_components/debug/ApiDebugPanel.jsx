'use client';

import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  TextField
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import axiosInstance from '../../_utils/axiosInstance';
import { API_PATHS } from '../../_utils/apiPaths';

export default function ApiDebugPanel() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (name, url, method = 'GET', payload = null) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      let response;
      if (method === 'GET') {
        response = await axiosInstance.get(url);
      } else if (method === 'POST') {
        response = await axiosInstance.post(url, payload);
      } else if (method === 'PUT') {
        response = await axiosInstance.put(url, payload);
      }
      
      setResults(prev => ({
        ...prev,
        [name]: {
          success: true,
          status: response.status,
          data: response.data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          status: error.response?.status || 'Network Error',
          error: error.response?.data || error.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const endpoints = [
    { name: 'Current User', url: '/api/auth/currentuser' },
    { name: 'My Leaves', url: API_PATHS.LEAVES.GET_MY_LEAVES },
    { name: 'All Leaves (Admin)', url: API_PATHS.LEAVES.GET_ALL_LEAVES_ADMIN },
    { name: 'All Leaves (Fallback)', url: API_PATHS.LEAVES.GET_MY_LEAVES },
  ];

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, mb: 2 }}>
      <Typography variant="h6" gutterBottom color="warning.main">
        🔧 API Debug Panel (Development Mode)
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {endpoints.map((endpoint) => (
          <Button
            key={endpoint.name}
            variant="outlined"
            size="small"
            onClick={() => testEndpoint(endpoint.name, endpoint.url)}
            disabled={loading[endpoint.name]}
          >
            {loading[endpoint.name] ? 'Testing...' : `Test ${endpoint.name}`}
          </Button>
        ))}
      </Box>

      {Object.entries(results).map(([name, result]) => (
        <Accordion key={name} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                {name}
              </Typography>
              <Alert 
                severity={result.success ? 'success' : 'error'} 
                sx={{ py: 0, px: 1 }}
              >
                {result.status} - {result.timestamp}
              </Alert>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              multiline
              fullWidth
              value={JSON.stringify(result.success ? result.data : result.error, null, 2)}
              variant="outlined"
              size="small"
              InputProps={{
                readOnly: true,
                sx: { fontFamily: 'monospace', fontSize: '0.8rem' }
              }}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
