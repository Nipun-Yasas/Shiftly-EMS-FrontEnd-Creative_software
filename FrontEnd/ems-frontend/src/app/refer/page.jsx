"use client";

import { useState } from "react";

import ReferForm from "./components/ReferForm";
import SubmitDialog from "./components/SubmitDialog";

const Refer = () => {
  const [openSubmit, setOpenSubmit] = useState(false);

  return (
    <>
      <div>
        <h2 className="text-(color:--primary) text-4xl font-bold">
          Refer Candidate
        </h2>
        <p className="text-gray-500">
          Refer Candidate <span className="text-gray-500">&gt;</span>
        </p>
        <div className="flex justify-center">
          <div className="w-5/6 items-center  rounded-lg shadow-lg bg-white mt-5 p-5">
            <ReferForm setOpenSubmit={setOpenSubmit} />
          </div>
        </div>
      </div>

      <SubmitDialog openSubmit={openSubmit} setopenSubmit={setOpenSubmit} />
    </>
  );
}

export default Refer;