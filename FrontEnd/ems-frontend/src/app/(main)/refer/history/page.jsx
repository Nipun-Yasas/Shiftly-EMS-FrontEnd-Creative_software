"use client";

import { useState, useEffect, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import EditReferDialog from "../_components/EditReferDialog";
import CircularProgress from "@mui/material/CircularProgress";
import axiosInstance from '../../../_utils/axiosInstance';
import { API_PATHS } from '../../../_utils/apiPaths';
import { UserContext } from '../../../context/UserContext';
import { useVacancies } from '../../../_hooks/useVacancies';

export default function ReferHistory() {
  const [referData, setReferData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { user } = useContext(UserContext);
  const { vacancies } = useVacancies();

  // Fetch referrals helper
  const fetchReferrals = async () => {
    setLoading(true);
    try {
      // Use the /my endpoint instead of /user/{userId} for better security
      const response = await axiosInstance.get(API_PATHS.REFERRALS.MY_REFERRALS);
      console.log('=== RAW RESPONSE FROM BACKEND ===');
      console.log(response.data);
      console.log('=== END RAW RESPONSE ===');
      
      if (!response.data || response.data.length === 0) {
        console.log('No referrals found in response');
        setReferData([]);
        return;
      }

      // Let's log each individual item to see the structure
      response.data.forEach((ref, index) => {
        console.log(`=== REFERRAL ${index + 1} ===`);
        console.log('Full object:', ref);
        console.log('ID:', ref.id);
        console.log('fileUrl property:', ref.fileUrl);
        console.log('fileUrl type:', typeof ref.fileUrl);
        console.log('fileUrl is null?', ref.fileUrl === null);
        console.log('fileUrl is undefined?', ref.fileUrl === undefined);
        console.log('fileUrl is empty string?', ref.fileUrl === '');
        console.log('=== END REFERRAL ===');
      });
      
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
          fileUrl: ref.fileUrl,
          status: ref.status,
        };
      });
      
      console.log('=== MAPPED DATA ===');
      console.log(mapped);
      console.log('=== END MAPPED DATA ===');
      
      setReferData(mapped);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setReferData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      console.log('User not available:', user);
      return;
    }
    console.log('Fetching referrals for current user');
    fetchReferrals();
  }, [user, vacancies]);

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
      sortable: false,
      renderCell: (params) => {
        const fileUrl = params.value;
        const rowData = params.row;
        
        console.log('=== RENDER CELL DEBUG ===');
        console.log('Row ID:', rowData.id);
        console.log('params.value (fileUrl):', fileUrl);
        console.log('Type of fileUrl:', typeof fileUrl);
        console.log('fileUrl === null:', fileUrl === null);
        console.log('fileUrl === undefined:', fileUrl === undefined);
        console.log('fileUrl === "":', fileUrl === "");
        console.log('fileUrl === "null":', fileUrl === "null");
        console.log('Row data fileUrl property:', rowData.fileUrl);
        console.log('Row data resume_file_path property:', rowData.resume_file_path);
        console.log('Full row data:', rowData);
        console.log('=== END RENDER CELL DEBUG ===');
        
        // TEMPORARY: Let's test with a hardcoded file URL to see if the button works
        if (rowData.id === 1) { // Testing with your current row ID
          console.log('Testing with hardcoded URL for row 1');
          return (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => {
                const testUrl = 'http://localhost:8080/uploads/files/087cae95-cf00-45ca-8fab-0707d9b9b8a9_mediq_logo.png';
                console.log('Test download clicked:', testUrl);
                window.open(testUrl, '_blank');
              }}
              sx={{ 
                fontSize: '0.75rem',
                minWidth: 'auto',
                px: 1,
                py: 0.5,
                backgroundColor: '#e3f2fd' // Light blue to indicate it's a test button
              }}
            >
              Test Download
            </Button>
          );
        }
        
        // Check for all possible falsy values
        if (!fileUrl || 
            fileUrl === 'null' || 
            fileUrl === '' || 
            fileUrl === null || 
            fileUrl === undefined ||
            (typeof fileUrl === 'string' && fileUrl.trim() === '')) {
          console.log('Showing No file for row:', rowData.id);
          return (
            <Box sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              No file
            </Box>
          );
        }
        
        // Construct the full URL - handle both cases where fileUrl starts with / or not
        const fullUrl = fileUrl.startsWith('/') 
          ? `http://localhost:8080${fileUrl}` 
          : `http://localhost:8080/${fileUrl}`;
        
        console.log('Showing Download button for row:', rowData.id, 'URL:', fullUrl);
        
        return (
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={() => {
              console.log('Download button clicked, opening:', fullUrl);
              window.open(fullUrl, '_blank');
            }}
            sx={{ 
              fontSize: '0.75rem',
              minWidth: 'auto',
              px: 1,
              py: 0.5
            }}
          >
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
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
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

    </Paper>
  );
}