import React from "react";
import { Box } from "@mui/material";

import ReferDataGrid from "./ReferDataGrid";

export default function ReadTab({
  candidates,
  loading,
  onViewDetails,
  onMarkAsRead,
  onMarkAsUnread,
}) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <ReferDataGrid
        rows={candidates}
        loading={loading}
        onViewDetails={onViewDetails}
        onMarkAsRead={onMarkAsRead}
        onMarkAsUnread={onMarkAsUnread}
      />
    </Box>
  );
}
