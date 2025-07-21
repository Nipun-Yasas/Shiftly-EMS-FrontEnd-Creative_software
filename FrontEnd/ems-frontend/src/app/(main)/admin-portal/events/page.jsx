"use client";

import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Badge from "@mui/material/Badge";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";

import TabPanel from "../../../_components/main/TabPanel";
import NewTab from "./_components/NewTab";
import AllTab from "./_components/AllTab";
import DetailsDialog from "./_components/DetailsDialog";
import EventDialog from "./_components/EventDialog";

export default function EventSubmissionPage() {
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openApprovalDialog, setApprovalDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalReason, setApprovalReason] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Sample event data - replace with actual API calls
  const sampleEvents = [
    {
      id: 1,
      title: "Annual Team Building Event",
      organizer: "Sarah Johnson",
      organizerEmail: "sarah.johnson@company.com",
      department: "HR",
      eventType: "Team Building",
      description:
        "A day-long team building event to strengthen collaboration and team spirit among all departments.",
      startDate: "2025-08-15T09:00:00",
      endDate: "2025-08-15T17:00:00",
      location: "Conference Center A",
      expectedAttendees: 150,
      budget: 5000,
      status: "pending",
      submissionDate: "2025-07-10T14:30:00",
      requirements: [
        "Catering for 150 people",
        "Audio/Visual equipment",
        "Team building activities",
      ],
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
    },
    {
      id: 2,
      title: "Product Launch Presentation",
      organizer: "Mike Chen",
      organizerEmail: "mike.chen@company.com",
      department: "Marketing",
      eventType: "Corporate",
      description:
        "Launch presentation for our new product line with stakeholders and media.",
      startDate: "2025-08-20T14:00:00",
      endDate: "2025-08-20T18:00:00",
      location: "Main Auditorium",
      expectedAttendees: 80,
      budget: 8000,
      status: "approved",
      submissionDate: "2025-07-08T10:15:00",
      requirements: [
        "Professional presentation setup",
        "Media kit preparation",
        "Refreshments",
      ],
      approvedBy: "Admin User",
      approvedAt: "2025-07-09T11:30:00",
      rejectionReason: null,
    },
    {
      id: 3,
      title: "Quarterly Training Workshop",
      organizer: "Emma Davis",
      organizerEmail: "emma.davis@company.com",
      department: "Training",
      eventType: "Training",
      description:
        "Quarterly skills training workshop for all technical staff.",
      startDate: "2025-09-05T09:00:00",
      endDate: "2025-09-06T16:00:00",
      location: "Training Room B",
      expectedAttendees: 45,
      budget: 3000,
      status: "rejected",
      submissionDate: "2025-07-07T16:45:00",
      requirements: [
        "Training materials",
        "Laptop setup for 45 people",
        "Coffee breaks",
      ],
      approvedBy: null,
      approvedAt: null,
      rejectionReason: "Budget constraints for this quarter",
    },
    {
      id: 4,
      title: "Holiday Celebration Party",
      organizer: "Alex Rodriguez",
      organizerEmail: "alex.rodriguez@company.com",
      department: "HR",
      eventType: "Social",
      description:
        "Annual holiday celebration party for all employees and their families.",
      startDate: "2025-12-20T18:00:00",
      endDate: "2025-12-20T23:00:00",
      location: "Grand Ballroom",
      expectedAttendees: 300,
      budget: 12000,
      status: "pending",
      submissionDate: "2025-07-12T09:20:00",
      requirements: [
        "Dinner for 300 people",
        "Entertainment/DJ",
        "Decorations",
        "Photography",
      ],
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
    },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      console.log("Fetching events from:", API_PATHS.EVENTS.GET_ALL_EVENTS);
      
      const response = await axiosInstance.get(API_PATHS.EVENTS.GET_ALL_EVENTS);
      console.log("Backend response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Map backend data to frontend format
        const mappedEvents = response.data.map(event => ({
          id: event.id,
          title: event.title,
          organizer: `Employee ${event.createdBy}`, // Will need to fetch employee details later
          organizerEmail: `employee${event.createdBy}@company.com`, // Placeholder
          department: "Unknown", // Not in backend DTO, will need to fetch
          eventType: event.eventType,
          description: `Event: ${event.title}`, // Basic description since not in backend
          startDate: event.enableDate,
          endDate: event.expireDate,
          location: "TBD", // Not in backend DTO
          expectedAttendees: 0, // Not in backend DTO
          budget: 0, // Not in backend DTO
          status: event.status.toLowerCase(),
          submissionDate: event.enableDate, // Using enableDate as placeholder
          requirements: [], // Not in backend DTO
          approvedBy: event.status === 'APPROVED' ? 'Admin' : null,
          approvedAt: event.status === 'APPROVED' ? new Date().toISOString() : null,
          rejectionReason: event.status === 'REJECTED' ? 'Event rejected by admin' : null,
          // Backend specific fields
          createdBy: event.createdBy,
          fileName: event.fileName,
          filePath: event.filePath,
        }));
        
        console.log("Mapped events:", mappedEvents);
        setEvents(mappedEvents);
      } else {
        console.warn("Invalid response format or no data");
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      console.error("Error details:", error.response?.data);
      
      showSnackbar("Failed to fetch events from server", "error");
      
      // Fallback to sample data for demo
      setEvents(sampleEvents);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setOpenDetailDialog(true);
  };

  const handleApprovalAction = (event, action) => {
    setSelectedEvent(event);
    setApprovalAction(action);
    setApprovalReason("");
    setApprovalDialogOpen(true);
  };

  const submitApprovalAction = async () => {
    if (!selectedEvent || !approvalAction) return;

    try {
      console.log(`${approvalAction}ing event:`, selectedEvent.id);
      
      let response;
      if (approvalAction === "approve") {
        response = await axiosInstance.put(API_PATHS.EVENTS.APPROVE_EVENT(selectedEvent.id));
      } else {
        response = await axiosInstance.put(API_PATHS.EVENTS.REJECT_EVENT(selectedEvent.id));
      }
      
      console.log("Approval response:", response.data);

      // Update local state with the response from backend
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                status: response.data.status.toLowerCase(),
                approvedBy: response.data.status === 'APPROVED' ? "Current Admin" : null,
                approvedAt: response.data.status === 'APPROVED' ? new Date().toISOString() : null,
                rejectionReason: response.data.status === 'REJECTED' ? approvalReason || "Event rejected by admin" : null,
              }
            : event
        )
      );

      showSnackbar(
        `Event ${approvalAction === "approve" ? "approved" : "rejected"} successfully`,
        "success"
      );
      setApprovalDialogOpen(false);
      setOpenDetailDialog(false);
      
      // Refresh events to get latest data
      fetchEvents();
      
    } catch (error) {
      console.error(`Error ${approvalAction}ing event:`, error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = `Error ${approvalAction}ing event`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = "Event not found. It may have been deleted.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error while processing the request.";
      }
      
      showSnackbar(errorMessage, "error");
    }
  };

  const getFilteredEvents = (status) => {
    if (!status) return events;
    return events.filter((event) => event.status === status);
  };

  const tabProps = {
    events: events,
    loading,
    onViewDetails: handleViewDetails,
    onApprovalAction: handleApprovalAction,
    filterStatus,
    setFilterStatus,
  };

  const pendingCount = events.filter((e) => e.status === "pending").length;

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label={
              <Badge badgeContent={pendingCount} color="error">
                New Events
              </Badge>
            }
          />
          <Tab label="Event History" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <NewTab {...tabProps} events={getFilteredEvents("pending")} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AllTab {...tabProps} events={getFilteredEvents()} />
        </TabPanel>

        <DetailsDialog
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          selectedEvent={selectedEvent}
          onApprovalAction={handleApprovalAction}
        />

        <EventDialog
          open={openApprovalDialog}
          onClose={() => setApprovalDialogOpen(false)}
          selectedEvent={selectedEvent}
          approvalAction={approvalAction}
          approvalReason={approvalReason}
          setApprovalReason={setApprovalReason}
          onSubmit={submitApprovalAction}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
}
