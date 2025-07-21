"use client";

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";

import SelectInput from "../../../../_components/inputs/SelectInput";
import InputItem from "../../../../_components/inputs/InputItem";

const roles = [
  { id: 1, name: "Admin", label: "Administrator" },
  { id: 2, name: "Employee", label: "Employee" },
];

const departments = [
  { id: 1, name: "Engineering", label: "Engineering" },
  { id: 2, name: "Project Management", label: "Project Management" },
  { id: 3, name: "Human Resources", label: "Human Resources" },
  { id: 4, name: "IT", label: "Information Technology" },
  { id: 5, name: "Finance", label: "Finance" },
  { id: 6, name: "Marketing", label: "Marketing" },
  { id: 7, name: "Sales", label: "Sales" },
  { id: 8, name: "Operations", label: "Operations" },
];

const designations = [
  { id: 1, name: "Software Engineer", label: "Software Engineer" },
  { id: 2, name: "Project Manager", label: "Project Manager" },
  { id: 3, name: "HR Specialist", label: "HR Specialist" },
  { id: 4, name: "Manager", label: "Manager" },
  { id: 5, name: "Senior Developer", label: "Senior Developer" },
  { id: 6, name: "Developer", label: "Developer" },
  { id: 7, name: "Junior Developer", label: "Junior Developer" },
  { id: 8, name: "Team Lead", label: "Team Lead" },
  { id: 9, name: "Business Analyst", label: "Business Analyst" },
  { id: 10, name: "HR Executive", label: "HR Executive" },
  { id: 11, name: "Accountant", label: "Accountant" },
];


// Validation schemas
export const editValidationSchema = Yup.object({
  roleId: Yup.object().required("Role is required"),
  department: Yup.object().required("Department is required"),
  designation: Yup.object().required("Designation is required"),
});

export const assignValidationSchema = Yup.object({
 roleId: Yup.object().required("Role is required"),
  department: Yup.object().required("Department is required"),
  designation: Yup.object().required("Designation is required"),
});

// Helper functions
export const getEditInitialValues = (editingUser) => {
  if (editingUser) {
    return {
      roleId:
        roles.find(
          (r) =>
            r.name === editingUser.roleId?.name ||
            r.name === editingUser.roleId ||
            r.id === editingUser.roleId?.id
        ) || null,
      department:
        departments.find(
          (d) =>
            d.name === editingUser.department ||
            d.label === editingUser.department
        ) || null,
      designation:
        designations.find(
          (d) =>
            d.name === editingUser.designation ||
            d.label === editingUser.designation
        ) || null,
      
    };
  }
  return {
    roleId: null,
    department: null,
    designation: null,
  };
};

export const getAssignInitialValues = () => {
  return {
    roleId: null,
    department: null,
    designation: null,
  };
};

export default function UserForm({
  isSubmitting = false,
  isEdit = false,
  onCancel = null,
  submitForm = null,
}) {
  return (
    <Stack spacing={2}>
      <InputItem>
        <SelectInput
          name="roleId"
          label="User Role"
          options={roles}
          getOptionLabel={(option) => option.label}
        />
      </InputItem>

      <InputItem>
        <SelectInput
          name="department"
          label="Department"
          options={departments}
          getOptionLabel={(option) => option.label}
        />
      </InputItem>

      <InputItem>
        <SelectInput
          name="designation"
          label="Designation"
          options={designations}
          getOptionLabel={(option) => option.label}
        />
      </InputItem>

      

      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "flex-end" },
          gap: 2,
          width: "100%",
          pt: 2,
        }}
      >
        

        {onCancel && (
          <Button color="text.primary" onClick={onCancel}>
            Cancel
          </Button>
        )}

        <Button
          onClick={submitForm}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting
            ? isEdit
              ? "Updating..."
              : "Verifying..."
            : isEdit
              ? "Update User"
              : "Verify User"}
        </Button>
      </Box>
    </Stack>
  );
}
