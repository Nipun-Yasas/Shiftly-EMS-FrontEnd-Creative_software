"use client";

import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export default function Loading() {
  return (
      <Box
        sx={{
          width: "100%",
          height:'100%',
          display: "flex",
          justifyContent: "center",
          alignItem:'center',
          gap: { xs: 2, sm: 3 },
        }}
      >
          <Skeleton
            variant="rectangular"
            sx={{
              width: { xs: "100%", sm: "100%" },
              maxWidth: "100%",
            }}
          />
      </Box>
  );
}
