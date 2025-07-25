"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Paper, Box } from "@mui/material";
import AvailableLeaves from "./_components/AvailableLeaves";
import LeaveForm from "./_components/LeaveForm";
import SuccessSnackbar from "./_components/SuccessModal";
import { usePathname } from 'next/navigation';
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";

export default function RequestLeave() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const router = useRouter();
  const pathname = usePathname();

  // Define total allowed leaves per type
  const TOTAL_LEAVES = [
    { type: "Annual Leave", total: 10, hexColor: "#D81B60" },
    { type: "Casual Leave", total: 5, hexColor: "#2563EB" },
    { type: "Election Leave", total: 2, hexColor: "#EAB308" }
  ];

  // Mapping from backend leave type values to display names
  const LEAVE_TYPE_MAP = {
    "annual": "Annual Leave",
    "annual leave": "Annual Leave",
    "Annual": "Annual Leave",
    "Annual Leave": "Annual Leave",
    "casual": "Casual Leave",
    "election": "Election Leave",
    "sick": "Sick Leave",
    // add more as needed
  };

  const TOTAL_ANNUAL_LEAVES = 10;
  const TOTAL_CASUAL_LEAVES = 5;
  const TOTAL_VACATION_LEAVES = 7;

  const fetchAndCalculate = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.LEAVES.GET_MY_LEAVES);
      const history = res.data || [];

      // Annual Leave: sum all durations
      let usedAnnual = 0;
      // Casual Leave: sum only casual
      let usedCasual = 0;
      // Vacation Leave: sum only vacation
      let usedVacation = 0;

      history.forEach(l => {
        const duration = Number(l.duration) || 1;
        usedAnnual += duration;
        if (l.leaveType?.toLowerCase() === "casual") usedCasual += duration;
        if (l.leaveType?.toLowerCase() === "vacation") usedVacation += duration;
      });

      setLeaves([
        {
          type: "Annual Leave",
          count: Math.max(0, TOTAL_ANNUAL_LEAVES - usedAnnual),
          hexColor: "#D81B60"
        },
        {
          type: "Casual Leave",
          count: Math.max(0, TOTAL_CASUAL_LEAVES - usedCasual),
          hexColor: "#2563EB"
        },
        {
          type: "Vacation Leave",
          count: Math.max(0, TOTAL_VACATION_LEAVES - usedVacation),
          hexColor: "#00BFAE"
        }
      ]);
    } catch (e) {
      setLeaves([
        { type: "Annual Leave", count: TOTAL_ANNUAL_LEAVES, hexColor: "#D81B60" },
        { type: "Casual Leave", count: TOTAL_CASUAL_LEAVES, hexColor: "#2563EB" },
        { type: "Vacation Leave", count: TOTAL_VACATION_LEAVES, hexColor: "#00BFAE" }
      ]);
    }
  };

  useEffect(() => {
    fetchAndCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Handler for after leave submission
  const handleSubmitSuccess = async () => {
    await fetchAndCalculate(); // Refetch and update leaves immediately
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      router.push('/leave/history');
    }, 1500);
  };

  return (
    <Box>
      <Paper
        elevation={3}
        square={false}
        sx={{
          width: "100%",
          p: { xs: 2, sm: 4 },
          mb: 2,
        }}
      >
        <AvailableLeaves leaves={leaves} />
        <Box sx={{ width: "100%", px: { xs: 0, sm: 3 }, py: 3 }}>
          <LeaveForm onSubmitSuccess={handleSubmitSuccess} />
        </Box>
      </Paper>
      <SuccessSnackbar isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </Box>
  );
}
