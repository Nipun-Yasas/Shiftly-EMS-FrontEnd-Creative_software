//// filepath: c:\Users\USER\Desktop\Shiftly-EMS-FrontEnd-Creative_software\FrontEnd\ems-frontend\src\app\(main)\admin-portal\user-management\_components\UsersTab.jsx
// ...existing code...
"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import { Formik, Form } from "formik";

import InputItem from "../../../../_components/inputs/InputItem";
import SelectInput from "../../../../_components/inputs/SelectInput";
import TextInput from "../../../../_components/inputs/TextInput";

import CustomDataGrid from "../../../_components/CustomDataGrid";
import axiosInstance from "../../../../_utils/axiosInstance";
import { API_PATHS } from "../../../../_utils/apiPaths";

export default function UsersTab({
  loading,
  user,
  users,
  handleEdit,
  handleDeleteUser,
  editDialogOpen,
  selectedRecord,
  handleSubmit,
  setEditDialogOpen,
}) {
  const [deptInfo, setDeptInfo] = useState(null);
  const [deptDesignations, setDeptDesignations] = useState([]);
  const [desigLoading, setDesigLoading] = useState(false);

  const roles = (user?.roles || []).map((r) => r.toLowerCase());
  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") && !isSuperAdmin;

  const fetchDepartmentByAdmin = async (adminId) => {
    if (!adminId) return null;
    const res = await axiosInstance.get(API_PATHS.DEPARTMENTS.GET_DEPARTMENT_BY_ADMINID(adminId));
    return res.data;
  };

  const fetchDesignationsByDepartment = async (departmentId) => {
    if (!departmentId) {
      setDeptDesignations([]);
      return [];
    }
    try {
      setDesigLoading(true);
      const res = await axiosInstance.get(
        API_PATHS.DESIGNATIONS.GET_ALL_BY_DEPARTMENT(departmentId)
      );
      const mapped = (res.data || []).map((d) => ({
        id: d.id ?? d.designationId ?? d.id,
        name: d.designationName,
        label: d.designationName,
      }));
      setDeptDesignations(mapped);
      return mapped;
    } finally {
      setDesigLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!editDialogOpen) return;
      try {
        const dept = await fetchDepartmentByAdmin(user?.id);
        if (!active) return;
        setDeptInfo(dept);
        await fetchDesignationsByDepartment(dept?.departmentId);
      } catch {
        setDeptInfo(null);
        setDeptDesignations([]);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [editDialogOpen, user?.id]);

  const columns = [
    { field: "username", headerName: "Username", width: 120 },
    { field: "email", headerName: "Email", width: 170 },
    {
      field: "roles",
      headerName: "Role",
      width: 80,
      renderCell: (params) => {
        return params.value?.[0] || "No role";
      },
    },
    { field: "department", headerName: "Department", width: 130 },
    { field: "designationName", headerName: "Designation", width: 140 },
    { field: "reportingPerson", headerName: "Reporting Person", width: 140 },
    { field: "reportingPersonEmail", headerName: "Reporting Email", width: 160 },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClassName: "last-column",
      width: 90,
      renderCell: (params) => {
        const canDelete = isSuperAdmin || isAdmin && Boolean(params.row?.department);
        return (
          <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: "100%", justifyContent: "center" }}>
            {!isSuperAdmin && (
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => handleEdit(params.row)}
                  sx={{ color: "primary.main" }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {canDelete && (
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={() => handleDeleteUser(params.row)}
                  sx={{ color: "error.main" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%", p: 5 }}>
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Edit User</Typography>
            <IconButton onClick={() => setEditDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Formik
            enableReinitialize
            initialValues={{
              departmentId: deptInfo?.departmentId || null,
              departmentName: deptInfo?.departmentName || "",
              designationId:
                (selectedRecord?.designationId &&
                  deptDesignations.find((d) => d.id === selectedRecord.designationId)) ||
                null,
            }}
            onSubmit={async (values, helpers) => {
              await handleSubmit(values, helpers);
              setEditDialogOpen(false);
            }}
          >
            {({ isSubmitting, submitForm, values }) => (
              <Form>
                <InputItem>
                  <TextInput
                    name="departmentName"
                    label="Department"
                    disabled
                  />
                </InputItem>
                <InputItem>
                  <SelectInput
                    name="designationId"
                    label="Designation"
                    options={deptDesignations}
                    getOptionLabel={(option) => option?.name || ""}
                    disabled={!values.departmentId || desigLoading}
                    loading={desigLoading}
                  />
                </InputItem>
                <InputItem>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: "flex-end" },
                      gap: 2,
                    }}
                  >
                    <Button
                      onClick={submitForm}
                      variant="contained"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </Box>
                </InputItem>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      {loading ? <CircularProgress /> : <CustomDataGrid rows={users} columns={columns} />}
    </Box>
  );
}