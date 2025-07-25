"use client";

import { useState, useContext } from "react";
import { Box, Button, Typography, Alert, Paper } from "@mui/material";
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { UserContext } from "../../../context/UserContext";

export default function TimesheetDebug() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  const testConnection = async () => {
    setLoading(true);
    setResult("");
    
    try {
      // Test basic connectivity
      console.log("Testing backend connectivity...");
      console.log("User context:", user);
      console.log("Token:", localStorage.getItem('token'));
      
      // Test timesheet creation
      const testData = {
        userId: user?.id || 1,
        date: "2025-01-25",
        mode: "Online",
        activity: "Test activity for debugging",
        hours: 8.0
      };
      
      console.log("Sending test timesheet data:", testData);
      console.log("API endpoint:", API_PATHS.TIMESHEETS.ADD);
      
      const response = await axiosInstance.post(API_PATHS.TIMESHEETS.ADD, testData);
      
      setResult(`✅ Success! Response: ${JSON.stringify(response.data, null, 2)}`);
      console.log("Success response:", response.data);
      
    } catch (error) {
      console.error("Test failed:", error);
      
      let errorDetails = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      };
      
      setResult(`❌ Error: ${JSON.stringify(errorDetails, null, 2)}`);
    }
    
    setLoading(false);
  };

  const testGetTimesheets = async () => {
    setLoading(true);
    setResult("");
    
    try {
      console.log("Testing get user timesheets...");
      console.log("User ID:", user?.id);
      
      if (!user?.id) {
        setResult("❌ No user ID available");
        return;
      }
      
      const response = await axiosInstance.get(API_PATHS.TIMESHEETS.BY_USER(user.id));
      setResult(`✅ Get timesheets success! Response: ${JSON.stringify(response.data, null, 2)}`);
      
    } catch (error) {
      console.error("Get timesheets test failed:", error);
      
      let errorDetails = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      };
      
      setResult(`❌ Get timesheets error: ${JSON.stringify(errorDetails, null, 2)}`);
    }
    
    setLoading(false);
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Timesheet API Debug Panel
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          Current User: {user?.username || "Not logged in"}
        </Typography>
        <Typography variant="body2">
          User ID: {user?.id || "N/A"}
        </Typography>
        <Typography variant="body2">
          Has Token: {localStorage.getItem('token') ? "Yes" : "No"}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={testConnection}
          disabled={loading}
        >
          Test Create Timesheet
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={testGetTimesheets}
          disabled={loading}
        >
          Test Get Timesheets
        </Button>
      </Box>
      
      {loading && <Typography>Testing...</Typography>}
      
      {result && (
        <Alert 
          severity={result.startsWith('✅') ? 'success' : 'error'}
          sx={{ mt: 2 }}
        >
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {result}
          </pre>
        </Alert>
      )}
    </Paper>
  );
}
