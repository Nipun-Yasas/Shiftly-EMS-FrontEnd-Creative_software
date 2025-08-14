import React from "react";
import { Box } from "@mui/material";

import ReferDataGrid from "./ReferDataGrid";

export default function ReadTab({ candidates, loading }) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <ReferDataGrid candidates={candidates} loading={loading} />
    </Box>
  );
}
