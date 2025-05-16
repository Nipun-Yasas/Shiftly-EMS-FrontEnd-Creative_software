'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material';
import { Box, Typography, Button } from '@mui/material';

const SuccessModal = ({ isOpen, onClose }) => {
  const theme = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Box
              className="rounded-xl shadow-xl max-w-md w-full p-6"
              sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Leave Request Submitted Successfully!
              </Typography>
              <Typography variant="body2" sx={{ mb: 4 }}>
                Your leave request has been submitted and is pending approval.
              </Typography>
              <Box className="flex justify-end">
                <Button
                  onClick={onClose}
                  variant="outlined"
                  sx={{
                    color: 'text.primary',
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
