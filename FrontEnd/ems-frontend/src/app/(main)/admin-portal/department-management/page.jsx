"use client";

import { useEffect, useState } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Formik, Form } from "formik";
import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import CustomDataGrid from "../../_components/CustomDataGrid";
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import EditDialog from "./_components/EditDialog"; 
import DeleteDialog from "../../_components/DeleteDialog";


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
      const response = await axiosInstance.get(
        API_PATHS.DEPARTMENTS.GET_ALL_DEPARTMENTS
      );

      if (!response.data || response.data.length === 0) {
        setData([]);
        return;
      }

      const mappedData = response.data.map((row) => ({
        id: row.departmentId,
        ...row,
      }));

      setData(mappedData);
      console.log("Fetched departments:", mappedData);
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

  const fetchAllAdmins = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.SUPER_ADMIN.GET_ALL_ADMINS);

      if (!response.data || response.data.length === 0) {
        setAdmins([]);
        return;
      }

      setAdmins(response.data);
    } catch (error) {
      showSnackbar(
            error.response?.data?.message || "Failed to fetch admins",
            "error"
          );
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchAllAdmins();
  }, []);

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
        throw error; // Re-throw to let EditDialog handle the error
      } finally {
        setLoading(false);
      }
    };

    const confirmDelete = async () => {
        if (!selectedRecord) return;
    
        setLoading(true);
        try {
          await axiosInstance.delete(API_PATHS.DEPARTMENTS.DELETE_DEPARTMENT(selectedRecord.departmentId));
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
        API_PATHS.DEPARTMENTS.ADD_DEPARTMENT,
        values
      );
      if (response.status === 200) {
        showSnackbar("Department added successfully", "success");
      }
      resetForm();
    } catch (error) {
       showSnackbar(
            error.response?.data?.message || "Failed to assign a admin Department",
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
        <Formik initialValues={{ departmentName: "" }} onSubmit={handleSubmit}>
          <Form>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 0, sm: 2 },
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "520px" }, mt: 3 }}>
            <CustomDataGrid rows={data} columns={columns} />
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
      />

      <DeleteDialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              onConfirm={confirmDelete}
              loading={loading}
            />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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
