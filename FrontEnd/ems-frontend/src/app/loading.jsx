"use client";

import * as React from "react";
import Skeleton from "@mui/material/Skeleton";

import Box from "@mui/material/Box";

export default function Loading() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',   
      }}
    >
      <Skeleton
        
        variant="rectangular"
        width={500}
        height={500}
      />
    </Box>
  );
}
