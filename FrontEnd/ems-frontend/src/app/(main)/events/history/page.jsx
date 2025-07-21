"use client";

import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";
import { getStatusIcon, getStatusColor } from "../../admin-portal/_helpers/colorhelper";
import dayjs from "dayjs";

const columns = [
  { 
    field: "id", 
    headerName: "Event ID", 
    width: 100 
  },
  { 
    field: "title", 
    headerName: "Event Title", 
    width: 200 
  },
  { 
    field: "eventType", 
    headerName: "Event Type", 
    width: 150 
  },
  { 
    field: "enableDate", 
    headerName: "Start Date", 
    width: 150,
    renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY")
  },
  { 
    field: "expireDate", 
    headerName: "End Date", 
    width: 150,
    renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY")
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => (
      <Chip
        icon={getStatusIcon(params.value.toLowerCase())}
        label={params.value}
        color={getStatusColor(params.value.toLowerCase())}
        size="small"
      />
    ),
  },
  { 
    field: "fileName", 
    headerName: "Attached File", 
    width: 150,
    renderCell: (params) => params.value || "No file"
  },
];

export default function EventHistory() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchUserEvents = async () => {
    setLoading(true);
    try {
      // This should come from user context/auth
      const employeeId = 1; // Placeholder
      
      console.log("Fetching user events for employee:", employeeId);
      
      const response = await axiosInstance.get(API_PATHS.EVENTS.GET_MY_EVENTS(employeeId));
      console.log("Backend response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        console.warn("Invalid response format or no data");
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching user events:", error);
      console.error("Error details:", error.response?.data);
      
      let errorMessage = "Failed to fetch your events";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = "No events found for your account.";
      }
      
      showSnackbar(errorMessage, "error");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEvents();
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ width: "100%", p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          My Event Submissions
        </Typography>
        
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={events}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            sx={{ height: 500 }}
          />
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
