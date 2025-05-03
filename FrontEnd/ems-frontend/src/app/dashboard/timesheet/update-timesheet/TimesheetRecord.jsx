"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Button
} from "@mui/material";

/**
 * Component for displaying timesheet records
 * @returns {JSX.Element} The timesheet record section
 */
const TimeSheetRecord = () => {
  const [tableExpanded, setTableExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [timesheetRecords, setTimesheetRecords] = useState([
    {
      id: 1,
      date: "15 Jan",
      projectTask: "E_Interview",
      workMode: "Online",
      activity: "Development",
      hours: "8.00",
      status: "Pending" // Changed to "Pending" or "Approved" in real implementation
    },
    {
      id: 2,
      date: "15 Jan",
      projectTask: "Bench_Engineering",
      workMode: "On-site",
      activity: "Development",
      hours: "8.00",
      status: "Approved" // Changed to "Pending" or "Approved" in real implementation
    }
  ]);

  // Fetch timesheet records from the backend
  useEffect(() => {
    const fetchTimesheetRecords = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch data from your API here
        // For example:
        // const response = await fetch('/api/timesheet-records');
        // const data = await response.json();
        // setTimesheetRecords(data);

        // For demonstration purposes, we'll update the statuses to more realistic values
        setTimesheetRecords(prev => prev.map(record => ({
          ...record,
          status: record.id % 2 === 0 ? "Approved" : "Pending"
        })));
      } catch (error) {
        console.error("Error fetching timesheet records:", error);
      }
      setLoading(false);
    };

    fetchTimesheetRecords();
  }, []);

  const toggleTableExpanded = () => {
    setTableExpanded(!tableExpanded);
  };

  // Function to determine status class based on status text
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <section className="mb-5 bg-white rounded-2xl">
      <div className="flex justify-between items-center p-5">
        <h2 className="text-xl text-black">
          Timesheet Record
        </h2>
        <Button 
          variant="outlined" 
          size="small"
          onClick={toggleTableExpanded}
          sx={{ ml: 2, borderRadius: '0.75rem' }}
        >
          {tableExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>

      <Collapse in={tableExpanded}>
        <div className="px-5 pb-5">
          {loading ? (
            <div className="text-center py-4">Loading records...</div>
          ) : timesheetRecords.length > 0 ? (
            <TableContainer component={Paper} className="shadow-none">
              <Table sx={{ minWidth: 650 }} aria-label="timesheet records">
                <TableHead>
                  <TableRow className="bg-gray-100">
                    <TableCell className="font-medium">Date</TableCell>
                    <TableCell className="font-medium">Project Task</TableCell>
                    <TableCell className="font-medium">Work mode</TableCell>
                    <TableCell className="font-medium">Activity</TableCell>
                    <TableCell className="font-medium">Hours</TableCell>
                    <TableCell className="font-medium">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timesheetRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.projectTask}</TableCell>
                      <TableCell>{record.workMode}</TableCell>
                      <TableCell>{record.activity}</TableCell>
                      <TableCell>{record.hours}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full ${getStatusClass(record.status)}`}>
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="text-center py-4">No timesheet records found.</div>
          )}
        </div>
      </Collapse>

    </section>
  );
};

export default TimeSheetRecord;