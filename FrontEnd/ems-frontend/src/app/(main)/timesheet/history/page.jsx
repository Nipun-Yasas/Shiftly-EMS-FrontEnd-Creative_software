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

import CircularProgress from "@mui/material/CircularProgress";
import EditDialog from "../_components/EditDialog";
import DeleteDialog from "../../_components/DeleteDialog";
import CustomDataGrid from "../../_components/CustomDataGrid";
import {
  getStatusIcon,
  getStatusColor,
  getWorkModeColor,
} from "../../admin-portal/_helpers/colorhelper";

import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { UserContext } from "../../../context/UserContext";

export default function TimeSheetHistory() {
  const [timeSheets, setTimeSheets] = useState([]);
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

  const fetchTimeSheets = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.TIMESHEETS.GET_BY_EMPLOYEEID(employee.employeeId)
      );

      if (!response.data || response.data.length === 0) {
        setTimeSheets([]);
        return;
      }
      setTimeSheets(
        (response.data || []).map((r) => ({
          ...r,
          status: r.status?.toLowerCase(),
          mode: r.mode,
        }))
      );
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to fetch Time Sheets",
        "error"
      );
      setTimeSheets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    if (employee && employee.employeeId) {
      fetchTimeSheets();
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

  const handleUpdate = async (values, { setSubmitting }) => {
    if (!selectedRecord) return;
    setLoading(true);
    try {
      const payload = {
        date: values.date,
        mode: values.workMode?.name || values.mode || "",
        activity: values.activity,
        hours: Number(values.hours),
      };
      await axiosInstance.put(
        API_PATHS.TIMESHEETS.UPDATE(selectedRecord.id),
        payload
      );
      await fetchTimeSheets();
      showSnackbar("Timesheet updated successfully");
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
      await axiosInstance.delete(
        API_PATHS.TIMESHEETS.DELETE(selectedRecord.id)
      );

      await fetchTimeSheets();
      showSnackbar("Timesheet deleted successfully.", "success");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to delete timesheet",
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
      field: "employeeName",
      headerName: "Employee Name",
      width: 150,
    },
    {
      field: "departmentName",
      headerName: "Department",
      width: 150,
    },
    {
      field: "mode",
      headerName: "Work Mode",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getWorkModeColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "hours",
      headerName: "Hours",
      width: 70,
    },
    {
      field: "date",
      headerName: "Date",
      width: 110,
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
      field: "activity",
      headerName: "Activity",
      width: 230,
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
          <Tooltip title="Refresh Time Sheets">
            <Button
              variant="outlined"
              onClick={fetchTimeSheets}
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
            { label: "Total  ", color: "info", value: timeSheets.length },
            {
              label: "Pending",
              color: "warning",
              value: timeSheets.filter(
                (d) => d.status?.toLowerCase() === "pending"
              ).length,
            },
            {
              label: "Approved",
              color: "success",
              value: timeSheets.filter(
                (d) => d.status?.toLowerCase() === "approved"
              ).length,
            },
            {
              label: "Rejected",
              color: "error",
              value: timeSheets.filter(
                (d) => d.status?.toLowerCase() === "rejected"
              ).length,
            },
          ].map((card, index) => (
            <Grid item key={index}>
              <Card
                sx={{
                  minWidth: { xs: "125px", sm: "125px", lg: "200px" },
                  maxHeight: "60px",
                  textAlign: "center",
                  bgcolor: `${card.color}.light`,
                  borderRadius: 10,
                }}
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
                      color: `${card.color}.contrastText`,
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
          <CustomDataGrid rows={timeSheets} columns={columns} />
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
        title="Delete Time Sheet"
        message="Are you sure you want to delete this time sheet?"
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
