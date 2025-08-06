"use client";

import { useRouter } from "next/navigation";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import ClaimForm from "../_components/ClaimForm";

export default function ClaimSubmission() {
  const router = useRouter();

  const handleViewHistory = () => {
    router.push('/claim/history');
  };

  return (
    <Paper
      elevation={3}
      square={false}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        p: 2,
        borderBottom: 1,
        borderColor: "divider",
      }}>
        <Box sx={{ fontSize: "1.25rem", fontWeight: "medium" }}>
          Submit New Claim
        </Box>
        <Button 
          variant="outlined" 
          onClick={handleViewHistory}
          size="small"
        >
          View History
        </Button>
      </Box>
      <Box sx={{ width: "100%", p: 5 }}>
        <ClaimForm redirectToHistory={true} />
      </Box>
    </Paper>
  );
}
