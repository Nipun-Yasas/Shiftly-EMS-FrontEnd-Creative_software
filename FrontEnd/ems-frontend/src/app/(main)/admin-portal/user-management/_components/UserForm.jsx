"use client";

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";

import TextInput from "../../../../_components/inputs/TextInput";
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

const reportingPersons = [
  { id: 1, name: "Jane Smith", label: "Jane Smith" },
  { id: 2, name: "John Doe", label: "John Doe" },
  { id: 3, name: "Sarah Connor", label: "Sarah Connor" },
  { id: 4, name: "John Smith", label: "John Smith - IT Manager" },
  { id: 5, name: "Mike Davis", label: "Mike Davis - Finance Manager" },
  { id: 6, name: "Lisa Brown", label: "Lisa Brown - Marketing Manager" },
  { id: 7, name: "Tom Wilson", label: "Tom Wilson - Sales Manager" },
  { id: 8, name: "Emma Taylor", label: "Emma Taylor - Operations Manager" },
];

// Validation schemas
export const editValidationSchema = Yup.object({
  roleId: Yup.object().required("Role is required"),
  department: Yup.object().required("Department is required"),
  designation: Yup.object().required("Designation is required"),
  reporting_person: Yup.object().required("Reporting person is required"),
});

export const assignValidationSchema = Yup.object({
  employeeNumber: Yup.string()
    .min(3, "Employee Number must be at least 3 characters")
    .required("Employee Number is required"),
  roleId: Yup.object().required("Role is required"),
  department: Yup.object().required("Department is required"),
  designation: Yup.object().required("Designation is required"),
  reporting_person: Yup.object().required("Reporting person is required"),
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
      reporting_person:
        reportingPersons.find(
          (r) =>
            r.name === editingUser.reporting_person ||
            r.label === editingUser.reporting_person
        ) || null,
    };
  }
  return {
    roleId: null,
    department: null,
    designation: null,
    reporting_person: null,
  };
};

export const getAssignInitialValues = () => {
  return {
    employeeNumber: "",
    roleId: null,
    department: null,
    designation: null,
    reporting_person: null,
  };
};

export default function UserForm({
  showEmployeeNumber = false,
  isSubmitting = false,
  isEdit = false,
  onCancel = null,
  submitForm = null,
}) {
  return (
    <Stack spacing={2}>
      {showEmployeeNumber && (
        <InputItem>
          <TextInput
            name="employeeNumber"
            label="Employee Number"
            placeholder="Enter employee number"
          />
        </InputItem>
      )}

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

      <InputItem>
        <SelectInput
          name="reporting_person"
          label="Reporting Person"
          options={reportingPersons}
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

        {onCancel && (
          <Button color="text.primary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </Box>
    </Stack>
  );
}
