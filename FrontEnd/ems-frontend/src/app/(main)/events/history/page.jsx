"use client";

import { useState, useEffect, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";
import { getStatusIcon, getStatusColor } from "../../admin-portal/_helpers/colorhelper";
import dayjs from "dayjs";
import EditDialog from './EditDialog';
import DeleteDialog from './DeleteDialog';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserContext } from '../../../context/UserContext';

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useContext(UserContext);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchUserEvents = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EVENTS.GET_ALL_EVENTS);
      if (response.data && Array.isArray(response.data)) {
        // Filter events by current user id
        const filtered = response.data.filter(event => event.userId === user.id || event.employeeId === user.id);
        const mapped = filtered.map(event => ({
          id: event.id,
          title: event.title,
          eventType: event.eventType,
          enableDate: event.enableDate,
          expireDate: event.expireDate,
          status: event.status,
          fileName: event.imageUrl ? (
            <a href={`http://localhost:8080${event.imageUrl}`} target="_blank" rel="noopener noreferrer">Download</a>
          ) : 'No file',
          raw: event,
        }));
        setEvents(mapped);
      } else {
        setEvents([]);
      }
    } catch (error) {
      let errorMessage = "Failed to fetch events";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showSnackbar(errorMessage, "error");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleEdit = (event) => {
    setSelectedEvent(event.raw);
    setEditDialogOpen(true);
  };

  const handleDelete = (event) => {
    setSelectedEvent(event.raw);
    setDeleteDialogOpen(true);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents((prev) => prev.map(row => row.id === updatedEvent.id ? { ...row, ...updatedEvent, raw: updatedEvent } : row));
    showSnackbar('Event updated successfully!', 'success');
  };

  const handleDeleteEvent = (deletedEvent) => {
    setEvents((prev) => prev.filter(row => row.id !== deletedEvent.id));
    showSnackbar('Event deleted successfully!', 'success');
  };

  const columns = [
    { 
      field: "title", 
      headerNme: "Event Title", 
      width: 160 
    },
    { 
      field: "eventType", 
      headerName: "Event Type", 
      width: 160 
    },
    { 
      field: "enableDate", 
      headerName: "Start Date", 
      width: 170,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY")
    },
    { 
      field: "expireDate", 
      headerName: "End Date", 
      width: 170,
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
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      width: 120,
      headerClassName: "last-column",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: "100%", justifyContent: "center" }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)} sx={{ color: "primary.main" }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDelete(params.row)} sx={{ color: "error.main" }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
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
            
          />
        )}
      </Box>

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
      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        event={selectedEvent}
        onUpdate={handleUpdateEvent}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        event={selectedEvent}
        onDelete={handleDeleteEvent}
      />
    </Paper>
  );
}
