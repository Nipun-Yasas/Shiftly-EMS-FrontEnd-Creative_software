import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import * as Yup from "yup";
import { useFormikContext } from "formik";

import TextInput from "../../../../_components/inputs/TextInput";
import SelectInput from "../../../../_components/inputs/SelectInput";
import InputItem from "../../../../_components/inputs/InputItem";
import DateInput from "../../../../_components/inputs/DateInput";

export const projectValidationSchema = Yup.object({
  projectName: Yup.string()
    .min(3, "Project name must be at least 3 characters")
    .required("Project name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  department: Yup.object().nullable().required("Department is required"),
  teamName: Yup.object().nullable().required("Team is required"),
  startDate: Yup.date()
    .nullable()
    .typeError("Please enter a valid start date")
    .required("Start date is required"),
  deadline: Yup.date()
    .nullable()
    .typeError("Please enter a valid deadline")
    .required("Deadline is required")
    .when("startDate", {
      is: (startDate) => startDate && startDate instanceof Date && !isNaN(startDate),
      then: (schema) => schema.min(Yup.ref("startDate"), "Deadline must be after start date"),
      otherwise: (schema) => schema
    }),
  progress: Yup.number()
    .min(0, "Progress must be at least 0%")
    .max(100, "Progress cannot exceed 100%")
    .required("Progress is required"),
});

export default function ProjectForm({
  isSubmitting = false,
  isEdit = false,
  onCancel = null,
  showResetButton = false,
  resetForm = null,
  departments = [],
  teams = [],
  loadingDepartments = false,
  loadingTeams = false,
  onDepartmentChange = null,
  setFieldValue = null,
}) {
  // Get Formik context for real-time validation
  const {
    values,
    errors,
    touched,
    setFieldValue: formikSetFieldValue,
    setFieldTouched,
    validateField,
  } = useFormikContext();

  // Real-time validation helper
  const handleFieldChange = async (fieldName, value) => {
    // Set the field value
    formikSetFieldValue(fieldName, value);
    // Mark field as touched
    setFieldTouched(fieldName, true);
    // Trigger validation for this specific field
    setTimeout(() => {
      validateField(fieldName);
    }, 100);
  };

  // Handle department selection change with validation
  const handleDepartmentSelect = async (selectedDepartment) => {
    // Handle the change with real-time validation
    await handleFieldChange("department", selectedDepartment);

    if (selectedDepartment && onDepartmentChange) {
      // Clear team selection when department changes
      await handleFieldChange("teamName", null);
      // Notify parent component about department change
      onDepartmentChange(selectedDepartment.id);
    }
  };

  // Handle team selection change with validation
  const handleTeamSelect = async (selectedTeam) => {
    await handleFieldChange("teamName", selectedTeam);
  };

  // Handle text input changes with validation
  const handleTextInputChange = async (fieldName, value) => {
    await handleFieldChange(fieldName, value);
  };

  // Handle progress input with additional validation
  const handleProgressChange = async (value) => {
    // Ensure value is within bounds
    let numValue = parseFloat(value);
    if (isNaN(numValue)) numValue = 0;
    if (numValue < 0) numValue = 0;
    if (numValue > 100) numValue = 100;

    await handleFieldChange("progress", numValue);
  };

  return (
    <Stack>
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
            name="projectName"
            label="Project Name"
            disabled={isSubmitting}
            onChange={(e) =>
              handleTextInputChange("projectName", e.target.value)
            }
            error={touched.projectName && errors.projectName}
            helperText={touched.projectName && errors.projectName}
          />
        </InputItem>

        <InputItem>
          <SelectInput
            name="department"
            label={
              loadingDepartments ? "Loading Departments..." : "Department"
            }
            options={departments}
            getOptionLabel={(option) => option.label}
            disabled={loadingDepartments || isSubmitting}
            onChange={(value) => handleDepartmentSelect(value)}
            error={touched.department && errors.department}
            helperText={touched.department && errors.department}
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
            name="teamName"
            label={loadingTeams ? "Loading Teams..." : "Team Name"}
            options={teams}
            getOptionLabel={(option) => option.label}
            disabled={loadingTeams || isSubmitting}
            onChange={(value) => handleTeamSelect(value)}
            error={touched.teamName && errors.teamName}
            helperText={touched.teamName && errors.teamName}
          />
        </InputItem>

        <InputItem>
          <TextInput
            name="progress"
            label="Progress (%)"
            type="number"
            disabled={isSubmitting}
            onChange={(e) => handleProgressChange(e.target.value)}
            error={touched.progress && errors.progress}
            helperText={touched.progress && errors.progress}
            inputProps={{ min: 0, max: 100, step: 1 }}
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
            name="description"
            label="Description"
            multiline
            rows={3}
            disabled={isSubmitting}
            onChange={(e) =>
              handleTextInputChange("description", e.target.value)
            }
            error={touched.description && errors.description}
            helperText={touched.description && errors.description}
          />
        </InputItem>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 0, sm: 2 },
          m: 2,
        }}
      >
        <InputItem>
          <DateInput
            name="startDate"
            label="Start Date"
            disabled={isSubmitting}
          />
        </InputItem>

        <InputItem>
          <DateInput
            name="deadline"
            label="Deadline"
            disabled={isSubmitting}
          />
        </InputItem>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "flex-end" },
          gap: 2,
          mt: { xs: 0, sm: 2 },
          width: "100%",
        }}
      >
        {onCancel && (
          <Button
            type="button"
            color="text.primary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}

        {showResetButton && resetForm && (
          <Button
            type="button"
            color="text.primary"
            onClick={() => resetForm()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || loadingDepartments || loadingTeams}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting
            ? isEdit
              ? "Updating..."
              : "Adding..."
            : isEdit
            ? "Update Project"
            : "Add Project"}
        </Button>
      </Box>
    </Stack>
  );
}
