"use client";

import { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditReferDialog from "../_components/EditReferDialog";
import DeleteConfirmDialog from "../_components/DeleteConfirmDialog";

const initialRows = [
  {
    id: 1,
    vacancy: "Software Engineer",
    applicant_name: "John Doe",
    applicant_email: "john.doe@example.com",
    message: "Experienced developer with 5+ years in React and Node.js",
    resume_file_path: "john_doe_resume.pdf",
    status: "Pending"
  },
  {
    id: 2,
    vacancy: "UI/UX Designer",
    applicant_name: "Jane Smith",
    applicant_email: "jane.smith@example.com",
    message: "Creative designer with strong portfolio in web and mobile design",
    resume_file_path: "jane_smith_portfolio.pdf",
    status: "Approved"
  },
  {
    id: 3,
    vacancy: "Product Manager",
    applicant_name: "Mike Johnson",
    applicant_email: "mike.johnson@example.com",
    message: "Strategic product leader with experience in agile methodologies",
    resume_file_path: "mike_johnson_cv.pdf",
    status: "Rejected"
  },
];

export default function ReferHistory() {
  const [referData, setReferData] = useState(initialRows);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Remove the mounting check since it's causing issues

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const handleUpdateRecord = (updatedRecord) => {
    setReferData(prev =>
      prev.map(record =>
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };

  const handleDeleteRecord = (recordToDelete) => {
    setReferData(prev =>
      prev.filter(record => record.id !== recordToDelete.id)
    );
  };

  // Remove the columns definition since we're using a regular table now

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", p: 5 }}>
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="referral history table">
            <TableHead>
              <TableRow>
                <TableCell>Vacancy</TableCell>
                <TableCell>Candidate Name</TableCell>
                <TableCell>Candidate Email</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Uploaded Resume</TableCell>
                <TableCell>Referral State</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {referData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.vacancy}</TableCell>
                  <TableCell>{row.applicant_name}</TableCell>
                  <TableCell>{row.applicant_email}</TableCell>
                  <TableCell>{row.message}</TableCell>
                  <TableCell>{row.resume_file_path}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(row)}
                          sx={{ color: "primary.main" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(row)}
                          sx={{ color: "error.main" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Hello World text below the table */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <h2>Hello World</h2>
        </Box>
      </Box>
      <EditReferDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        record={selectedRecord}
        onUpdate={handleUpdateRecord}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        record={selectedRecord}
        onDelete={handleDeleteRecord}
      />
      
    </Paper>
  );
}