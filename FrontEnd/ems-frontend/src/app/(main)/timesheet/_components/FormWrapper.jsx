"use client";

import Box from "@mui/material/Box";

import TimesheetForm from "./TimesheetForm";

export default function FormWrapper({ setOpenSubmit }) {

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <TimesheetForm
          mode="create"
          showTitle={true}
          showSummary={true}
          showActions={true}
        />
      </Box>

    </Box>
  );
}
