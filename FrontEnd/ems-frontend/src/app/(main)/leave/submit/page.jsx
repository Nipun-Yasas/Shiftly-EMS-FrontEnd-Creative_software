"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Paper, Box } from "@mui/material";
import AvailableLeaves from "./_components/AvailableLeaves";
import LeaveForm from "./_components/LeaveForm";
import SuccessModal from "./_components/SuccessModal";
import { usePathname } from 'next/navigation';
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";

export default function RequestLeave() {
  const [modalOpen, setModalOpen] = useState(false);
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

  // Fetch leave history and calculate remaining leaves
  const fetchAndCalculate = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.LEAVES.GET_MY_LEAVES);
      const history = res.data || [];
      // Count used leaves by type (using mapped display name)
      const used = {};
      history.forEach(l => {
        // Map backend type to display name
        const rawType = l.leaveType?.toLowerCase();
        const type = LEAVE_TYPE_MAP[rawType] || l.leaveType;
        const duration = Number(l.duration) || 1;
        used[type] = (used[type] || 0) + duration;
      });
      // Calculate remaining
      const calculated = TOTAL_LEAVES.map(t => ({
        type: t.type,
        count: Math.max(0, t.total - (used[t.type] || 0)),
        hexColor: t.hexColor
      }));
      setLeaves(calculated);
    } catch (e) {
      setLeaves(TOTAL_LEAVES.map(t => ({ type: t.type, count: t.total, hexColor: t.hexColor })));
    }
  };

  useEffect(() => {
    fetchAndCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Handler for after leave submission
  const handleSubmitSuccess = async () => {
    await fetchAndCalculate(); // Refetch and update leaves immediately
    setModalOpen(true);
    setTimeout(() => {
      setModalOpen(false);
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
      <SuccessModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
}
