"use client";

import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";


export default function TimesheetRecord() {
  const [loading, setLoading] = useState(false);
  const [timesheetRecords, setTimesheetRecords] = useState([
    {
      id: 1,
      date: "15 Jan",
      projectTask: "E_Interview",
      workMode: "Online",
      activity: "Development work on new features and bug fixes",
      hours: "8.00",
      status: "Pending"
    },
    {
      id: 2,
      date: "15 Jan",
      projectTask: "Bench_Engineering",
      workMode: "On-site",
      activity: "Team collaboration and code reviews",
      hours: "8.00",
      status: "Approved"
    },
    {
      id: 3,
      date: "16 Jan",
      projectTask: "E_Interview",
      workMode: "Online",
      activity: "Database optimization and performance improvements",
      hours: "9.50",
      status: "Pending"
    },
    {
      id: 4,
      date: "17 Jan",
      projectTask: "CRM_Core_Admin",
      workMode: "Hybrid",
      activity: "API development and documentation",
      hours: "7.75",
      status: "Approved"
    },
    {
      id: 5,
      date: "18 Jan",
      projectTask: "E_Interview",
      workMode: "Online",
      activity: "Frontend development and UI/UX improvements",
      hours: "8.25",
      status: "Rejected"
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
          status: record.id % 3 === 0 ? "Pending" : record.id % 3 === 1 ? "Approved" : "Rejected"
        })));
      } catch (error) {
        console.error("Error fetching timesheet records:", error);
      }
      setLoading(false);
    };

    fetchTimesheetRecords();
  }, []);



  // Function to determine status color and styling
  const getStatusChip = (status) => {
    const statusConfig = {
      "Approved": { color: "success", label: "Approved" },
      "Pending": { color: "warning", label: "Pending" },
      "Rejected": { color: "error", label: "Rejected" }
    };

    const config = statusConfig[status] || { color: "default", label: status };

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{
          borderRadius: 2,
          fontWeight: 'bold',
          fontSize: '0.75rem'
        }}
      />
    );
  };

  // Custom renderer for activity column with text truncation
  const renderActivity = (params) => {
    return (
      <Box sx={{ 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        fontSize: '0.875rem'
      }}>
        {params.value}
      </Box>
    );
  };

  // Custom renderer for hours column
  const renderHours = (params) => {
    const hours = parseFloat(params.value);
    const isOvertime = hours > 8;
    
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        fontWeight: isOvertime ? 'bold' : 'normal'
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: isOvertime ? 'warning.main' : 'inherit',
            fontWeight: 'bold'
          }}
        >
          {params.value}
        </Typography>
        {isOvertime && (
          <Chip
            label="OT"
            color="warning"
            size="small"
            sx={{ 
              fontSize: '0.625rem',
              height: 16,
              minWidth: 20
            }}
          />
        )}
      </Box>
    );
  };

  const columns = [
    { 
      field: "date", 
      headerName: "Date", 
      width: 120,
      headerAlign: 'center',
      align: 'center'
    },
    { 
      field: "projectTask", 
      headerName: "Project Task", 
      width: 180,
      headerAlign: 'left',
      align: 'left'
    },
    { 
      field: "workMode", 
      headerName: "Work Mode", 
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 2,
            fontSize: '0.75rem'
          }}
        />
      )
    },
    { 
      field: "activity", 
      headerName: "Activity", 
      width: 300,
      headerAlign: 'left',
      align: 'left',
      renderCell: renderActivity
    },
    { 
      field: "hours", 
      headerName: "Hours", 
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: renderHours
    },
    { 
      field: "status", 
      headerName: "Status", 
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => getStatusChip(params.value)
    }
  ];

  return (
    <Paper elevation={1} sx={{ mb: 3 }}>
      <Box sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            py: 4 
          }}>
            <Typography variant="body2" color="text.secondary">
              Loading records...
            </Typography>
          </Box>
        ) : timesheetRecords.length > 0 ? (
          <DataGrid
            rows={timesheetRecords}
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
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            py: 4 
          }}>
            <Typography variant="body2" color="text.secondary">
              No timesheet records found.
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
} 