"use client";

import { useState, useEffect, useContext } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

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

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchReferrals = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.REFERRALS.MY_REFERRALS
      );

      if (!response.data || response.data.length === 0) {
        setData([]);
        return;
      }
      setData(response.data);
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to fetch data",
        "error"
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchReferrals();
  }, [user, vacancies]);

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
      await axiosInstance.put(API_PATHS.REFERRALS.UPDATE(id), data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      await fetchReferrals();
      showSnackbar("Referral deleted successfully.", "success");
    } catch (error) {
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
      <Box
        sx={{ display: "flex", justifyContent: "center", width: "100%", p: 5 }}
      >
        {loading ? (
          <CircularProgress />
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
        autoHideDuration={500}
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
