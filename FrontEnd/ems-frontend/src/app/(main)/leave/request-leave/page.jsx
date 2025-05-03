"use client";

import { useState } from "react";

import { Paper } from "@mui/material";

import AvailableLeaves from "./_components/AvailableLeaves";
import LeaveForm from "./_components/LeaveForm";
import SuccessModal from "./_components/SuccessModal";

export default function RequestLeave() {
  const [modalOpen, setModalOpen] = useState(false);

  const mockLeaves = [
    { type: "Annual Leave", count: 6, color: "bg-pink-600" },
    { type: "Casual Leave", count: 0, color: "bg-blue-600" },
    { type: "Election Leave", count: 1, color: "bg-yellow-500" },
  ];

  return (
    <Paper elevation={10}
      sx={{
        height: '100%',
        width: '100%',
      }}>
        <AvailableLeaves leaves={mockLeaves} />
     
        <LeaveForm onSubmitSuccess={() => setModalOpen(true)} />
      
      <SuccessModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </Paper>
  );
}
