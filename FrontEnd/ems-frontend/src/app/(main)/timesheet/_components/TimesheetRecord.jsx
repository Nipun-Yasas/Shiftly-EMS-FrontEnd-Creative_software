"use client";

import { useState, useEffect, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
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
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import dayjs from "dayjs";


export default function TimesheetRecord() {
  const [loading, setLoading] = useState(false);
  const [timesheetRecords, setTimesheetRecords] = useState([]);
  const { user } = useContext(UserContext);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [timesheetToDelete, setTimesheetToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [timesheetToEdit, setTimesheetToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ date: '', workMode: '', activity: '', hours: '' });

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
      await axiosInstance.delete(`/api/v1/shiftly/ems/timesheets/delete/${timesheetToDelete.id}`);
      setTimesheetRecords(prev => prev.filter(r => r.id !== timesheetToDelete.id));
    } catch (error) {
      console.error("Error deleting timesheet:", error);
    }
    setLoading(false);
    setDeleteConfirmOpen(false);
    setTimesheetToDelete(null);
  };

  const handleEdit = (row) => {
    setTimesheetToEdit(row);
    setEditForm({
      date: row.date,
      workMode: row.workMode,
      activity: row.activity,
      hours: row.hours
    });
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    if (!timesheetToEdit) return;
    setLoading(true);
    try {
      const dto = {
        id: timesheetToEdit.id,
        date: editForm.date,
        mode: editForm.workMode,
        activity: editForm.activity,
        hours: parseFloat(editForm.hours),
        status: timesheetToEdit.status
      };
      await axiosInstance.put(`/api/v1/shiftly/ems/timesheets/update/${timesheetToEdit.id}`, dto);
      setTimesheetRecords((prev) => prev.map((r) => r.id === timesheetToEdit.id ? {
        ...r,
        date: editForm.date,
        workMode: editForm.workMode,
        activity: editForm.activity,
        hours: editForm.hours
      } : r));
      setEditDialogOpen(false);
      setTimesheetToEdit(null);
    } catch (error) {
      console.error("Error updating timesheet:", error);
    }
    setLoading(false);
  };

  // Function to determine status color and styling
  const getStatusChip = (status) => {
    const statusConfig = {
      "Approved": { color: "success", label: "Approved" },
      "Pending": { color: "warning", label: "Pending" },
      "Rejected": { color: "error", label: "Rejected" }
    };

    const config = statusConfig[status] || { color: "default", label: status };

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{
          borderRadius: 2,
          fontWeight: 'bold',
          fontSize: '0.75rem'
        }}
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
      width: 120,
      headerAlign: 'center',
      align: 'center'
    },
    { 
      field: "workMode", 
      headerName: "Work Mode", 
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 2,
            fontSize: '0.75rem'
          }}
        />
      )
    },
    { 
      field: "activity", 
      headerName: "Activity", 
      width: 300,
      headerAlign: 'left',
      align: 'left',
      renderCell: renderActivity
    },
    { 
      field: "hours", 
      headerName: "Hours", 
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: renderHours
    },
    { 
      field: "status", 
      headerName: "Status", 
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => getStatusChip(params.value)
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClassName: "last-column",
      width: 120,
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
    <Paper elevation={1} sx={{ mb: 3 }}>
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
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 50, 100]}
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
            <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
        >
          <DialogTitle>Edit Timesheet Entry</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Date"
                type="date"
                value={editForm.date}
                onChange={(e) => handleEditFormChange('date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Work Mode</InputLabel>
                <Select
                  value={editForm.workMode}
                  label="Work Mode"
                  onChange={(e) => handleEditFormChange('workMode', e.target.value)}
                >
                  <MenuItem value="">Select mode</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="On-site">On-site</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Activity"
                value={editForm.activity}
                onChange={(e) => handleEditFormChange('activity', e.target.value)}
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                label="Hours"
                type="number"
                value={editForm.hours}
                onChange={(e) => handleEditFormChange('hours', e.target.value)}
                fullWidth
                inputProps={{ min: 0, max: 15, step: 0.25 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditSave} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Paper>
  );
} 