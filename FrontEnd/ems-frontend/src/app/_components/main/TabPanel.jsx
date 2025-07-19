'use client';

import React from 'react';
import Box from '@mui/material/Box';

export default function TabPanel({ children, value, index, ...other }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </Box>
  );
}
