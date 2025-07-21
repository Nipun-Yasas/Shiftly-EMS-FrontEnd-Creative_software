import React from "react";
import Box from "@mui/material/Box";

import ReferDataGrid from "./ReferDataGrid";

export default function AllTab({
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
