"use client";

import { useState } from "react";

import { Paper } from "@mui/material";

import ClaimForm from "./components/ClaimForm";
import SubmitDialog from "./components/SubmitDialog";

export default function ClaimSubmission(){
  const [openSubmit, setOpenSubmit] = useState(false);

  return (
    <>
       <Paper elevation={10}
      sx={{
        height: '100%',
        width: '100%',
      }}>
        <div className="flex justify-center">
          <div className="w-5/6 items-center  rounded-lg  bg-white mt-5 p-5">
            <ClaimForm setOpenSubmit={setOpenSubmit} />
          </div>
        </div>
      </Paper>

      <SubmitDialog openSubmit={openSubmit} setopenSubmit={setOpenSubmit} />
    </>
  );
}
