"use client";

import { useState, useEffect, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditReferDialog from "../_components/EditReferDialog";
import CircularProgress from "@mui/material/CircularProgress";
import axiosInstance from '../../../_utils/axiosInstance';
import { API_PATHS } from '../../../_utils/apiPaths';
import { UserContext } from '../../../context/UserContext';
import { useVacancies } from '../../../_hooks/useVacancies';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function ReferHistory() {
  const [referData, setReferData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { user } = useContext(UserContext);
  const { vacancies } = useVacancies();

  // Fetch referrals helper
  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.REFERRALS.GET_BY_USER_ID(user.id));
      const mapped = response.data.map(ref => {
        let vacancyName = ref.vacancyName;
        if (!vacancyName && ref.vacancyId && vacancies.length > 0) {
          const found = vacancies.find(v => v.id === ref.vacancyId);
          vacancyName = found ? found.name : ref.vacancyId;
        }
        return {
          id: ref.id,
          vacancy: vacancyName || ref.vacancyId,
          applicant_name: ref.applicantName,
          applicant_email: ref.applicantEmail,
          message: ref.message,
          resume_file_path: ref.fileUrl,
          status: ref.status,
        };
      });
      setReferData(mapped);
    } catch (error) {
      setReferData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchReferrals();
  }, [user?.id, vacancies]);

  // Edit logic
  const handleUpdateRecord = async (id, data) => {
    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.REFERRALS.UPDATE(id), data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchReferrals();
    } catch (error) {
      // fallback: do nothing or show error
    } finally {
      setLoading(false);
    }
  };

  // Delete logic
  const handleDeleteRecord = async (recordToDelete) => {
    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.REFERRALS.DELETE(recordToDelete.id));
      await fetchReferrals();
    } catch (error) {
      setReferData(prev => prev.filter(record => record.id !== recordToDelete.id));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRecord) return;
    
    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.REFERRALS.DELETE(selectedRecord.id));
      await fetchReferrals();
    } catch (error) {
      console.error("Delete error:", error);
      // Remove from local state as fallback
      setReferData(prev => prev.filter(item => item.id !== selectedRecord.id));
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Download function for resume files
  const handleDownloadFile = async (fileUrl, fileName = 'resume.pdf') => {
    try {
      if (!fileUrl) {
        showSnackbar('No file available for download', 'warning');
        return;
      }
      const fullUrl = "http://localhost:8080" + fileUrl;
      const response = await axiosInstance.get(fullUrl, {
        responseType: 'blob',
        headers: { 'Accept': 'application/octet-stream' }
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSnackbar('File downloaded successfully', 'success');
    } catch (error) {
      showSnackbar('Error downloading file. Please try again.', 'error');
    }
  };

  const renderActions = (params) => {
    return (
      <Box sx={{ display: 'flex', gap: 1,mt:1 }}>
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
  };

  const columns = [
    { field: "vacancy", headerName: "Vacancy", width: 150 },
    { field: "applicant_name", headerName: "Candidate Name", width: 150 },
    { field: "applicant_email", headerName: "Candidate Email", width: 150 },
    { 
      field: "message", 
      headerName: "Message", 
      width: 200,
      renderCell: (params) => (
        <Box sx={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          maxWidth: '100%'
        }}>
          {params.value}
        </Box>
      )
    },
    { 
      field: "resume_file_path", 
      headerName: "Uploaded Resume", 
      width: 180,
      renderCell: (params) => {
        const fileUrl = params.value;
        if (!fileUrl) return "No file";
        const fileName = fileUrl.split('/').pop() || 'resume.pdf';
        return (
          <Button size="small" variant="outlined" onClick={() => handleDownloadFile(fileUrl, fileName)}>
            Download
          </Button>
        );
      }
    },
    { field: "status", headerName: "Referral State", width: 120,
      
      renderCell: (params) => {
        const status = params.value?.toLowerCase();
        let color = "text.secondary"; 

        if (status === "unread") {
          color = "warning.main";
        } else if (status === "read") {
          color = "success.main";
        }
        
        return (
          <Box sx={{ color: color, fontWeight: 600 }}>
            {params.value}
          </Box>
        );
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      headerClassName: "last-column",
      renderCell: renderActions,
    },
  ];

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", p: 5 }}>
        {loading ? (
          <CircularProgress/>
        ) : (
          <DataGrid
            rows={referData}
            columns={columns}
            
          />
        )}
      </Box>
      
      <EditReferDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        record={selectedRecord}
        onUpdate={handleUpdateRecord}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this referral record?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            color="text.primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Paper>
  );
}