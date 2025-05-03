"use client";

import {useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material"; 

import { PlusIcon } from "@heroicons/react/20/solid";

import FormDialog from "./components/FormDialog";


const columns = [
  { field: "id", headerName: "Event ID", width: 100 },
  { field: "title", headerName: "Title", width: 150 },
  { field: "audience", headerName: "Audience", width: 150 },
  { field: "eventType", headerName: "Event Type", width: 150 },
  { field: "projects", headerName: "Projects", width: 150 },
  { field: "enableDate", headerName: "Enabled Date", width: 150 },
  { field: "expireDate", headerName: "Expire Date", width: 150 },
  { field: "formUrl", headerName: "Form Url", width: 150 },
  { field: "responseUrl", headerName: "Response Url", width: 150 },

];


export default function Event(){
  
  const [openForm, setOpenForm] = useState(false);
  const [events, setEvents] = useState([]);

  return (
    <>
      <Paper elevation={10}
      sx={{
        height: '100%',
        width: '100%',
      }}>
        <div className="flex flex-col items-center">
          <div className="w-5/6 rounded-xl">
            <div className="flex justify-end m-3">
              <button
                onClick={() => {
                  setOpenForm(true);
                }}
                className="mx-2 bg-(color:--primary) shadow-xl rounded-full w-8 h-8 text-white"
              >
                <PlusIcon
                  aria-hidden="true"
                  className="m-2 text-white sm:size-4 "
                />
              </button>
            </div>
            <div className="flex justify-center mt-2 m-3">
              <div style={{ height: 300, width: "100%" }}>
              <DataGrid
  rows={events}
  columns={columns}
/>
              </div>
            </div>
          </div>
        </div>
      </Paper>

      <FormDialog
        setOpenForm={setOpenForm}
        openForm={openForm}
      />
    </>
  );
}
