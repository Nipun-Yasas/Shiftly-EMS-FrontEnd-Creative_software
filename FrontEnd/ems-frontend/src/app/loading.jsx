"use client";

import * as React from "react";
import Skeleton from "@mui/material/Skeleton";

import Box from "@mui/material/Box";

export default function Loading() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        m:5,
        p:5
      }}
    >
      <Skeleton
        variant="rectangular"
        width={400}
        height={400}
      />
    </Box>
  );
}
