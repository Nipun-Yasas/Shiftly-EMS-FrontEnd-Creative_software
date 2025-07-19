"use client";

import { useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";

const rows = [
  {
    id: 1,
    vacancy: "Hello",
    applicant_name: "World",
    applicant_email: "Hello",
    message: "World",
    resume_file_path: "Hello",
    status: "Pending"
    
  },
  {
    id: 2,
    vacancy: "Hello",
    applicant_name: "World",
    applicant_email: "Hello",
    message: "World",
    resume_file_path: "Hello",
    status: "Pending"
  },
  {
    id: 3,
    vacancy: "Hello",
    applicant_name: "World",
    applicant_email: "Hello",
    message: "World",
    resume_file_path: "Hello",
    status: "Pending"
  },
];

const columns = [
  { field: "vacancy", headerName: "Vacancy", width: 150 },
  { field: "applicant_name", headerName: "Candidate Name", width: 250 },
  { field: "applicant_email", headerName: "Candidate Email", width: 150 },
  { field: "message", headerName: "Message", width: 300 },
  { field: "resume_file_path", headerName: "Uploaded Resume", width: 150 },
  { field: "status", headerName: "Referal State", width: 150 },
  // {
  //       field: "actions",
  //       headerName: "Actions",
  //       width: 140,
  //       renderCell: (params) => (
  //         <Box>
  //           <Tooltip title="Edit">
  //             <IconButton
  //               size="small"
  //               onClick={() => handleEdit(params.row)}
  //               sx={{ color: "primary.main" }}
  //             >
  //               <EditIcon />
  //             </IconButton>
  //           </Tooltip>
  //           <Tooltip title="Delete">
  //             <IconButton
  //               size="small"
  //               onClick={() => {
  //                 setUserToDelete(params.row);
  //                 setDeleteConfirmOpen(true);
  //               }}
  //               sx={{ color: "error.main" }}
  //             >
  //               <DeleteIcon />
  //             </IconButton>
  //           </Tooltip>
  //         </Box>
  //       ),
  //     },

];

export default function Event() {
  // const [events, setEvents] = useState([]);

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ width: "100%", p: 5 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          height="auto"
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 50, 100]}
        />
      </Box>
    </Paper>
  );
}
