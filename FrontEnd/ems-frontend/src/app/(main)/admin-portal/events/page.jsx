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
  const [searchQuery, setSearchQuery] = useState("");
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
      // Replace with actual API call
      // const response = await axiosInstance.get('/api/events/submissions');
      // setEvents(response.data || []);

      // Using sample data for demo
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
      setEvents(sampleEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      showSnackbar("Error fetching event submissions", "error");
      setEvents(sampleEvents); // Fallback to sample data
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
      // Replace with actual API call
      // await axiosInstance.put(`/api/events/${selectedEvent.id}/${approvalAction}`, {
      //   reason: approvalReason
      // });

      const updatedStatus =
        approvalAction === "approve" ? "approved" : "rejected";

      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                status: updatedStatus,
                approvedBy:
                  approvalAction === "approve" ? "Current Admin" : null,
                approvedAt:
                  approvalAction === "approve"
                    ? new Date().toISOString()
                    : null,
                rejectionReason:
                  approvalAction === "reject" ? approvalReason : null,
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
    } catch (error) {
      console.error(`Error ${approvalAction}ing event:`, error);
      showSnackbar(`Error ${approvalAction}ing event`, "error");
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || event.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getFilteredEvents = (status) => {
    if (!status) return filteredEvents;
    return filteredEvents.filter((event) => event.status === status);
  };

  const tabProps = {
    events: getFilteredEvents(),
    loading,
    onViewDetails: handleViewDetails,
    onApprovalAction: handleApprovalAction,
    searchQuery,
    onSearchChange: handleSearchChange,
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
