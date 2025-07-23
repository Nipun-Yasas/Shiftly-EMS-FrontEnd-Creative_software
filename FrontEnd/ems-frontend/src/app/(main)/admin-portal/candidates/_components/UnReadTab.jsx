import React from "react";
import { Box } from "@mui/material";

import ReferDataGrid from "./ReferDataGrid";

export default function UnReadTab({
  candidates,
  loading,
  onViewDetails,
  onMarkAsRead,
  onMarkAsUnread,
  onDownloadFile, // Make sure this prop is included
}) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <ReferDataGrid
        rows={candidates}
        loading={loading}
        onViewDetails={onViewDetails}
        onMarkAsRead={onMarkAsRead}
        onMarkAsUnread={onMarkAsUnread}
        onDownloadFile={onDownloadFile} // Pass it to ReferDataGrid
      />
    </Box>
  );
}
