"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";

import SelectInput from "../../../../_components/inputs/SelectInput";
import TextInput from "../../../../_components/inputs/TextInput";
import InputItem from "../../../../_components/inputs/InputItem";
import { useDepartments } from "../../../../_hooks/useDepartments";

const roles = [
  { id: 1, name: "ADMIN", label: "Admin" },
  { id: 2, name: "USER", label: "User" },
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
  department: Yup.object().required("Department is required"),
  designation: Yup.object().required("Designation is required"),
  reportingPerson: Yup.string()
    .min(2, "Reporting person name must be at least 2 characters")
    .max(100, "Reporting person name must be less than 100 characters")
    .required("Reporting person is required"),
  reportingPersonEmail: Yup.string()
    .email("Please enter a valid email address")
    .required("Reporting email is required"),
});

export const assignValidationSchema = Yup.object({
 roleId: Yup.object().required("Role is required"),
  department: Yup.object().required("Department is required"),
  designation: Yup.object().required("Designation is required"),
  reportingPerson: Yup.string()
    .min(2, "Reporting person name must be at least 2 characters")
    .max(100, "Reporting person name must be less than 100 characters")
    .required("Reporting person is required"),
  reportingPersonEmail: Yup.string()
    .email("Please enter a valid email address")
    .required("Reporting email is required"),
});

// Helper functions
export const getEditInitialValues = (editingUser, departments = []) => {
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
            d.label === editingUser.department ||
            d.id === editingUser.department?.id
        ) || null,
      designation:
        designations.find(
          (d) =>
            d.name === editingUser.designation ||
            d.label === editingUser.designation
        ) || null,
      reportingPerson: editingUser.reportingPerson || "",
      reportingPersonEmail: editingUser.reportingPersonEmail || "",
      
    };
  }
  return {
    roleId: null,
    department: null,
    designation: null,
    reportingPerson: "",
    reportingPersonEmail: "",
  };
};

export const getAssignInitialValues = () => {
  return {
    roleId: null,
    department: null,
    designation: null,
    reportingPerson: "",
    reportingPersonEmail: "",
  };
};

export default function UserForm({
  isSubmitting = false,
  isEdit = false,
  onCancel = null,
  submitForm = null,
}) {
  const { departments, loading: loadingDepartments, error } = useDepartments();

  // Debug logging
  console.log("UserForm - Departments:", departments);
  console.log("UserForm - Loading:", loadingDepartments);
  console.log("UserForm - Error:", error);

  return (
    <Stack spacing={2}>
      {!isEdit && (
        <InputItem>
          <SelectInput
            name="roleId"
            label="User Role"
            options={roles}
            getOptionLabel={(option) => option.label}
          />
        </InputItem>
      )}

      <InputItem>
        <SelectInput
          name="department"
          label={loadingDepartments ? "Loading Departments..." : "Department"}
          options={departments || []}
          getOptionLabel={(option) => option.label || option.name}
          disabled={loadingDepartments}
          placeholder={departments.length === 0 ? "No departments available" : "Select department"}
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
        <TextInput
          name="reportingPerson"
          label="Reporting Person"
          placeholder="Enter reporting person's name"
        />
      </InputItem>

      <InputItem>
        <TextInput
          name="reportingPersonEmail"
          label="Reporting Email"
          type="email"
          placeholder="Enter reporting person's email"
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
          <Button color="text.primary" variant="text" onClick={onCancel}>
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
