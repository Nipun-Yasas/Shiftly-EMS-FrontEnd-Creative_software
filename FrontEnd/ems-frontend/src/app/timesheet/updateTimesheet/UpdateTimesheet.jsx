"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

/**
 * Component for updating timesheet entries
 * @returns {JSX.Element} The update timesheet section
 */
const UpdateTimesheet = () => {
  const [startDate, setStartDate] = useState("01/01/2023");
  const [endDate, setEndDate] = useState("01/07/2023");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // State for separate year, month, day selection
  const [selectedYear, setSelectedYear] = useState(2023);
  const [selectedMonth, setSelectedMonth] = useState(1); // 1-12
  const [selectedDay, setSelectedDay] = useState(1); // 1-31

  const [weekDays, setWeekDays] = useState([
    { display: "01 / Mon" },
    { display: "02 / Tue" },
    { display: "03 / Wed" },
    { display: "04 / Thu" },
    { display: "05 / Fri" },
    { display: "06 / Sat" },
    { display: "07 / Sun" },
  ]);

  const [rows, setRows] = useState([
    {
      id: 1,
      project: "E_Interview",
      workMode: "Online",
      activity: "Alpha",
      hours: Array(7).fill("4.00"),
    },
    {
      id: 2,
      project: "E_Bench_Engineering",
      workMode: "On-site",
      activity: "Alpha",
      hours: Array(7).fill("4.00"),
    },
  ]);
  
  // Track the total hours
  const [totalHours, setTotalHours] = useState({ actual: 0, expected: 0 });

  // Calculate total hours whenever rows change
  useEffect(() => {
    let actual = 0;
    
    rows.forEach(row => {
      row.hours.forEach(hour => {
        if (hour) {
          actual += parseFloat(hour) || 0;
        }
      });
    });
    
    // For this example, we'll set expected to 32 (8 hours per day for 4 weekdays)
    const expected = 32.00;
    
    setTotalHours({
      actual: actual.toFixed(2),
      expected: expected.toFixed(2)
    });
  }, [rows]);

  // Generate years for dropdown (10 years back, 10 years forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Months for dropdown
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Get days in month for dropdown
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // Generate days array based on selected year and month
  const getDaysArray = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // Update selected day if it's invalid for the current month
  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  // Load timesheet data for the selected week
  const loadTimesheetData = async (startDate, endDate) => {
    setLoading(true);
    try {
      // In a real app, you would fetch data from your API here
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessage({ text: "Timesheet loaded successfully", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      console.error("Error loading timesheet:", error);
      setMessage({ text: "Failed to load timesheet data", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
    setLoading(false);
  };

  // Apply the selected date and calculate week
  const applySelectedDate = () => {
    // Create date from selected year, month, day
    const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = selectedDate.getDay();

    // Calculate the Monday of the week (if day is Sunday, go back 6 days, otherwise go back dayOfWeek-1 days)
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() - mondayOffset);

    // Calculate the Sunday of the week
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Format dates
    const formattedStartDate = formatDate(monday);
    const formattedEndDate = formatDate(sunday);

    // Update state
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    updateWeekDaysFromDate(monday);

    // Load timesheet data for the selected week
    loadTimesheetData(formattedStartDate, formattedEndDate);

    // Close dialog
    setIsCalendarOpen(false);
  };

  // Format date as MM/DD/YYYY
  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Update week days based on start date
  const updateWeekDaysFromDate = (startDateObj) => {
    const days = [];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDateObj);
      currentDate.setDate(startDateObj.getDate() + i);
      const day = String(currentDate.getDate()).padStart(2, "0");
      days.push({
        display: `${day} / ${dayNames[i]}`,
        date: new Date(currentDate),
      });
    }

    setWeekDays(days);
  };

  // Initialize date selectors when opening calendar
  const handleCalendarOpen = () => {
    // Parse current start date to set initial values
    const parts = startDate.split("/");
    setSelectedMonth(parseInt(parts[0], 10));
    setSelectedDay(parseInt(parts[1], 10));
    setSelectedYear(parseInt(parts[2], 10));
    setIsCalendarOpen(true);
  };

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };

  const addRow = () => {
    const newRow = {
      id: Date.now(), // Use timestamp as unique ID
      project: "",
      workMode: "",
      activity: "",
      hours: Array(7).fill(""),
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleDeleteTimesheet = async () => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete all timesheet entries?")) {
      return;
    }
    
    setLoading(true);
    try {
      // In a real app, you would send a delete request to your API here
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Reset the rows to empty
      setRows([]);
      
      setMessage({ text: "All timesheet entries deleted successfully", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      
      // Add a blank row after deleting
      addRow();
    } catch (error) {
      console.error("Error deleting timesheet:", error);
      setMessage({ text: "Failed to delete timesheet entries", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
    setLoading(false);
  };

  const handleSubmitTimesheet = async () => {
    setLoading(true);
    // Validate the timesheet
    const isValid = validateTimesheet();
    
    if (!isValid) {
      setLoading(false);
      return;
    }
    
    try {
      // In a real app, you would send data to your API here
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Prepare data for submission
      const timesheetData = {
        startDate,
        endDate,
        status: "Pending",
        entries: rows.map(row => ({
          project: row.project,
          workMode: row.workMode,
          activity: row.activity,
          hours: row.hours
        }))
      };
      
      console.log("Submitting timesheet:", timesheetData);
      
      setMessage({ text: "Timesheet submitted successfully", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      setMessage({ text: "Failed to submit timesheet", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
    setLoading(false);
  };

  const validateTimesheet = () => {
    // Check if all rows have required fields
    for (const row of rows) {
      if (!row.project || !row.workMode || !row.activity) {
        setMessage({ 
          text: "Please fill in all required fields (Project, Work Mode, Activity)", 
          type: "error" 
        });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        return false;
      }
      
      // Check if all hours are valid numbers
      for (const hour of row.hours) {
        if (hour && isNaN(parseFloat(hour))) {
          setMessage({ 
            text: "Please enter valid hours (numbers only)", 
            type: "error" 
          });
          setTimeout(() => setMessage({ text: "", type: "" }), 3000);
          return false;
        }
      }
    }
    
    return true;
  };

  return (
    <section className="flex flex-col p-5 mb-5 bg-white rounded-2xl">
      <h2 className="text-xl text-black">Update Timesheet</h2>

      {message.text && (
        <div 
          className={`mb-4 p-2 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-5">
        <label
          htmlFor="week-select"
          className="mt-5 mb-2.5 text-xs text-black block"
        >
          Select the week
        </label>
        <div className="flex gap-3 items-center">
          <div className="relative w-[100px]">
            <label
              className="absolute -top-2 left-3 px-1 py-0 text-xs bg-white text-black text-opacity-60"
              htmlFor="start-date"
            >
              Start Date
            </label>
            <input
              id="start-date"
              type="text"
              value={startDate}
              readOnly
              className="px-3 py-2 w-full text-sm rounded-xl border border-solid border-black border-opacity-20"
              aria-label="Start date"
            />
          </div>
          <span className="text-4xl leading-4 text-black" aria-hidden="true">
            -
          </span>
          <div className="relative w-[100px]">
            <label
              className="absolute -top-2 left-3 px-1 py-0 text-xs bg-white text-black text-opacity-60"
              htmlFor="end-date"
            >
              End Date
            </label>
            <input
              id="end-date"
              type="text"
              value={endDate}
              readOnly
              className="px-3 py-2 w-full text-sm rounded-xl border border-solid border-black border-opacity-20"
              aria-label="End date"
            />
          </div>
          <button
            className="text-black cursor-pointer"
            aria-label="Open calendar"
            onClick={handleCalendarOpen}
            disabled={loading}
          >
            <i
              className="ti ti-calendar"
              aria-hidden="true"
              style={{ fontSize: "24px" }}
            ></i>
          </button>
        </div>
      </div>

      <div className="flex gap-5 mb-5 max-md:flex-col">
        <div className="flex flex-col gap-2.5 w-[40px]">
          <h3 className="mb-2 text-xs text-black">Action</h3>
          {rows.map((row) => (
            <button
              key={`remove-${row.id}`}
              onClick={() => removeRow(row.id)}
              className="flex justify-center items-center p-2.5 text-red-500 hover:text-red-700 h-[42px]"
              aria-label={`Remove ${row.project} row`}
              disabled={loading || rows.length <= 1}
            >
              <i
                className="ti ti-trash"
                aria-hidden="true"
                style={{ fontSize: "18px" }}
              ></i>
            </button>
          ))}
        </div>
        <ProjectSection rows={rows} setRows={setRows} />
        <WorkModeSection rows={rows} setRows={setRows} />
        <ActivitySection rows={rows} setRows={setRows} />
        <TimeEntrySection rows={rows} setRows={setRows} weekDays={weekDays} />
      </div>

      <div className="flex gap-3 items-center mt-5 max-sm:flex-wrap">
        <button
          className="flex gap-2 items-center px-4 py-0 h-9 text-sm text-blue-500 rounded-2xl border-2 border-blue-500 border-solid whitespace-nowrap"
          aria-label="Add new row"
          onClick={addRow}
          disabled={loading}
        >
          <i
            className="ti ti-plus"
            aria-hidden="true"
            style={{ fontSize: "18px" }}
          ></i>
          <span>Add row</span>
        </button>
        <button
          className="px-5 py-0 h-9 text-white bg-rose-600 rounded-2xl border-none ml-auto"
          aria-label="Delete timesheet"
          onClick={handleDeleteTimesheet}
          disabled={loading}
        >
          Delete
        </button>
        <button
          className="px-5 py-0 h-9 text-white bg-green-500 rounded-2xl border-none"
          aria-label="Submit timesheet"
          onClick={handleSubmitTimesheet}
          disabled={loading}
        >
          Submit
        </button>
      </div>

      <div className="flex flex-row ml-auto text-zinc-500">
        <span className="mt-2.5">Total</span>
        <span className="mt-2.5 ml-2 text-black">{totalHours.actual}/{totalHours.expected}</span>
      </div>

      {/* Date Selection Dialog with separate year, month, day selectors */}
      <Dialog
        open={isCalendarOpen}
        onClose={handleCalendarClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Date</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className="text-center mb-4">
                  <p>Current Selected Week:</p>
                  <p className="font-bold">
                    {startDate} - {endDate}
                  </p>
                </div>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="year-select-label">Year</InputLabel>
                  <Select
                    labelId="year-select-label"
                    id="year-select"
                    value={selectedYear}
                    label="Year"
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="month-select-label">Month</InputLabel>
                  <Select
                    labelId="month-select-label"
                    id="month-select"
                    value={selectedMonth}
                    label="Month"
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="day-select-label">Day</InputLabel>
                  <Select
                    labelId="day-select-label"
                    id="day-select"
                    value={selectedDay}
                    label="Day"
                    onChange={(e) => setSelectedDay(e.target.value)}
                  >
                    {getDaysArray().map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <p className="text-sm text-gray-600">
                    Selecting any date will set the timesheet to that date's
                    week (Monday to Sunday).
                  </p>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCalendarClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={applySelectedDate}
            color="primary"
            variant="contained"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

/**
 * Project section component
 * @param {Object} props - Component props
 * @param {Array} props.rows - Array of timesheet rows
 * @param {Function} props.setRows - Function to update rows
 * @returns {JSX.Element} The project section
 */
const ProjectSection = ({ rows, setRows }) => {
  const projects = ["E_Interview", "E_Bench_Engineering", "CRM_Core_Admin", "ERP_Code_Events"];
  
  const handleProjectChange = (rowId, newProject) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, project: newProject } : row
    ));
  };

  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="mb-2 text-xs text-black">Project</h3>
      {rows.map((row) => (
        <div key={row.id} className="flex gap-2.5 items-center p-2.5 rounded bg-zinc-100 min-w-[122px]">
          <select 
            value={row.project}
            onChange={(e) => handleProjectChange(row.id, e.target.value)}
            className="bg-transparent border-none w-full focus:outline-none cursor-pointer appearance-none px-2 py-1 rounded text-sm"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              backgroundSize: "16px"
            }}
          >
            <option value="">Select project</option>
            {projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

/**
 * Work mode section component
 * @param {Object} props - Component props
 * @param {Array} props.rows - Array of timesheet rows
 * @param {Function} props.setRows - Function to update rows
 * @returns {JSX.Element} The work mode section
 */
const WorkModeSection = ({ rows, setRows }) => {
  const workModes = ["Online", "On-site", "Hybrid"];
  
  const handleWorkModeChange = (rowId, newWorkMode) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, workMode: newWorkMode } : row
    ));
  };

  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="mb-2 text-xs text-black">Work Mode</h3>
      {rows.map((row) => (
        <div key={row.id} className="p-2.5 rounded bg-zinc-100 min-w-[122px]">
          <select 
            value={row.workMode}
            onChange={(e) => handleWorkModeChange(row.id, e.target.value)}
            className="bg-transparent border-none w-full focus:outline-none cursor-pointer appearance-none px-2 py-1 rounded text-sm"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              backgroundSize: "16px"
            }}
          >
            <option value="">Select work mode</option>
            {workModes.map(mode => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

/**
 * Activity section component - changed to text input as per requirements
 * @param {Object} props - Component props
 * @param {Array} props.rows - Array of timesheet rows
 * @param {Function} props.setRows - Function to update rows
 * @returns {JSX.Element} The activity section
 */
const ActivitySection = ({ rows, setRows }) => {
  const handleActivityChange = (rowId, newActivity) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, activity: newActivity } : row
    ));
  };

  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="mb-2 text-xs text-black">Activity</h3>
      {rows.map((row) => (
        <div key={row.id} className="p-2.5 rounded bg-zinc-100 min-w-[122px]">
          <input 
            type="text"
            value={row.activity}
            onChange={(e) => handleActivityChange(row.id, e.target.value)}
            placeholder="Enter activity"
            className="bg-transparent border-none w-full focus:outline-none px-2 py-1 rounded text-sm"
          />
        </div>
      ))}
    </div>
  );
};

/**
 * Time entry section component - added margins between input fields
 * @param {Object} props - Component props
 * @param {Array} props.rows - Array of timesheet rows
 * @param {Function} props.setRows - Function to update rows
 * @param {Array} props.weekDays - Array of days in the selected week
 * @returns {JSX.Element} The time entry section
 */
const TimeEntrySection = ({ rows, setRows, weekDays }) => {
  // If weekDays is empty, use default days
  const displayDays =
    weekDays.length > 0
      ? weekDays.map((day) => day.display)
      : [
          "15 / Mon",
          "16 / Tue",
          "17 / Wed",
          "18 / Thu",
          "19 / Fri",
          "20 / Sat",
          "21 / Sun",
        ];

  const handleHourChange = (rowId, dayIndex, value) => {
    // Validate input (only allow numbers and decimal point)
    const validatedValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure proper decimal format (up to 2 decimal places)
    const formattedValue = validatedValue === '' ? '' : 
      parseFloat(validatedValue).toFixed(2);
    
    // Update the hours for the specific day in the specific row
    setRows(rows.map(row => {
      if (row.id === rowId) {
        const newHours = [...row.hours];
        newHours[dayIndex] = formattedValue;
        return { ...row, hours: newHours };
      }
      return row;
    }));
  };

  return (
    <div className="grow max-md:overflow-x-auto">
      <div className="flex justify-between mb-2.5 text-xs text-zinc-500">
        {displayDays.map((day, index) => (
          <div key={index} className="w-14 text-center">{day}</div>
        ))}
      </div>
      <div className="flex flex-col gap-5 pt-2.5 pb-4 mb-0.5">
        {rows.map((row) => (
          <TimeEntryRow 
            key={row.id} 
            rowId={row.id}
            hours={row.hours} 
            onHourChange={handleHourChange}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Time entry row component - added margins between input fields
 * @param {Object} props - Component props
 * @param {string} props.rowId - Row ID
 * @param {Array} props.hours - Array of hours for each day
 * @param {Function} props.onHourChange - Function to handle hour changes
 * @returns {JSX.Element} A row of time entries
 */
const TimeEntryRow = ({ rowId, hours = Array(7).fill("4.00"), onHourChange }) => {
  return (
    <div className="flex justify-between gap-2">
      {hours.map((hour, index) => {
        // Weekend days (last two days)
        const isWeekend = index >= 5;
        const isEmpty = !hour || hour === "0.00";
        
        return (
          <div
            key={index}
            className={`relative w-14 h-9 rounded font-bold flex items-center justify-center 
              ${isEmpty ? "bg-zinc-300" : isWeekend ? "bg-yellow-100" : "bg-blue-500 text-white"}`}
          >
            <input
              type="text"
              value={hour}
              onChange={(e) => onHourChange(rowId, index, e.target.value)}
              onBlur={(e) => {
                if (e.target.value) {
                  onHourChange(rowId, index, parseFloat(e.target.value).toFixed(2));
                }
              }}
              className={`w-full h-full text-center bg-transparent border-none focus:outline-none 
                ${isEmpty ? "text-zinc-500" : isWeekend ? "text-black" : "text-white"}`}
              maxLength={5}
              placeholder="0.00"
            />
          </div>
        );
      })}
    </div>
  );
};

export default UpdateTimesheet;