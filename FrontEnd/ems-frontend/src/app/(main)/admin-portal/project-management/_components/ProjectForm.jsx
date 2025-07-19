import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import * as Yup from "yup";

import TextInput from "../../../../_components/inputs/TextInput";
import SelectInput from "../../../../_components/inputs/SelectInput";
import InputItem from "../../../../_components/inputs/InputItem";
import DateInput from "../../../../_components/inputs/DateInput";

import AddIcon from "@mui/icons-material/Add";

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

const teams = [
  { id: 1, name: "Alpha Team", label: "Alpha Team" },
  { id: 2, name: "Beta Team", label: "Beta Team" },
  { id: 3, name: "Gamma Team", label: "Gamma Team" },
  { id: 4, name: "Delta Team", label: "Delta Team" },
  { id: 5, name: "Epsilon Team", label: "Epsilon Team" },
  { id: 6, name: "Zeta Team", label: "Zeta Team" },
  { id: 7, name: "Theta Team", label: "Theta Team" },
  { id: 8, name: "Sigma Team", label: "Sigma Team" },
];

export const projectValidationSchema = Yup.object({
  projectName: Yup.string()
    .min(3, "Project name must be at least 3 characters")
    .required("Project name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  department: Yup.object().required("Department is required"),
  teamName: Yup.object().required("Team name is required"),
  startDate: Yup.date().required("Start date is required"),
  deadline: Yup.date()
    .min(Yup.ref("startDate"), "Deadline must be after start date")
    .required("Deadline is required"),
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
}) {
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
          <TextInput name="projectName" label="Project Name" />
        </InputItem>

        <InputItem>
          <SelectInput
            name="department"
            label="Department"
            options={departments}
            getOptionLabel={(option) => option.label}
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
            label="Team Name"
            options={teams}
            getOptionLabel={(option) => option.label}
          />
        </InputItem>

        <InputItem>
          <TextInput
            name="progress"
            label="Progress (%)"
            type="number"
            inputProps={{ min: 0, max: 100 }}
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
        <DateInput name="startDate" label="Start Date" />

        <DateInput name="deadline" label="Deadline" />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "flex-end" },
          gap: 2,
          width: "100%",
        }}
      >
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting
            ? isEdit
              ? "Updating..."
              : "Adding..."
            : isEdit
              ? "Update Project"
              : "Add Project"}
        </Button>

        {showResetButton && resetForm && (
          <Button
            type="button"
            color="text.primary"
            onClick={() => resetForm()}
          >
            Reset
          </Button>
        )}

        {onCancel && (
          <Button type="button" color="text.primary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </Box>
    </Stack>
  );
}
