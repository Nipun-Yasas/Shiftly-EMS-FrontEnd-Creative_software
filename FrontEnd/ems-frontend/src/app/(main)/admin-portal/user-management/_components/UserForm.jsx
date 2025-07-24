"use client";

import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";
import { useFormikContext } from "formik";

import SelectInput from "../../../../_components/inputs/SelectInput";
import TextInput from "../../../../_components/inputs/TextInput";
import InputItem from "../../../../_components/inputs/InputItem";
import { useDepartments } from "../../../../_hooks/useDepartments";
import { UserContext } from "../../../../context/UserContext";
import axiosInstance from "../../../../_utils/axiosInstance";
import { API_PATHS } from "../../../../_utils/apiPaths";

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
  const { departments, loading: loadingDepartments } = useDepartments();
  const { user } = useContext(UserContext);
  const { values, setFieldValue } = useFormikContext();
  const [fetchingAdminProfile, setFetchingAdminProfile] = React.useState(false);
  const [fetchingDepartmentAdmin, setFetchingDepartmentAdmin] = React.useState(false);
  const [adminProfileCache, setAdminProfileCache] = React.useState(null);
  const [departmentAdminCache, setDepartmentAdminCache] = React.useState({});

  // Component to handle role-based auto-fill
  const RoleBasedAutoFill = () => {
    // Auto-fill reporting fields when admin or user role is selected
    React.useEffect(() => {
      const fetchReportingDetails = async () => {
        if (values.roleId && user) {
          // Only auto-fill if fields are empty to avoid overwriting manual entries
          if (!values.reportingPerson && !values.reportingPersonEmail) {
            
            if (values.roleId.name === "ADMIN") {
              // For ADMIN role: Use superadmin's employee profile details
              try {
                setFetchingAdminProfile(true);
                
                // Check cache first to avoid unnecessary API calls
                let employeeData = adminProfileCache;
                
                if (!employeeData) {
                  // Fetch current admin's employee profile to get firstName and lastName
                  const response = await axiosInstance.get(API_PATHS.EMPLOYEE.GET_PROFILE);
                  employeeData = response.data;
                  setAdminProfileCache(employeeData); // Cache the result
                }
                
                if (employeeData) {
                  // Use firstName + lastName from employee profile
                  const reportingPersonName = employeeData.firstName && employeeData.lastName 
                    ? `${employeeData.firstName} ${employeeData.lastName}`
                    : user.username || "Admin User";
                  
                  // Set reporting person from employee profile and email from user context
                  setFieldValue("reportingPerson", reportingPersonName);
                  setFieldValue("reportingPersonEmail", user.email || "");
                } else {
                  // Fallback to user context if no employee profile found
                  const reportingPersonName = user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.username || "Admin User";
                  
                  setFieldValue("reportingPerson", reportingPersonName);
                  setFieldValue("reportingPersonEmail", user.email || "");
                }
              } catch (error) {
                // If employee profile fetch fails, fallback to user context
                console.log("Could not fetch admin employee profile, using user context as fallback");
                const reportingPersonName = user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.username || "Admin User";
                
                setFieldValue("reportingPerson", reportingPersonName);
                setFieldValue("reportingPersonEmail", user.email || "");
              } finally {
                setFetchingAdminProfile(false);
              }
            }
            
            else if (values.roleId.name === "USER" && values.department) {
              // For USER role: Use department admin details
              try {
                setFetchingDepartmentAdmin(true);
                
                const departmentName = values.department.name || values.department.label;
                
                // Check cache first
                let departmentAdmins = departmentAdminCache[departmentName];
                
                if (!departmentAdmins) {
                  // Fetch department admins
                  const response = await axiosInstance.get(
                    API_PATHS.EMPLOYEE.GET_ADMINS_BY_DEPARTMENT(departmentName)
                  );
                  departmentAdmins = response.data;
                  
                  // Cache the result
                  setDepartmentAdminCache(prev => ({
                    ...prev,
                    [departmentName]: departmentAdmins
                  }));
                }
                
                if (departmentAdmins && (departmentAdmins.firstName || departmentAdmins.lastName || departmentAdmins.email)) {
                  // Backend now sends a single object with firstName, lastName, and email
                  const reportingPersonName = departmentAdmins.firstName && departmentAdmins.lastName 
                    ? `${departmentAdmins.firstName} ${departmentAdmins.lastName}`
                    : departmentAdmins.firstName || departmentAdmins.lastName || "Department Admin";
                  
                  // Only auto-fill if fields are empty
                  if (!values.reportingPerson) {
                    setFieldValue("reportingPerson", reportingPersonName);
                  }
                  if (!values.reportingPersonEmail) {
                    setFieldValue("reportingPersonEmail", departmentAdmins.email || "");
                  }
                } else {
                  console.warn(`No admin found for department: ${departmentName}`);
                  
                  // Cache empty result to avoid repeated requests
                  setDepartmentAdminCache(prev => ({
                    ...prev,
                    [departmentName]: null
                  }));
                }
              } catch (error) {
                console.log("Could not fetch department admin details:", error);
                // Don't set fallback values for USER role if department admin fetch fails
              } finally {
                setFetchingDepartmentAdmin(false);
              }
            }
          }
        }
        // Clear fields if role is changed to something that doesn't auto-fill
        else if (values.roleId && !["ADMIN", "USER"].includes(values.roleId.name)) {
          // Only clear if they were auto-filled (check if they contain known emails)
          if (values.reportingPersonEmail === user?.email || values.reportingPersonEmail) {
            setFieldValue("reportingPerson", "");
            setFieldValue("reportingPersonEmail", "");
          }
        }
      };

      fetchReportingDetails();
    }, [values.roleId, values.department]);

    return null; // This component doesn't render anything
  };

  return (
    <Stack spacing={2}>
      <RoleBasedAutoFill />
      
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
          helperText={
            fetchingAdminProfile 
              ? "Fetching admin profile..." 
              : fetchingDepartmentAdmin
                ? "Fetching department admin..."
                : (values.roleId && values.roleId.name === "ADMIN" 
                    ? "Auto-filled from admin employee profile" 
                    : values.roleId && values.roleId.name === "USER"
                      ? (values.department && departmentAdminCache[values.department.name || values.department.label] === null
                          ? "⚠️ No department admin found - please fill manually"
                          : "Auto-filled from department admin")
                      : "")
          }
          disabled={fetchingAdminProfile || fetchingDepartmentAdmin}
        />
      </InputItem>

      <InputItem>
        <TextInput
          name="reportingPersonEmail"
          label="Reporting Email"
          type="email"
          placeholder="Enter reporting person's email"
          helperText={
            values.roleId && values.roleId.name === "ADMIN" 
              ? "Auto-filled from admin user account" 
              : values.roleId && values.roleId.name === "USER"
                ? (values.department && departmentAdminCache[values.department.name || values.department.label] === null
                    ? "⚠️ No department admin found - please fill manually"
                    : "Auto-filled from department admin")
                : ""
          }
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
