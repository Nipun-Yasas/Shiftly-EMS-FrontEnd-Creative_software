"use client";

import { useState } from "react";
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
    <div className="px-6 py-4 space-y-6 bg-gray-200 min-h-screen">
      
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h1 className="text-2xl font-bold text-[#E80A4D] mb-1">Request Leave</h1>
        <div className="text-sm text-gray-400">Leave &gt; Request Leave</div>
      </div>

        <AvailableLeaves leaves={mockLeaves} />
     
        <LeaveForm onSubmitSuccess={() => setModalOpen(true)} />
      
      <SuccessModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
