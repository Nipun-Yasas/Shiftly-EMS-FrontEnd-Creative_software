"use client";

import { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const requests = [
  {
    id: 123,
    name: "Brooklyn Simmons",
    date: "12 NOV 2024",
    type: "Salary Confirmation Letter",
  },
  {
    id: 567,
    name: "Brooklyn Simmons",
    date: "08 OCT 2024",
    type: "Employment Confirmation Letter",
  },
  {
    id: 890,
    name: "Brooklyn Simmons",
    date: "01 SEP 2024",
    type: "Salary Confirmation Letter",
  },
  {
    id: 891,
    name: "Brooklyn Simmons",
    date: "01 SEP 2024",
    type: "Salary Confirmation Letter",
  },
  {
    id: 892,
    name: "Brooklyn Simmons",
    date: "01 SEP 2024",
    type: "Salary Confirmation Letter",
  },
  {
    id: 893,
    name: "Brooklyn Simmons",
    date: "01 SEP 2024",
    type: "Salary Confirmation Letter",
  },
  {
    id: 894,
    name: "Brooklyn Simmons",
    date: "01 SEP 2024",
    type: "Salary Confirmation Letter",
  },
];

const rowsPerPageOptions = [5, 10];

const RequestHistory = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const totalPages = Math.ceil(requests.length / rowsPerPage);

  const handleChangePage = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "prev") return Math.max(prev - 1, 0);
      if (direction === "next") return Math.min(prev + 1, totalPages - 1);
      return prev;
    });
  };

  const currentData = requests.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  return (
    <Paper elevation={2} 
          sx={{ width: "100%",
          overflow: "hidden" ,
          borderRadius: '10px'
          }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>REQUEST ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>REQUEST BY</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>REQUEST ON</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>LETTER TYPE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((item, index) => (
              <TableRow key={index}
                  sx={{
                      height: 64, // Adjust height here for more vertical spacing
                      "& td": {
                      borderBottom: "none",
                        },
                  }}
              
              >
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={8}
        py={1.5}
      >
        {/* Rows Per Page */}
        <Box display="flex" alignItems="center">
          <Typography variant="body2" mr={1}>
            Rows per page:
          </Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(0);
            }}
          >
            {rowsPerPageOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Pagination Controls */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">
            {currentPage * rowsPerPage + 1} -{" "}
            {Math.min((currentPage + 1) * rowsPerPage, requests.length)} of{" "}
            {requests.length}
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleChangePage("prev")}
            disabled={currentPage === 0}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleChangePage("next")}
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default RequestHistory;
