import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { UserContext } from "../../../../context/UserContext";

import ReadonlyTextInput from "./ReadonlyTextInput";

const PersonalInfoTab = ({ employeeData }) => {

  const { user } = useContext(UserContext);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 1, sm: 2, md: 3 },
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Personal Information Section */}
      <Box>
        <Stack spacing={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 0, sm: 2 },
            }}
          >
            <ReadonlyTextInput
              label="Full Name"
              value={
                employeeData?.firstName && employeeData?.lastName
                  ? `${employeeData.firstName} ${employeeData.lastName}`
                  : employeeData?.username || ""
              }
            />
            <ReadonlyTextInput
              label="Email"
              value={user?.email || employeeData?.user?.email || ""}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 0, sm: 2 },
            }}
          >
            <ReadonlyTextInput
              label="Department"
              value={user?.department || employeeData?.department?.name || ""}
            />
            <ReadonlyTextInput
              label="Designation"
              value={user?.designation || employeeData?.designation || ""}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 0, sm: 2 },
            }}
          >
            <ReadonlyTextInput label="Gender" value={employeeData?.gender || ""} />
            <ReadonlyTextInput
              label="Date of Birth"
              value={formatDate(employeeData?.dob)}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 0, sm: 2 },
            }}
          >
            <ReadonlyTextInput
              label="Location"
              value={employeeData?.location || ""}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default PersonalInfoTab;
