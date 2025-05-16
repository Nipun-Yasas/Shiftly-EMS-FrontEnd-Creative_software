"use client";

import { useState } from "react";
import { Paper,Box } from "@mui/material";
import AvailableLeaves from "./_components/AvailableLeaves";
import LeaveForm from "./_components/LeaveForm";
import SuccessModal from "./_components/SuccessModal";

export default function RequestLeave() {
  const [modalOpen, setModalOpen] = useState(false);

  const mockLeaves = [
    { type: "Annual Leave", count: 6, hexColor: "#D81B60" }, 
    { type: "Casual Leave", count: 0, hexColor: "#2563EB" },  
    { type: "Election Leave", count: 1, hexColor: "#EAB308" } 
  ];

  return (
    <Paper
      elevation={10}
      sx={{
        height: "100%",
        width: "100%",
        p: 3,
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box display="flex" flexDirection="column" gap={4}>
      <AvailableLeaves leaves={mockLeaves} />
      <LeaveForm onSubmitSuccess={() => setModalOpen(true)} />
      </Box>  
      <SuccessModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </Paper>
  );
}
