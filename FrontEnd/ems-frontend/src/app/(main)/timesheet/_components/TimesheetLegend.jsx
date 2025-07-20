"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";

export default function TimesheetLegend() {
  const legendItems = [
    { color: "default", text: "Regular Day", value: "8.00", description: "Standard workday" },
    { color: "success", text: "Weekend", value: "8.00", description: "Saturday/Sunday" },
    { color: "error", text: "Leave Day", value: "0.00", description: "Blocked for leave" },
    { color: "primary", text: "Overtime", value: ">8.00", description: "Hours over 8 per day" },
  ];
  
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 2 }}>
          Legend
        </Typography>
        
        {legendItems.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={item.value}
              color={item.color}
              variant={item.color === "default" ? "outlined" : "filled"}
              size="small"
              sx={{ 
                width: 50, 
                height: 28,
                fontWeight: 'bold'
              }}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                {item.text}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {item.description}
              </Typography>
            </Box>
          </Box>
        ))}

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            • Hours: 4-15 per day
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            • Overtime: &gt;8 hours
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
} 