"use client";

import { useEffect, useState, useContext } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteDialog from "../../_components/DeleteDialog";

import CircularProgress from "@mui/material/CircularProgress";

import RefreshIcon from "@mui/icons-material/Refresh";

import {
  getStatusColor,
  getStatusIcon,
} from "../../admin-portal/_helpers/colorhelper";
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { UserContext } from "../../../context/UserContext";
import CustomDataGrid from "../../_components/CustomDataGrid";

export default function LetterHistory() {
  const { user } = useContext(UserContext);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [employee, setEmployee] = useState("");
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.EMPLOYEE.GET_BY_USERID(user.id)
      );
      setEmployee(response.data);
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to fetch employee",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchLetters = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.LETTER.REQUEST.MY(employee.employeeId)
      );
      setLetters(response.data);
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to fetch letters",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    if (employee && employee.employeeId) {
      fetchLetters();
    }
  }, [employee]);

  const handleDelete = (row) => {
    setToDelete(row);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        API_PATHS.LETTER.REQUEST.DELETE(toDelete.id)
      );
      showSnackbar("Letter request deleted successfully", "success");
      await fetchLetters();
    } catch (e) {
      console.error("Failed to delete letter request:", e);
      showSnackbar(error || "Failed to delete letter request", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setToDelete(null);
    }
  };

  const columns = [
    { field: "letterType", headerName: "Letter Type", width: 240, flex: 1 },
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
      align: "center",
      headerClassName: "last-column",
      width: 100,
      renderCell: (params) => {
        const isPending = params.row.status === "unread";

        if (!isPending) return null;
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
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", p: 5 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Tooltip title="Refresh Letters">
            <Button
              variant="outlined"
              size="small"
              onClick={fetchLetters}
              startIcon={<RefreshIcon />}
              disabled={loading}
            >
              Refresh
            </Button>
          </Tooltip>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid container spacing={2} my={1} sx={{ alignItems: "center" }}>
            {[
            { label: "Total  ", color: "info", value: letters.length },
            {
              label: "Unread",
              color: "warning",
              value: letters.filter(
                (d) => d.status?.toLowerCase() === "unread"
              ).length,
            },
            {
              label: "Read",
              color: "success",
              value: letters.filter((d) => d.status?.toLowerCase() === "read")
                .length,
            },
            ].map((card, index) => (
              <Grid item key={index}>
                <Card
                  sx={(theme) => ({
                    minWidth: { xs: "125px", sm: "125px", lg: "200px" },
                    maxHeight: "60px",
                    textAlign: "center",
                    bgcolor: theme.palette[card.color]?.light,
                    borderRadius: 10,
                    border: `2px solid ${theme.palette[card.color]?.main}`,
                  })}
                  elevation={0}
                >
                  <CardContent
                    sx={{
                      gap: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      py: 1.25,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: `${card.color}.dark`,
                        fontSize: "1.2rem",
                      }}
                    >
                      {card.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "textblack.main",
                      }}
                    >
                      {card.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ width: "100%" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <CustomDataGrid rows={letters} columns={columns} />
          )}
        </Box>
      </Box>

      <DeleteDialog
        open={deleteConfirmOpen}
        onClose={() => () => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        loading={loading}
        title="Delete Letter request"
        message="Are you sure you want to delete this Letter Request?"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
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
    </Paper>
  );
}
