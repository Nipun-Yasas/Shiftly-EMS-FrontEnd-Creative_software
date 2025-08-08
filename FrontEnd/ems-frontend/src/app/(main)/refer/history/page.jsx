"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";

import CircularProgress from "@mui/material/CircularProgress";
import EditDialog from "../_components/EditDialog";
import DeleteDialog from "../../_components/DeleteDialog";
import CustomDataGrid from "../../_components/CustomDataGrid";
import {
  getStatusIcon,
  getStatusColor,
} from "../../admin-portal/_helpers/colorhelper";

import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { notifyReferralChange, listenForReferralChanges, REFERRAL_EVENTS } from "../../../_utils/referralUtils";
import { useVacancies } from "../../../_hooks/useVacancies";
import { UserContext } from "../../../context/UserContext";

export default function ReferHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { user } = useContext(UserContext);
  const { vacancies } = useVacancies();
  const router = useRouter();
  const searchParams = useSearchParams();

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchReferrals = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available, skipping fetch');
      return;
    }
    setLoading(true);
    try {
      console.log('Fetching referrals for user ID:', user.id);
      const response = await axiosInstance.get(
        API_PATHS.REFERRALS.MY_REFERRALS
      );

      console.log('Referrals API Response:', response.data);

      if (!response.data || response.data.length === 0) {
        console.log('No referrals found');
        setData([]);
        return;
      }
      
      // Map backend fields correctly and ensure each row has an id for DataGrid
      const referralsWithIds = response.data.map((referral, index) => ({
        ...referral,
        id: referral.id || index + 1,
        vacancyName: referral.vacancyName || '',
        applicantName: referral.applicantName || '',
        applicantEmail: referral.applicantEmail || '',
        message: referral.message || '',
        fileUrl: referral.fileUrl || '',
        status: referral.status || 'unread',
      }));
      
      console.log('Processed referrals data:', referralsWithIds);
      setData(referralsWithIds);
    } catch (error) {
      console.error('Error fetching referrals:', error);
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
    fetchReferrals();
  }, [user, vacancies, fetchReferrals]);

  // Add router change listener to refresh when navigating to this page
  useEffect(() => {
    const handleRouteChange = () => {
      if (user?.id) {
        console.log('Route changed to referral history, refreshing data...');
        fetchReferrals();
      }
    };

    // Refresh when component mounts or user navigates to this page
    handleRouteChange();
  }, [user?.id, fetchReferrals]);

  // Listen for URL parameter changes (e.g., when redirected from submit page)
  useEffect(() => {
    const refresh = searchParams.get('refresh');
    if (refresh === 'true' && user?.id) {
      console.log('Refresh parameter detected, fetching referrals...');
      fetchReferrals();
      // Clean up the URL parameter
      router.replace('/refer/history', { scroll: false });
    }
  }, [searchParams, user?.id, fetchReferrals, router]);

  // Add visibility change listener to refresh data when user comes back to this page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        fetchReferrals();
      }
    };

    const handleFocus = () => {
      if (user?.id) {
        fetchReferrals();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchReferrals, user?.id]);

  // Add periodic refresh every 30 seconds when the page is visible
  useEffect(() => {
    let intervalId;
    
    if (user?.id && !document.hidden) {
      intervalId = setInterval(() => {
        fetchReferrals();
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchReferrals, user?.id]);

  // Listen for storage events to refresh when referrals are submitted in other tabs
  useEffect(() => {
    const cleanup = listenForReferralChanges((event) => {
      if (user?.id && [REFERRAL_EVENTS.REFERRAL_SUBMITTED, REFERRAL_EVENTS.REFERRAL_UPDATED, REFERRAL_EVENTS.REFERRAL_DELETED].includes(event.type)) {
        console.log('Referral change detected:', event.type);
        fetchReferrals();
      }
    });

    return cleanup;
  }, [fetchReferrals, user?.id]);

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
      const response = await axiosInstance.put(API_PATHS.REFERRALS.UPDATE(id), data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Notify other tabs about the update
      notifyReferralChange(REFERRAL_EVENTS.REFERRAL_UPDATED, { id, ...response.data });
      
      await fetchReferrals();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to update record",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedRecord) return;

    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.REFERRALS.DELETE(selectedRecord.id));
      
      // Notify other tabs about the deletion
      notifyReferralChange(REFERRAL_EVENTS.REFERRAL_DELETED, { id: selectedRecord.id });
      
      await fetchReferrals();
      showSnackbar("Referral deleted successfully.", "success");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to delete referral",
        "error"
      );
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    }
  };

  const columns = [
    { field: "vacancyName", headerName: "Vacancy", width: 150 },
    { field: "applicantName", headerName: "Candidate Name", width: 150 },
    { field: "applicantEmail", headerName: "Candidate Email", width: 170 },
    {
      field: "message",
      headerName: "Message",
      width: 230,
      renderCell: (params) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "fileUrl",
      headerName: "Resume file",
      width: 130,
      renderCell: (params) => {
        const fileUrl = params.value;
        if (!fileUrl) return "No file";
        const fullUrl = "http://localhost:8080" + fileUrl;
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
      field: "status",
      headerName: "Referral State",
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
      field: "actions",
      headerName: "Actions",
      width: 100,
      headerClassName: "last-column",
      renderCell: (params) => {
        const isRead = params.row.status?.toLowerCase() === 'read';
        
        if (isRead) {
          // Show no actions for read referrals
          return (
            <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: "100%", justifyContent: "center" }}>
              <span style={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>
                No actions
              </span>
            </Box>
          );
        }

        return (
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
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
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", p: 5 }}>
        {/* Referral Statistics */}
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
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Total Referrals</div>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#fff3e0',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f57c00' }}>
                {data.filter(referral => referral.status?.toLowerCase() === 'unread').length}
              </span>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Unread</div>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#dcedc8',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#388e3c' }}>
                {data.filter(referral => referral.status?.toLowerCase() === 'read').length}
              </span>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Read</div>
            </Box>
          </Box>

          {/* Refresh Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="textSecondary">
              Auto-refresh: 30s
            </Typography>
            <Tooltip title="Refresh Referral History">
              <IconButton 
                onClick={fetchReferrals} 
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
        title="Delete Referral"
        message="Are you sure you want to delete this referral?"
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
