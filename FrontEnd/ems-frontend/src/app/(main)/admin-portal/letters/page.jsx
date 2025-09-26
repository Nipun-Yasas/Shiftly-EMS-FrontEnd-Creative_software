"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";

import dayjs from "dayjs";

import CustomDataGrid from "../../_components/CustomDataGrid";
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { getStatusColor, getStatusIcon } from "../_helpers/colorhelper";

import { UserContext } from "../../../context/UserContext";

export default function LettersAdminPage() {
  const router = useRouter();

  const { user } = useContext(UserContext);

  const roles = (user?.roles || []).map((r) => r.toLowerCase());
  const isSuperAdmin = roles.includes("super_admin");

  const [letters, setLetters] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchLetters = async () => {
    setLoading(true);
    try {
      let response;
      if (isSuperAdmin) {
        response = await axiosInstance.get(API_PATHS.LETTER.REQUEST.ALL);
      } else {
        response = await axiosInstance.get(
          API_PATHS.LETTER.REQUEST.BY_ADMIN(user?.id)
        );
      }
      setLetters(
        (response.data || []).map((r) => ({
          ...r,
          status: r.status?.toLowerCase(),
        }))
      );
    } catch (error) {
      setEvents([]);
      showSnackbar("Failed to fetch Events", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const handleUpdateStatus = async (row, status) => {
    try {
      setUpdatingId(row.id);
      await axiosInstance.put(
        `${API_PATHS.LETTER.REQUEST.UPDATE_STATUS(row.id)}?status=${encodeURIComponent(status)}`
      );
      setLetters((prev) =>
        prev.map((r) =>
          r.id === row.id
            ? { ...r, status: status.toString().toLowerCase() }
            : r
        )
      );
      showSnackbar(`Status updated to ${status}`);
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Failed to update status",
        "error"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleGenerate = (row) => {
    router.push(`/admin-portal/letters/generate/${row.id}`);
  };

  const columns = [
    {
      field: "employeeName",
      headerName: "Employee",
      width: 180,
    },
    { field: "departmentName", headerName: "Department", width: 140 },
    { field: "letterType", headerName: "Letter Type", width: 250 },
    {
      field: "createdAt",
      headerName: "Requested At",
      flex: 1,
      minWidth: 200,
      renderCell: () =>"2025-8-15",
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
      field: "actions",
      headerName: "Actions",
      width: 220,
      headerClassName: "last-column",
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Generate">
            <span>
              <IconButton
                size="small"
                onClick={() => handleGenerate(params.row)}
                color="primary"
              >
                <ContentPasteGoIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Mark as Read">
            <span>
              <IconButton
                size="small"
                onClick={() => handleUpdateStatus(params.row, "READ")}
                disabled={updatingId === params.row?.id}
                color="secondary"
              >
                <MarkEmailReadIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Mark as Unread">
            <span>
              <IconButton
                size="small"
                onClick={() => handleUpdateStatus(params.row, "UNREAD")}
                disabled={updatingId === params.row?.id}
                color="default"
              >
                <MarkEmailUnreadIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Paper elevation={3} sx={{ width: "100%", height: "100%" }}>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            Letters Management
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button variant="contained" onClick={() => router.push("/letter")}>
              New Letter
            </Button>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          View and manage letter requests. Use “New Letter” to generate a new
          letter.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mt: 1,
            }}
          >
            <CustomDataGrid rows={letters} columns={columns} />
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
