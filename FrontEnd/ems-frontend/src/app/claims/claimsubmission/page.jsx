"use client";

import React from "react";
import { useState } from "react";

import ClaimForm from "./_components/ClaimForm";
import SubmitDialog from "./_components/SubmitDialog";

export default function ClaimSubmission(){
  const [openSubmit, setOpenSubmit] = useState(false);

  return (
    <>
      <div>
        <h2 className="text-(color:--primary) text-4xl font-bold">
          Claim Submission
        </h2>
        <p className="text-gray-500">
          Claim<span className="text-gray-500"> &gt; </span>
          Claim Submission<span className="text-gray-500"> &gt;</span>
        </p>
        <div className="flex justify-center">
          <div className="w-5/6 items-center  rounded-lg shadow-lg bg-white mt-5 p-5">
            <ClaimForm setOpenSubmit={setOpenSubmit} />
          </div>
        </div>
      </div>

      <SubmitDialog openSubmit={openSubmit} setopenSubmit={setOpenSubmit} />
    </>
  );
}
