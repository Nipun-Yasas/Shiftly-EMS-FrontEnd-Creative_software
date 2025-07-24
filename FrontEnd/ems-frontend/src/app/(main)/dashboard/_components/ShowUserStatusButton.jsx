"use client";
import React, { useState } from "react";
import UserDataStatus from "./UserDataStatus";
import { Button } from "@mui/material";

const ShowUserDataStatusButton = () => {
  const [showStatus, setShowStatus] = useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setShowStatus(true)}>
        Show Data Status
      </Button>
      <UserDataStatus visible={showStatus} onClose={() => setShowStatus(false)} />
    </>
  );
};

export default ShowUserDataStatusButton;