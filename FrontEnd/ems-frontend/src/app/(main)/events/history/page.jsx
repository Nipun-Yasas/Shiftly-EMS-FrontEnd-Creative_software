"use client";

import { useState, useEffect, useContext } from "react";

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

import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";
import {
  getStatusIcon,
  getStatusColor,
} from "../../admin-portal/_helpers/colorhelper";
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

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchEvents = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EVENTS.GET_ALL_EVENTS);

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
    fetchEvents();
  }, [user]);

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
      await axiosInstance.put(API_PATHS.EVENTS.UPDATE(id), data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchEvents();
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
      await axiosInstance.delete(API_PATHS.EVENTS.DELETE(selectedRecord.id));
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
              onClick={() => handleDelete(params.row)}
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
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          p: 5,
        }}
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
