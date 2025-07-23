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
  departments = [],
  teams = [],
  loadingDepartments = false,
  loadingTeams = false,
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
        <TextInput
          name="projectName"
          label="Project Name"
          disabled={isSubmitting} />
      </InputItem>

      <InputItem>
        <SelectInput
          name="department"
          label={loadingDepartments ? "Loading Departments..." : "Department"}
          options={departments}
          getOptionLabel={(option) => option.label}
          disabled={loadingDepartments || isSubmitting} />
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
            disabled={loadingTeams || isSubmitting} />
        </InputItem>

        <InputItem>
          <TextInput
            name="progress"
            label="Progress (%)"
            type="number"
            inputProps={{ min: 0, max: 100 }}
            disabled={isSubmitting} />
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
            disabled={isSubmitting} />
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
        <DateInput
          name="startDate"
          label="Start Date"
          disabled={isSubmitting} />

        <DateInput name="deadline" label="Deadline" disabled={isSubmitting} />
      </Box><Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "flex-end" },
          gap: 2,
          mt: { xs: 0, sm: 2 },
          width: "100%",
        }}
      >
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

        
      </Box>
    </Stack>
  ); 
}
