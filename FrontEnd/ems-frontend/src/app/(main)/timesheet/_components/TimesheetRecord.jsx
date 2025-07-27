"use client";

import { useState, useEffect, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { styled } from '@mui/material/styles';
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { UserContext } from "../../../context/UserContext";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';

import TimesheetForm from "./TimesheetForm"; 


export default function TimesheetRecord() {
  const [loading, setLoading] = useState(false);
  const [timesheetRecords, setTimesheetRecords] = useState([]);
  const { user } = useContext(UserContext);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [timesheetToDelete, setTimesheetToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [timesheetToEdit, setTimesheetToEdit] = useState(null);

  // Fetch timesheet records from the backend
  useEffect(() => {
    const fetchTimesheetRecords = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_PATHS.TIMESHEETS.BY_USER(user.id));
        // Map backend fields to frontend columns
        const data = response.data.map(record => ({
          id: record.id,
          date: record.date,
          workMode: record.mode,
          activity: record.activity,
          hours: record.hours,
          status: record.status
        }));
        setTimesheetRecords(data);
      } catch (error) {
        console.error("Error fetching timesheet records:", error);
      }
      setLoading(false);
    };
    fetchTimesheetRecords();
  }, [user]);

  const handleDelete = async () => {
    if (!timesheetToDelete) return;
    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.TIMESHEETS.DELETE(timesheetToDelete.id));
      setTimesheetRecords(prev => prev.filter(r => r.id !== timesheetToDelete.id));
      console.log("Timesheet deleted successfully");
    } catch (error) {
      console.error("Error deleting timesheet:", error);
      // You might want to show an error message to the user here
    }
    setLoading(false);
    setDeleteConfirmOpen(false);
    setTimesheetToDelete(null);
  };

  const handleEdit = (row) => {
    setTimesheetToEdit(row);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = (data, mode) => {
    console.log('Timesheet updated successfully:', data);
    // Update the local state with the edited data
    setTimesheetRecords((prev) => prev.map((r) => 
      r.id === timesheetToEdit.id ? {
        ...r,
        date: data.date,
        workMode: data.mode,
        activity: data.activity,
        hours: data.hours
      } : r
    ));
    setEditDialogOpen(false);
    setTimesheetToEdit(null);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setTimesheetToEdit(null);
  };

  // Styled status chip for Timesheet Status (same as claim history)
  const StyledChip = styled(Chip)(({ theme }) => ({
    justifyContent: 'left',
    '& .icon': {
      color: 'inherit',
    },
    '&.Pending': {
      color: '#ffffff',
      backgroundColor: '#ed6c02',
      border: '1px solid #ed6c02',
    },
    '&.Approved': {
      color: '#ffffff',
      backgroundColor: '#2e7d32',
    },
    '&.Rejected': {
      color: '#ffffff',
      backgroundColor: '#d32f2f',
      border: '1px solid #d32f2f',
    },
  }));

  // Function to determine status color and styling
  const renderStatus = (params) => {
    let status = params.value;
    if (!status) return null;
    // Capitalize first letter, lowercase the rest
    status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    let icon = null;
    if (status === 'Rejected') {
      icon = <CloseIcon className="icon" />;
    } else if (status === 'Pending') {
      icon = <AutorenewIcon className="icon" />;
    } else if (status === 'Approved') {
      icon = <DoneIcon className="icon" />;
    }
    let label = status;
    return (
      <StyledChip
        className={status}
        icon={icon}
        size="small"
        label={label}
      />
    );
  };

  // Custom renderer for activity column with text truncation
  const renderActivity = (params) => {
    return (
      <Box sx={{ 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        fontSize: '0.875rem'
      }}>
        {params.value}
      </Box>
    );
  };

  // Custom renderer for hours column
  const renderHours = (params) => {
    const hours = parseFloat(params.value);
    const isOvertime = hours > 8;
    
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        mt:2,
        fontWeight: isOvertime ? 'bold' : 'normal'
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: isOvertime ? 'warning.main' : 'inherit',
            fontWeight: 'bold'
          }}
        >
          {params.value}
        </Typography>
        {isOvertime && (
          <Chip
            label="OT"
            color="warning"
            size="small"
            sx={{ 
              fontSize: '0.625rem',
              height: 16,
              minWidth: 20
            }}
          />
        )}
      </Box>
    );
  };

  const columns = [
    { 
      field: "date", 
      headerName: "Date", 
      width: 150,
    },
    { 
      field: "workMode", 
      headerName: "Work Mode", 
      width: 120,
      renderCell: (params) => {
        const mode = params.value;
        let color = '';
        if (mode === 'Online') {
          color = '#1976d2'; // blue
        } else if (mode === 'On-site') {
          color = '#388e3c'; // green
        } else if (mode === 'Hybrid') {
          color = '#ed6c02'; // orange
        } else {
          color = '#757575'; // gray
        }
        return (
          <Chip
            label={mode}
            size="small"
            sx={{
              color: '#fff',
              backgroundColor: color,
              fontWeight: 600,
              borderRadius: 2,
              fontSize: '0.75rem',
            }}
          />
        );
      }
    },
    { 
      field: "activity", 
      headerName: "Activity", 
      width: 400,
      renderCell: renderActivity
    },
    { 
      field: "hours", 
      headerName: "Hours", 
      width: 150,
      renderCell: renderHours
    },
    { 
      field: "status", 
      headerName: "Status", 
      width: 150,
      renderCell: renderStatus
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClassName: "last-column",
      width: 100,
      renderCell: (params) => (
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
              onClick={() => {
                setTimesheetToDelete(params.row);
                setDeleteConfirmOpen(true);
              }}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    
      <Box sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            py: 4 
          }}>
            <Typography variant="body2" color="text.secondary">
              Loading records...
            </Typography>
          </Box>
        ) : timesheetRecords.length > 0 ? (
          <DataGrid
            rows={timesheetRecords}
            columns={columns}
            height="auto"
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            py: 4 
          }}>
            <Typography variant="body2" color="text.secondary">
              No timesheet records found.
            </Typography>
          </Box>
        )}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Delete Timesheet Entry</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this timesheet entry?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color="text.primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="contained" color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          fullWidth
         
        >
          <DialogTitle sx={{ 
            m: 0, 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Typography variant="h6" component="div">
              Edit Timesheet Entry
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setEditDialogOpen(false)}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {timesheetToEdit && (
              <TimesheetForm
                mode="edit"
                initialData={{
                  id: timesheetToEdit.id,
                  date: timesheetToEdit.date,
                  workMode: timesheetToEdit.workMode,
                  activity: timesheetToEdit.activity,
                  hours: timesheetToEdit.hours,
                  status: timesheetToEdit.status
                }}
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
                showTitle={false} 
                showSummary={true}
                showActions={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </Box>
  );
} 