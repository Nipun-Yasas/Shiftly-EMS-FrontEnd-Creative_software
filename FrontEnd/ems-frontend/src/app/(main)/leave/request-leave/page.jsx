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
  <Box>

      <Paper
        elevation={3}
        square={false}
        sx={{
          justifyItems: "center",
          alignContent: "center",
          width: "100%",
          marginBottom: 2,
        }}
      >
        <AvailableLeaves leaves={mockLeaves} />
      </Paper>

       <Paper
        elevation={3}
        square={false}
        sx={{
          justifyItems: "center",
          alignContent: "center",
          width: "100%"
        }}
      >
        <Box sx={{ width: "100%", px: 5 ,py: 5}}>
        <LeaveForm onSubmitSuccess={() => setModalOpen(true)} />
          </Box>
     
      <SuccessModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </Paper>


    </Box>
  );
}
