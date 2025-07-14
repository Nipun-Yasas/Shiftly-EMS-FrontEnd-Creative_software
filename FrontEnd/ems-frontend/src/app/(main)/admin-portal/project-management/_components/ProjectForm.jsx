import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";

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
  client: Yup.string().required("Client is required"),
  projectManager: Yup.string().required("Project manager is required"),
  status: Yup.object().required("Status is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
  teamSize: Yup.number()
    .positive("Team size must be positive")
    .integer("Team size must be a whole number")
    .required("Team size is required"),
});

export default function ProjectForm({ projectStatuses, children }) {
  return (
    <Stack spacing={2}>
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
          <TextInput name="projectName" label="Project Name" />
        </InputItem>

        <InputItem>
          <TextInput name="client" label="Client" />
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
          <TextInput name="projectManager" label="Project Manager" />
        </InputItem>

        <InputItem>
          <TextInput name="teamSize" label="Team Size" type="number" />
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
          <TextInput
            name="description"
            label="Description"
            multiline
            rows={3}
          />
        </InputItem>
        <InputItem>
          <SelectInput
            name="status"
            label="Status"
            options={projectStatuses}
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
          m: 2,
          px: 2,
        }}
      >
        <DateInput name="startDate" label="Start Date" />
        <DateInput name="endDate" label="End Date" />
      </Box>

      {children}
    </Stack>
  );
}
