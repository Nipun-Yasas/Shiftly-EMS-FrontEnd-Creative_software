"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import { Form } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";

import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import InputItem from "../../../_components/inputs/InputItem";
import DateInput from "../../../_components/inputs/DateInput";
import ProfilePictureUpload from "../../../_components/inputs/ProfilePictureUpload";
import { useDepartments } from "../../../_hooks/useDepartments";
import { useTeams } from "../../../_hooks/useTeams";
import { UserContext } from "../../../context/UserContext";
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { employeeProfileCache } from "../../../_utils/employeeProfileCache";

const genderOptions = [
  { id: "Male", name: "Male", label: "Male" },
  { id: "Female", name: "Female", label: "Female" },
  { id: "Other", name: "Other", label: "Other" },
];


const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  gender: Yup.object().required("Gender is required"),
  dob: Yup.string().required("Date of birth is required"),
  location: Yup.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters")
    .required("Location is required"),
  team: Yup.object().nullable(), // Make team optional
  skills: Yup.string().max(1000, "Skills must be less than 1000 characters"),
  education: Yup.string().max(
    1000,
    "Education must be less than 1000 characters"
  ),
  experience: Yup.string().max(
    1000,
    "Experience must be less than 1000 characters"
  ),
  profilePicture: Yup.mixed(), // Allow profile picture to be optional
});

export default function EmployeeUpdatePage() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { departments, loading: loadingDepartments } = useDepartments();

  // Get user's department ID from context - try multiple possible paths
  const getUserDepartmentId = () => {
    if (!user) return null;

    // First try to get direct department ID
    const directId =
      user.departmentId ||
      user.department?.id ||
      user.department?.departmentId ||
      user.dept?.id ||
      user.deptId;

    if (directId) {
      return directId;
    }

    // If no direct ID, try to find department ID by name
    if (user.department && typeof user.department === "string") {
      // user.department is a string like "DIPS"
      const foundDept = departments.find(
        (dept) =>
          dept.name === user.department || dept.label === user.department
      );
      return foundDept?.id || foundDept?.departmentId || null;
    }

    return null;
  };

  const userDepartmentId = getUserDepartmentId();

  // Only fetch teams when departments are loaded (needed for department name lookup)
  const shouldFetchTeams = !loadingDepartments && departments.length > 0;
  const teamsDepartmentId = shouldFetchTeams ? userDepartmentId : null;

  // Fetch teams filtered by user's department
  const { teams, loading: loadingTeams } = useTeams(teamsDepartmentId);

  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track editing state

  useEffect(() => {
    fetchEmployeeProfile();
  }, []);

  const fetchEmployeeProfile = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      const response = await axiosInstance.get(API_PATHS.EMPLOYEE.GET_PROFILE);

      if (response.data) {
        setEmployeeData(response.data);
        setIsEditing(true);
      }
    } catch (error) {
      // Only log unexpected errors (not 404s for new users)
      if (error.response?.status !== 404) {
      }

      if (error.response && error.response.status === 404) {
        // This is expected for new users creating their first profile
        setIsEditing(false);
        setEmployeeData(null);
        // Don't set error state for expected 404 - this is normal for new users
      } else if (error.response && error.response.status === 401) {
        setError(
          "You are not authorized to access this profile. Please log in again."
        );
      } else if (error.response && error.response.status === 403) {
        setError("You don't have permission to access this profile.");
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Error loading profile data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitialValues = () => {
    if (employeeData) {
      return {
        firstName: employeeData.firstName || "",
        lastName: employeeData.lastName || "",
        gender:
          genderOptions.find((g) => g.name === employeeData.gender) || null,
        dob: employeeData.dob || "",
        location: employeeData.location || "",
        team:
          teams.find(
            (t) =>
              t.id === employeeData.teamId || t.name === employeeData.teamName
          ) || null,
        skills: Array.isArray(employeeData.skills)
          ? employeeData.skills.join("\n")
          : employeeData.skills || "",
        education: Array.isArray(employeeData.education)
          ? employeeData.education.join("\n")
          : employeeData.education || "",
        experience: Array.isArray(employeeData.experience)
          ? employeeData.experience.join("\n")
          : employeeData.experience || "",
        profilePicture: null, // This will be handled by ProfilePictureUpload component
      };
    }
    return {
      firstName: "",
      lastName: "",
      gender: null,
      dob: "",
      location: "",
      team: null,
      skills: "",
      education: "",
      experience: "",
      profilePicture: null,
    };
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      setSuccess(null);

      // Transform data to match backend expectations (arrays instead of strings)
      const employeePayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender?.name || values.gender,
        dob: values.dob,
        location: values.location,
        teamId: values.team?.id || null, // Send team ID
        teamName: values.team?.name || null, // Send team name for reference
        skills: values.skills
          ? values.skills.split("\n").filter((skill) => skill.trim() !== "")
          : [],
        education: values.education
          ? values.education.split("\n").filter((edu) => edu.trim() !== "")
          : [],
        experience: values.experience
          ? values.experience.split("\n").filter((exp) => exp.trim() !== "")
          : [],
      };

      let response;
      if (employeeData?.employeeId) {
        // Update existing profile
        response = await axiosInstance.put(
          API_PATHS.EMPLOYEE.UPDATE_PROFILE,
          employeePayload
        );
      } else {
        // Create new profile - use the correct endpoint
        response = await axiosInstance.put(
          API_PATHS.EMPLOYEE.UPDATE_PROFILE,
          employeePayload
        );
      }

      if (response.data) {
        setSuccess("Employee profile created successfully!");
        // Update the employee profile cache so the layout will allow navigation
        employeeProfileCache.setStatus(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Error updating employee profile. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    // If user has an existing profile, go back to profile page
    // If user is creating a new profile, they can't go back (they'll be blocked anyway)
    if (isEditing) {
      router.push("/employee/profile");
    } else {
      // For new users, don't allow going back as they need to complete their profile
      // Maybe redirect to dashboard or just stay on the same page
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{ width: "100%", height: "100%", borderRadius: 3 }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <PersonIcon
          sx={{ fontSize: 60, color: theme.palette.primary.main, my: 2 }}
        />
        <Typography variant="h4" sx={{ mb: 1, color: theme.palette.text }}>
          {employeeData ? "Update Employee Profile" : "Create Employee Profile"}
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text }}>
          {employeeData
            ? "Update your employee information below"
            : "Complete your employee profile to access all features"}
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Form */}
      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, submitForm }) => (
          <Box sx={{ width: "100%", px: 5 }}>
            <Form>
              <Stack spacing={3}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: theme.palette.primary.main }}
                >
                  Personal Information
                </Typography>

                {/* Profile Picture Upload */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <ProfilePictureUpload
                    name="profilePicture"
                    label="Profile Picture"
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 2 },
                  }}
                >
                  <InputItem>
                    <TextInput name="firstName" label="First Name" />
                  </InputItem>
                  <InputItem>
                    <TextInput
                      name="lastName"
                      label="Last Name"
                      disabled={isSubmitting}
                    />
                  </InputItem>
                  <InputItem>
                    <SelectInput
                      name="gender"
                      label="Gender"
                      options={genderOptions}
                      getOptionLabel={(option) => option.label}
                      disabled={isSubmitting}
                    />
                  </InputItem>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 2 },
                  }}
                >
                  <InputItem>
                    <SelectInput
                      name="team"
                      label="Team"
                      options={teams}
                      getOptionLabel={(option) => option.label}
                      disabled={isSubmitting || loadingTeams}
                      placeholder={
                        loadingTeams ? "Loading teams..." : "Select a team"
                      }
                    />
                  </InputItem>
                  <InputItem>
                    <DateInput
                      name="dob"
                      label="Date of Birth"
                      disabled={isSubmitting}
                      disablePast={false}
                    />
                  </InputItem>

                  <InputItem>
                    <TextInput
                      name="location"
                      label="Location"
                      disabled={isSubmitting}
                    />
                  </InputItem>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: theme.palette.primary.main }}
                >
                  Professional Information
                </Typography>

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
                      name="skills"
                      label="Skills"
                      multiline
                      rows={4}
                      placeholder="List your technical skills, programming languages, tools, etc. (one per line)"
                      disabled={isSubmitting}
                    />
                  </InputItem>

                  <InputItem>
                    <TextInput
                      name="education"
                      label="Education"
                      multiline
                      rows={4}
                      placeholder="Describe your educational background, degrees, certifications, etc. (one per line)"
                      disabled={isSubmitting}
                    />
                  </InputItem>
                </Box>
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
                      name="experience"
                      label="Experience"
                      multiline
                      rows={4}
                      placeholder="Describe your work experience, roles, responsibilities, etc. (one per line)"
                      disabled={isSubmitting}
                    />
                  </InputItem>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-end" },
                    pb: 2,
                    gap: 2,
                  }}
                >
                  <Button
                    variant="text"
                    color="text.primary"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    sx={{ px: 4 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={submitForm}
                    disabled={
                      isSubmitting || loadingDepartments || loadingTeams
                    }
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={20} />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    sx={{ px: 4 }}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : employeeData
                        ? "Update Profile"
                        : "Create Profile"}
                  </Button>
                </Box>
              </Stack>
            </Form>
          </Box>
        )}
      </Formik>
    </Paper>
  );
}
