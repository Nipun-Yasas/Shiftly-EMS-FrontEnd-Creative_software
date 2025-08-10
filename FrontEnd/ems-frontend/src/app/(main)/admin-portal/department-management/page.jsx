"use client";

import { useEffect, useState } from "react";

import * as Yup from "yup";
import { Formik, Form } from "formik";

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
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import EditDialog from "./_components/EditDialog";
import DeleteDialog from "../../_components/DeleteDialog";

const departmentSchema = Yup.object().shape({
  departmentName: Yup.string().required("Department name is required"),
});

export default function page() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns = [
    { field: "departmentName", headerName: "Department Name", width: "200" },
    { field: "adminUserName", headerName: "Admin user name", width: "200" },
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

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.DEPARTMENTS.GET_ALL);

      if (!response.data || response.data.length === 0) {
        setData([]);
        return;
      }

      const mappedData = response.data.map((row) => ({
        id: row.departmentId,
        ...row,
      }));

      setData(mappedData);
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to fetch Department",
        "error"
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminsWithoutDepartment = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.SUPER_ADMIN.GET_ADMIN_WITHOUT_DEPARTMENTS
      );

      if (!response.data || response.data.length === 0) {
        setAdmins([]);
        return;
      }

      setAdmins(response.data);
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "No Admins without departments",
        "error"
      );
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchAdminsWithoutDepartment();
  }, []);

  const handleUpdateRecord = async (values, { setSubmitting }) => {
    if (!selectedRecord || !values.adminuserid) return;
    try {
      await axiosInstance.put(
        API_PATHS.DEPARTMENTS.DEPARTMENT_ADMIN_ASSIGN(
          selectedRecord.departmentId,
          values.adminuserid.id
        )
      );
      showSnackbar("Admin assigned successfully", "success");
      fetchDepartments();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Error assigning admin",
        "error"
      );
    } finally {
      setSubmitting(false);
      setEditDialogOpen(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedRecord) return;

    setLoading(true);
    try {
      await axiosInstance.delete(
        API_PATHS.DEPARTMENTS.DELETE(selectedRecord.departmentId)
      );
      await fetchDepartments();
      showSnackbar("Department deleted successfully.", "success");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to delete Department",
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
      const response = await axiosInstance.post(
        API_PATHS.DEPARTMENTS.ADD,
        values
      );
      if (response.status === 200) {
        showSnackbar("Department added successfully", "success");
      }
      resetForm();
      await fetchDepartments();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to add Department",
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
        <Formik
          initialValues={{ departmentName: "" }}
          validationSchema={departmentSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Typography variant="h5" color="text.primary">
              Add a new department
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <InputItem>
                <TextInput
                  name="departmentName"
                  label="Enter department name"
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
        <Typography sx={{ mt: 5 }} variant="h5" color="text.primary">
          Existing departments
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

      {/* Edit Dialog */}
      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        record={selectedRecord}
        onUpdate={handleUpdateRecord}
        row={selectedRecord}
        admins={admins}
        validationSchema={departmentSchema}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        loading={loading}
        title={"Delete Department"}
        message={`Are you sure you want to delete department "${selectedRecord?.departmentName}" with admin "${selectedRecord?.adminUserName || ""}"?`}
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
