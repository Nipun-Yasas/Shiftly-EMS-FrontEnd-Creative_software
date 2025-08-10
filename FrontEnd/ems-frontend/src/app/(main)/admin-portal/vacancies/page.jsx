"use client";

import { useContext, useEffect, useState } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import CustomDataGrid from "../../_components/CustomDataGrid";
import EditDialog from "./_components/EditDialog";
import DeleteDialog from "../../_components/DeleteDialog";

import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { UserContext } from "../../../context/UserContext";

const vacancySchema = Yup.object().shape({
  vacancyName: Yup.string().required("Vacancy name is required"),
});

export default function page() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { user } = useContext(UserContext);

  const columns = [
    { field: "vacancyName", headerName: "Vacancy Name", width: "200" },
    { field: "departmentName", headerName: "Department Name", width: "200" },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
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

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      const roles = user?.roles?.map((r) => r.toLowerCase()) || [];
      let response;

      if (roles.includes("super_admin")) {
        response = await axiosInstance.get(API_PATHS.VACANCIES.GET_ALL);
        setData(response.data);
      } else {
        const deptRes = await axiosInstance.get(
          API_PATHS.DEPARTMENTS.GET_DEPARTMENT_BY_ADMINID(user?.id)
        );
        const departmentId = deptRes?.data?.departmentId;
        if (!departmentId) {
          setData([]);
          setLoading(false);
          return;
        }
        response = await axiosInstance.get(
          API_PATHS.VACANCIES.GET_ALL_BY_DEPARTMENT(departmentId)
        );
      }

      if (!response?.data || response.data.length === 0) {
        setData([]);
        return;
      }

      setData(response.data);
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to fetch Vacancies",
        "error"
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleUpdateRecord = async (id, values) => {
    if (!selectedRecord) return;
    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.VACANCIES.UPDATE(id), values);
      await fetchVacancies();
      showSnackbar("Vacancy updated successfully.", "success");
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
      await axiosInstance.delete(
        API_PATHS.VACANCIES.DELETE(selectedRecord.id)
      );
      await fetchVacancies();
      showSnackbar("Vacancy deleted successfully.", "success");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to delete Designation",
        "error"
      );
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);

      const adminId = user?.id;
      if (!adminId) {
        showSnackbar("Admin user ID not found.", "error");
        setSubmitting(false);
        return;
      }

      const deptRes = await axiosInstance.get(
        API_PATHS.DEPARTMENTS.GET_DEPARTMENT_BY_ADMINID(adminId)
      );
      const departmentId = deptRes?.data?.departmentId;
      if (!departmentId) {
        showSnackbar("Department not found for this admin.", "error");
        setSubmitting(false);
        return;
      }

      const response = await axiosInstance.post(
        API_PATHS.VACANCIES.ADD(departmentId),
        values
      );
      if (response.status === 200) {
        showSnackbar("Vacancy added successfully", "success");
      }
      resetForm();
      await fetchVacancies();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "You are not a admin of a department",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  return (
    <Paper elevation={3} sx={{ width: "100%", height: "100%" }}>
      <Box sx={{ p: 3 }}>
        {!user?.roles?.map((r) => r.toLowerCase()).includes("super_admin") && (
          <Formik
            initialValues={{ vacancyName: "" }}
            validationSchema={vacancySchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Typography variant="h5" color="text.primary">
                Add a new Vacancy
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  mb: 5,
                }}
              >
                <InputItem>
                  <TextInput
                    name="vacancyName"
                    label="Enter vacancy name"
                  />
                </InputItem>
                <Box>
                  <Button variant="contained" type="submit">
                    Add
                  </Button>
                </Box>
              </Box>
            </Form>
          </Formik>
        )}
        <Typography variant="h5" color="text.primary">
          Existing vacancies
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: { xs: "100%", md: "520px" },
              mt: 3,
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <CustomDataGrid rows={data} columns={columns} />
            )}
          </Box>
        </Box>
      </Box>

      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        record={selectedRecord}
        onUpdate={handleUpdateRecord}
        validationSchema={vacancySchema} 
        row={selectedRecord}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        loading={loading}
        title={"Delete vacancy"}
        message={`Are you sure you want to delete the vacancy "${selectedRecord?.vacancyName}" in department "${selectedRecord?.departmentName}"? This action cannot be undone.`}
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
