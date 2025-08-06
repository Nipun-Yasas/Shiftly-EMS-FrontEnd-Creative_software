"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import dayjs from "dayjs";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";
import {
  getStatusIcon,
  getStatusColor,
} from "../../admin-portal/_helpers/colorhelper";
import { notifyEventChange, listenForEventChanges, EVENT_EVENTS } from "../../../_utils/eventUtils";
import DeleteDialog from "../../_components/DeleteDialog";
import EditDialog from "../_components/EditDialog";
import { UserContext } from "../../../context/UserContext";
import CustomDataGrid from "../../_components/CustomDataGrid";

export default function EventHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { user } = useContext(UserContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchEvents = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available, skipping fetch');
      return;
    }
    setLoading(true);
    try {
      console.log('Fetching events for user ID:', user.id);
      let response;
      
      try {
        // Try the user-specific endpoint first (similar to claims)
        response = await axiosInstance.get(API_PATHS.EVENTS.GET_MY_EVENTS(user.id));
      } catch (error) {
        console.log('User-specific endpoint failed, trying fallback...');
        // Fallback to the original endpoint if user-specific doesn't exist
        response = await axiosInstance.get("/api/v1/shiftly/ems/events/my");
      }

      console.log('Events API Response:', response.data);

      if (!response.data || response.data.length === 0) {
        console.log('No events found');
        setData([]);
        return;
      }
      
      // Map backend fields correctly and ensure each row has an id for DataGrid
      const eventsWithIds = response.data.map((event, index) => ({
        ...event,
        id: event.id || index + 1,
        title: event.title || '',
        eventType: event.eventType || '',
        enableDate: event.enableDate || '',
        expireDate: event.expireDate || '',
        status: event.status || 'Pending',
        imageUrl: event.imageUrl || '',
      }));
      
      console.log('Processed events data:', eventsWithIds);
      setData(eventsWithIds);
    } catch (error) {
      console.error('Error fetching events:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      showSnackbar(
        error.response?.data?.message || "Failed to fetch data",
        "error"
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchEvents();
  }, [user, fetchEvents]);

  // Add router change listener to refresh when navigating to this page
  useEffect(() => {
    const handleRouteChange = () => {
      if (user?.id) {
        console.log('Route changed to event history, refreshing data...');
        fetchEvents();
      }
    };

    // Refresh when component mounts or user navigates to this page
    handleRouteChange();
  }, [user?.id, fetchEvents]);

  // Listen for URL parameter changes (e.g., when redirected from submit page)
  useEffect(() => {
    const refresh = searchParams.get('refresh');
    if (refresh === 'true' && user?.id) {
      console.log('Refresh parameter detected, fetching events...');
      fetchEvents();
      // Clean up the URL parameter
      router.replace('/events/history', { scroll: false });
    }
  }, [searchParams, user?.id, fetchEvents, router]);

  // Add visibility change listener to refresh data when user comes back to this page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        fetchEvents();
      }
    };

    const handleFocus = () => {
      if (user?.id) {
        fetchEvents();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchEvents, user?.id]);

  // Add periodic refresh every 30 seconds when the page is visible
  useEffect(() => {
    let intervalId;
    
    if (user?.id && !document.hidden) {
      intervalId = setInterval(() => {
        fetchEvents();
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchEvents, user?.id]);

  // Listen for storage events to refresh when events are submitted in other tabs
  useEffect(() => {
    const cleanup = listenForEventChanges((event) => {
      if (user?.id && [EVENT_EVENTS.EVENT_SUBMITTED, EVENT_EVENTS.EVENT_UPDATED, EVENT_EVENTS.EVENT_DELETED].includes(event.type)) {
        console.log('Event change detected:', event.type);
        fetchEvents();
      }
    });

    return cleanup;
  }, [fetchEvents, user?.id]);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const handleUpdateRecord = async (id, data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(API_PATHS.EVENTS.UPDATE(id), data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Notify other tabs about the update
      notifyEventChange(EVENT_EVENTS.EVENT_UPDATED, { id, ...response.data });
      
      await fetchEvents();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to update record",
        "error"
      );
      throw error; // Re-throw to let EditDialog handle the error
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedRecord) return;

    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.EVENTS.DELETE(selectedRecord.id));
      
      // Notify other tabs about the deletion
      notifyEventChange(EVENT_EVENTS.EVENT_DELETED, { id: selectedRecord.id });
      
      await fetchEvents();
      showSnackbar("Event deleted successfully.", "success");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to delete event",
        "error"
      );
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    }
  };

  const columns = [
    {
      field: "title",
      headerName: "Event Title",
      width: 200,
    },
    {
      field: "eventType",
      headerName: "Event Type",
      width: 150,
    },
    {
      field: "enableDate",
      headerName: "Start Date",
      width: 150,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "expireDate",
      headerName: "End Date",
      width: 150,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
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
      field: "imageUrl",
      headerName: "Event File",
      width: 150,
      renderCell: (params) => {
        const imageUrl = params.value;
        if (!imageUrl) return "No file";
        const fullUrl = "http://localhost:8080" + imageUrl;
        return (
          <Button
            component="a"
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            variant="outlined"
            size="small"
            sx={{
              fontSize: "0.75rem",
              minWidth: "auto",
              px: 1,
              py: 0.5,
            }}
            startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
          >
            Download
          </Button>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      width: 120,
      headerClassName: "last-column",
      renderCell: (params) => {
        const isPending = params.row.status?.toLowerCase() === 'pending';
        
        if (!isPending) {
          // Show no actions for approved or rejected events
          return (
            <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: "100%", justifyContent: "center" }}>
              <span style={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>
                No actions
              </span>
            </Box>
          );
        }

        return (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              mt: 1,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => handleEdit(params.row)}
                sx={{ color: "primary.main" }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => handleDelete(params.row)}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ width: "100%", p: 5 }}>
        {/* Event Statistics */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#e3f2fd',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1976d2' }}>
                {data.length}
              </span>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Total Events</div>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#fff3e0',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f57c00' }}>
                {data.filter(event => event.status?.toLowerCase() === 'pending').length}
              </span>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Pending</div>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#dcedc8',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#388e3c' }}>
                {data.filter(event => event.status?.toLowerCase() === 'approved').length}
              </span>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Approved</div>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#ffcdd2',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#d32f2f' }}>
                {data.filter(event => event.status?.toLowerCase() === 'rejected').length}
              </span>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Rejected</div>
            </Box>
          </Box>

          {/* Refresh Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="textSecondary">
              Auto-refresh: 30s
            </Typography>
            <Tooltip title="Refresh Event History">
              <IconButton 
                onClick={fetchEvents} 
                disabled={loading}
                sx={{ color: 'primary.main' }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CustomDataGrid rows={data} columns={columns} />
        )}
      </Box>

      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        record={selectedRecord}
        onUpdate={handleUpdateRecord}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        loading={loading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
