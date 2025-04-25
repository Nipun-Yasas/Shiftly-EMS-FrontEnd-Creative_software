'use client';

import { motion, AnimatePresence } from 'framer-motion';

const SuccessModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Leave Request Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your leave request has been submitted and is pending approval.
            </p>
            <div className="flex justify-end">
            <button
  onClick={onClose}
  className="text-black px-4 py-2 font-bold rounded hover:bg-gray-100 transition"
>
  Close
</button>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
