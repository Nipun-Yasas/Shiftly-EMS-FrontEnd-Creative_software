"use client";

import { useState, useEffect, useContext } from "react";

import dayjs from "dayjs";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import CircularProgress from "@mui/material/CircularProgress";

import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { UserContext } from "../../../context/UserContext";

import AvailableLeaves from "../_components/AvailableLeaves";
import LeaveForm from "../_components/LeaveForm";

export default function RequestLeave() {
  const [leaves, setLeaves] = useState([]);

  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState("");
  const [employees, setEmployees] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.EMPLOYEE.GET_BY_USERID(user.id)
      );
      setEmployee(response.data);
    } catch (error) {
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

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        leaveType: values.leaveType.name,
        leaveFrom: values.leaveFrom,
        leaveTo: values.leaveTo,
        coverPersonId: values.coverPersonId.employeeId || "",
        reason: values.reason,
      };
      const response = await axiosInstance.post(
        API_PATHS.LEAVES.ADD(employee.employeeId),
        payload
      );
      showSnackbar("Leave request submitted successfully", "success");
      resetForm();
    } catch (error) {
      showSnackbar("Failed to submit Leave request", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    if (employee && employee.departmentId) {
      fetchEmployeesInSameDepartment();
      fetchAndCalculate();
    }
  }, [employee]);

  const TOTAL_LEAVES = [
    { type: "Annual Leave", total: 10, hexColor: "#D81B60" },
    { type: "Casual Leave", total: 5, hexColor: "#2563EB" },
    { type: "Election Leave", total: 2, hexColor: "#EAB308" },
  ];

  // Mapping from backend leave type values to display names
  const LEAVE_TYPE_MAP = {
    annual: "Annual Leave",
    "annual leave": "Annual Leave",
    Annual: "Annual Leave",
    "Annual Leave": "Annual Leave",
    casual: "Casual Leave",
    election: "Election Leave",
    sick: "Sick Leave",
    // add more as needed
  };

  const TOTAL_ANNUAL_LEAVES = 10;
  const TOTAL_CASUAL_LEAVES = 5;
  const TOTAL_VACATION_LEAVES = 7;

  const fetchAndCalculate = async () => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.LEAVES.GET_BY_EMPLOYEEID(employee.employeeId)
      );
      const history = res.data || [];

      let usedAnnual = 0;
      let usedCasual = 0;
      let usedVacation = 0;

      history.forEach((l) => {
        const duration = Number(l.duration) || 1;
        usedAnnual += duration;
        if (l.leaveType?.toLowerCase() === "casual") usedCasual += duration;
        if (l.leaveType?.toLowerCase() === "vacation") usedVacation += duration;
      });

      setLeaves([
        {
          type: "Annual Leave",
          count: Math.max(0, TOTAL_ANNUAL_LEAVES - usedAnnual),
          hexColor: "#D81B60",
        },
        {
          type: "Casual Leave",
          count: Math.max(0, TOTAL_CASUAL_LEAVES - usedCasual),
          hexColor: "#2563EB",
        },
        {
          type: "Vacation Leave",
          count: Math.max(0, TOTAL_VACATION_LEAVES - usedVacation),
          hexColor: "#00BFAE",
        },
      ]);
    } catch (e) {
      setLeaves([
        {
          type: "Annual Leave",
          count: TOTAL_ANNUAL_LEAVES,
          hexColor: "#D81B60",
        },
        {
          type: "Casual Leave",
          count: TOTAL_CASUAL_LEAVES,
          hexColor: "#2563EB",
        },
        {
          type: "Vacation Leave",
          count: TOTAL_VACATION_LEAVES,
          hexColor: "#00BFAE",
        },
      ]);
    }
  };

  return (
    <Paper
      elevation={3}
      square={false}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            p: 5,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {employee ? (
            <Box sx={{ width: "100%", p: 3 }}>
              <AvailableLeaves leaves={leaves} />
              <LeaveForm handleSubmit={handleSubmit} employees={employees} />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                p: 5,
              }}
            >
              <Typography variant="h5" color="error.main">
                You are not assigned for a department please ask a admin to
                assign you
              </Typography>
            </Box>
          )}
        </>
      )}
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
