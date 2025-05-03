"use client";

import { useState } from "react";

import { Paper } from "@mui/material";

import ReferForm from "./components/ReferForm";
import SubmitDialog from "./components/SubmitDialog";

export default function Refer(){
  const [openSubmit, setOpenSubmit] = useState(false);

  return (
    <>
      <Paper elevation={10}
      sx={{
        height: '100%',
        width: '100%',
      }}>
        <div className="flex justify-center">
          <div className="w-5/6 items-center  rounded-lg bg-white mt-5 p-5">
            <ReferForm setOpenSubmit={setOpenSubmit} />
          </div>
        </div>
      </Paper>

      <SubmitDialog openSubmit={openSubmit} setopenSubmit={setOpenSubmit} />
    </>
  );
}
