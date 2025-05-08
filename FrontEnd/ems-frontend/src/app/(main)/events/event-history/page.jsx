"use client";

import { useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

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

export default function Event() {
  const [events, setEvents] = useState([]);

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <div className="flex flex-col items-center">
          <div className="w-5/6 rounded-xl">
            <div className="flex justify-end m-3"></div>
            <div className="flex justify-center mt-2 m-3">
              <div style={{ height: 300, width: "100%" }}>
                <DataGrid rows={events} columns={columns} />
              </div>
            </div>
          </div>
        </div>
      </Paper>
    </>
  );
}
