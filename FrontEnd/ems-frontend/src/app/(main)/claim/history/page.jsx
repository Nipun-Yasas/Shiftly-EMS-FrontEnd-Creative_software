"use client";

import { useEffect, useState, useContext, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import dayjs from "dayjs";

import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";
import { listenForClaimChanges, CLAIM_EVENTS, notifyClaimChange } from "../../../_utils/claimUtils";
import {
  getStatusIcon,
  getStatusColor,
} from "../../admin-portal/_helpers/colorhelper";
import { UserContext } from "../../../context/UserContext";
import DeleteDialog from "../../_components/DeleteDialog";
import CustomDataGrid from "../../_components/CustomDataGrid";
import EditDialog from "../_components/EditDialog";

export default function ClaimHistory() {
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

  const fetchClaims = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available, skipping fetch');
      return;
    }
    setLoading(true);
    try {
      console.log('Fetching claims for user ID:', user.id);
      const response = await axiosInstance.get(
        API_PATHS.CLAIMS.GET_MY_CLAIMS(user.id)
      );

      console.log('Claims API Response:', response.data);

      if (!response.data || response.data.length === 0) {
        console.log('No claims found');
        setData([]);
        return;
      }
      
      // Map backend fields correctly and ensure each row has an id for DataGrid
      const claimsWithIds = response.data.map((claim, index) => ({
        ...claim,
        id: claim.id || index + 1,
        claimType: claim.claimType || '',
        description: claim.description || '',
        claimDate: claim.claimDate || '',
        status: claim.status || 'Pending',
        claimUrl: claim.claimUrl || claim.fileUrl || '',
      }));
      
      console.log('Processed claims data:', claimsWithIds);
      setData(claimsWithIds);
    } catch (error) {
      console.error('Error fetching claims:', error);
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
    fetchClaims();
  }, [user, fetchClaims]);

  // Add router change listener to refresh when navigating to this page
  useEffect(() => {
    const handleRouteChange = () => {
      if (user?.id) {
        console.log('Route changed to claim history, refreshing data...');
        fetchClaims();
      }
    };

    // Refresh when component mounts or user navigates to this page
    handleRouteChange();
  }, [user?.id, fetchClaims]);

  // Listen for URL parameter changes (e.g., when redirected from submit page)
  useEffect(() => {
    const refresh = searchParams.get('refresh');
    if (refresh === 'true' && user?.id) {
      console.log('Refresh parameter detected, fetching claims...');
      fetchClaims();
      // Clean up the URL parameter
      router.replace('/claim/history', { scroll: false });
    }
  }, [searchParams, user?.id, fetchClaims, router]);

  // Add visibility change listener to refresh data when user comes back to this page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        fetchClaims();
      }
    };

    const handleFocus = () => {
      if (user?.id) {
        fetchClaims();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchClaims, user?.id]);

  // Add periodic refresh every 30 seconds when the page is visible
  useEffect(() => {
    let intervalId;
    
    if (user?.id && !document.hidden) {
      intervalId = setInterval(() => {
        fetchClaims();
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchClaims, user?.id]);

  // Listen for storage events to refresh when claims are submitted in other tabs
  useEffect(() => {
    const cleanup = listenForClaimChanges((event) => {
      if (user?.id && [CLAIM_EVENTS.CLAIM_SUBMITTED, CLAIM_EVENTS.CLAIM_UPDATED, CLAIM_EVENTS.CLAIM_DELETED].includes(event.type)) {
        console.log('Claim change detected:', event.type);
        fetchClaims();
      }
    });

    return cleanup;
  }, [fetchClaims, user?.id]);

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
      const response = await axiosInstance.put(API_PATHS.CLAIMS.UPDATE(id), data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Notify other tabs about the update
      notifyClaimChange(CLAIM_EVENTS.CLAIM_UPDATED, { id, ...response.data });
      
      await fetchClaims();
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
      await axiosInstance.delete(API_PATHS.CLAIMS.DELETE(selectedRecord.id));
      
      // Notify other tabs about the deletion
      notifyClaimChange(CLAIM_EVENTS.CLAIM_DELETED, { id: selectedRecord.id });
      
      await fetchClaims();
      showSnackbar("Claim deleted successfully.", "success");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to delete claim",
        "error"
      );
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    }
  };

  const columns = [
    { field: "claimType", headerName: "Type", width: 180 },
    { field: "description", headerName: "Description", width: 350 },
    {
      field: "claimDate",
      headerName: "Claim Date",
      width: 150,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
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
      field: "claimUrl",
      headerName: "Claim File",
      width: 150,
      renderCell: (params) =>{
         const claimUrl = params.value;
        if (!claimUrl) return "No file";
        const fullUrl = "http://localhost:8080" + claimUrl;
        return(
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
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClassName: "last-column",
      width: 120,
      renderCell: (params) => {
        const isPending = params.row.status?.toLowerCase() === 'pending';
        
        if (!isPending) {
          // Show no actions for approved or rejected claims
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
        {/* Claim Statistics */}
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
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Total Claims</div>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#fff3e0',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f57c00' }}>
                {data.filter(claim => claim.status?.toLowerCase() === 'pending').length}
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
                {data.filter(claim => claim.status?.toLowerCase() === 'approved').length}
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
                {data.filter(claim => claim.status?.toLowerCase() === 'rejected').length}
              </span>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Rejected</div>
            </Box>
          </Box>

          {/* Refresh Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="textSecondary">
              Auto-refresh: 30s
            </Typography>
            <Tooltip title="Refresh Claim History">
              <IconButton 
                onClick={fetchClaims} 
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
