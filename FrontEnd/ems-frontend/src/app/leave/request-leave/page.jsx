'use client';

import AvailableLeaves from './components/AvailableLeaves';
import LeaveForm from './components/LeaveForm';
import SuccessModal from './components/SuccessModal';
import { useState } from 'react';

const RequestLeave = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const mockLeaves = [
    { type: 'Annual Leave', count: 6, color: 'bg-pink-600' },
    { type: 'Casual Leave', count: 0, color: 'bg-blue-600' },
    { type: 'Election Leave', count: 1, color: 'bg-yellow-500' },
  ];

  return (
    <div className="px-6 py-4 space-y-6">
      <h1 className="text-2xl font-bold text-[#E80A4D] mb-1">Request Leave</h1>
      <div className="text-sm text-gray-400 ">Leave &gt; Request leave</div>
      

      <AvailableLeaves leaves={mockLeaves} />

      <LeaveForm onSubmitSuccess={() => setModalOpen(true)} />

      <SuccessModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default RequestLeave;
