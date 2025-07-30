"use client";

import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export default function Loading() {
  return (
    <Stack
      sx={{
        bgcolor: "white",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "100%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: { xs: 0, sm: 1 },
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              width: { xs: "100%", sm: "100%" },
              height: { xs: 500, sm: 600 },
              maxWidth: "100%",
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
}
