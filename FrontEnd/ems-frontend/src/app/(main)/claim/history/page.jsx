"use client";

import { useState, useEffect, useContext } from "react";

import dayjs from "dayjs";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
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
import { UserContext } from "../../../context/UserContext";

export default function TimeSheetHistory() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.CLAIMS.GET_BY_EMPLOYEEID(employee.employeeId)
      );

      if (!response.data || response.data.length === 0) {
        setClaims([]);
        return;
      }
      setClaims(
        (response.data || []).map((r) => ({
          ...r,
          status: r.status?.toLowerCase(),
        }))
      );
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to fetch Claim",
        "error"
      );
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    if (employee && employee.employeeId) {
      fetchClaims();
    }
  }, [employee]);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const handleUpdate = async (values, { setSubmitting, resetForm }) => {
    if (!selectedRecord) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("claimType", values.claimType?.name);
      formData.append("description", values.description);
      formData.append("claimDate", values.claimDate);
      if (values.file) {
        formData.append("file", values.file);
      }

      await axiosInstance.put(
        API_PATHS.CLAIMS.UPDATE(selectedRecord.id),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      showSnackbar("Claim updated successfully", "success");
      resetForm();
      setEditDialogOpen(false);
      setSelectedRecord(null);
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to update record",
        "error"
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const DeleteRecord = async () => {
    if (!selectedRecord) return;

    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.CLAIMS.DELETE(selectedRecord.id));

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
      renderCell: (params) => {
        const claimUrl = params.value;
        if (!claimUrl) return "No file";
        const fullUrl = "http://localhost:8080" + claimUrl;
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
      headerClassName: "last-column",
      width: 100,
      renderCell: (params) => {
        const isPending = params.row.status === "pending";

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
          <Tooltip title="Refresh Claims">
            <Button
              variant="outlined"
              onClick={fetchClaims}
              size="small"
              startIcon={<RefreshIcon />}
              disabled={loading}
            >
              Refresh
            </Button>
          </Tooltip>
        </Box>

        <Grid container spacing={2} my={3}>
          {[
            { label: "Total  ", color: "info", value: claims.length },
            {
              label: "Pending",
              color: "warning",
              value: claims.filter((d) => d.status?.toLowerCase() === "pending")
                .length,
            },
            {
              label: "Approved",
              color: "success",
              value: claims.filter(
                (d) => d.status?.toLowerCase() === "approved"
              ).length,
            },
            {
              label: "Rejected",
              color: "error",
              value: claims.filter(
                (d) => d.status?.toLowerCase() === "rejected"
              ).length,
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
                      color: "#000000",
                    }}
                  >
                    {card.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CustomDataGrid rows={claims} columns={columns} />
        )}
      </Box>

      <EditDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
        handleUpdate={handleUpdate}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={DeleteRecord}
        loading={loading}
        title="Delete Claim"
        message="Are you sure you want to delete this claim?"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
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
