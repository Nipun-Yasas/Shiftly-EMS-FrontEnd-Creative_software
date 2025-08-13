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
} from "../../admin-portal/_helpers/colorhelper";

import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { UserContext } from "../../../context/UserContext";

export default function LeaveHistory() {
  const [employee, setEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const fetchEmployeesInSameDepartment = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.EMPLOYEE.GET_BY_DEPARTMENTID(employee.departmentId)
      );
      setEmployees(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.LEAVES.GET_BY_EMPLOYEEID(employee.employeeId)
      );

      if (!response.data || response.data.length === 0) {
        setLeaves([]);
        return;
      }
      setLeaves(
        (response.data || []).map((r) => ({
          ...r,
          status: r.status?.toLowerCase(),
          leave_type: r.leave_type,
        }))
      );
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to fetch Leaves",
        "error"
      );
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
    fetchEmployeesInSameDepartment();
  }, []);

  useEffect(() => {
    if (employee && employee.employeeId) {
      fetchLeaves();
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
        leave_type: values.leaveType?.name || values.leave_type || "",
        leave_from: values.leave_from,
        leave_to: values.leave_to,
        reason: values.reason,
        cover_person: values.cover_person,
        leave_status: values.leave_status,
      };
      await axiosInstance.put(
        API_PATHS.LEAVES.UPDATE(selectedRecord.id),
        payload
      );
      await fetchLeaves();
      showSnackbar("Leave updated successfully");
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
      await axiosInstance.delete(API_PATHS.LEAVES.DELETE(selectedRecord.id));

      await fetchLeaves();
      showSnackbar("Leave deleted successfully.", "success");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to delete leave",
        "error"
      );
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    }
  };

  // Function to update leave counts
  const updateLeaveCounts = (leaves) => {
    const total = leaves.length;
    const pending = leaves.filter(
      (leave) => leave.leave_status?.toLowerCase() === "pending"
    ).length;
    const approved = leaves.filter(
      (leave) => leave.leave_status?.toLowerCase() === "approved"
    ).length;
    const rejected = leaves.filter(
      (leave) => leave.leave_status?.toLowerCase() === "rejected"
    ).length;

    setTotalLeaves(total);
    setPendingLeaves(pending);
    setApprovedLeaves(approved);
    setRejectedLeaves(rejected);
  };

  const columns = [
    {
      field: "employeeName",
      headerName: "Employee Name",
      width: 120,
    },
    {
      field: "departmentName",
      headerName: "Department",
      width: 150,
    },
    {
      field: "leaveType",
      headerName: "Leave Type",
      width: 90,
      renderCell: (params) => <span>{params.value}</span>,
    },
    {
      field: "leaveFrom",
      headerName: "Leave From",
      width: 110,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "leaveTo",
      headerName: "Leave To",
      width: 110,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    { field: "reason", headerName: "Reason", width: 160 },
    { field: "coverPersonName", headerName: "Cover Person", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 110,
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
      width: 90,
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
              onClick={fetchLeaves}
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
            { label: "Total  ", color: "info", value: leaves.length },
            {
              label: "Pending",
              color: "warning",
              value: leaves.filter((d) => d.status?.toLowerCase() === "pending")
                .length,
            },
            {
              label: "Approved",
              color: "success",
              value: leaves.filter(
                (d) => d.status?.toLowerCase() === "approved"
              ).length,
            },
            {
              label: "Rejected",
              color: "error",
              value: leaves.filter(
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
          <CustomDataGrid rows={leaves} columns={columns} />
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
        employees={employees}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={DeleteRecord}
        loading={loading}
        title="Delete Leave request"
        message="Are you sure you want to delete this leave request?"
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
