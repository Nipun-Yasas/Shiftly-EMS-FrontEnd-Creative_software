"use client";

import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { PlusIcon } from "@heroicons/react/20/solid";

import FormDialog from "./components/FormDialog";
import SubmitDialog from "./components/SubmitDialog";

const rows = [
  {
    id: 1,
    col1: "Hello",
    col2: "World",
    col3: "Hello",
    col4: "World",
    col5: "Hello",
    col6: "World",
    col7: "Hello",
    col8: "World",
  },
  {
    id: 2,
    col1: "Hello",
    col2: "World",
    col3: "Hello",
    col4: "World",
    col5: "Hello",
    col6: "World",
    col7: "Hello",
    col8: "World",
  },
  {
    id: 3,
    col1: "Hello",
    col2: "World",
    col3: "Hello",
    col4: "World",
    col5: "Hello",
    col6: "World",
    col7: "Hello",
    col8: "World",
  },
];

const columns = [
  { field: "col1", headerName: "Title", width: 150 },
  { field: "col2", headerName: "Form URL", width: 150 },
  { field: "col3", headerName: "Response URl", width: 150 },
  { field: "col4", headerName: "audience", width: 150 },
  { field: "col5", headerName: "Event Type", width: 150 },
  { field: "col6", headerName: "Projects", width: 150 },
  { field: "col7", headerName: "Created date", width: 150 },
  { field: "col8", headerName: "Expire date", width: 150 },
];

export default function Event() {
  
  const [openForm, setOpenForm] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);

  return (
    <>
      <div>
        <h2 className="text-(color:--my1) text-4xl font-bold">Events</h2>
        <p className="text-gray-500">
          Events <span className="text-gray-500">&gt;</span>
        </p>
        <div className="flex flex-col items-center">
          <div className="w-5/6 shadow-2xl rounded-xl">
            <div className="flex justify-end m-3">
              <button
                onClick={() => {
                  setOpenForm(true);
                }}
                className="mx-2 bg-(color:--my1) shadow-xl rounded-full w-8 h-8 text-white"
              >
                <PlusIcon
                  aria-hidden="true"
                  className="m-2 text-white sm:size-4 "
                />
              </button>
            </div>
            <div className="flex justify-center mt-2 m-3">
              <div style={{ height: 300, width: "100%" }}>
                <DataGrid rows={rows} columns={columns} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormDialog
        openForm={openForm}
        setOpenForm={setOpenForm}
       
      />

<SubmitDialog openSubmit={openSubmit} setOpenSubmit={setOpenSubmit} openForm={openForm} />
    </>
  );
}
