"use client";

import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Badge from "@mui/material/Badge";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import ReadTab from "./_components/ReadTab";
import UnReadTab from "./_components/UnReadTab";
import AllLettersTab from "./_components/AllLettersTab";
import LetterDetailDialog from "./_components/LetterDetailDialog";
import TabPanel from "../../../_components/main/TabPanel";

export default function LetterSubmissionPage() {
  const [tabValue, setTabValue] = useState(0);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Letter types available in the system
  const letterTypes = [
    "EPF/ETF Name Change Letter",
    "Letter for Skill Assessment",
    "Salary Undertaking Letter",
    "Salary Confirmation Letter",
    "Employment Confirmation Letter",
  ];

  // Sample letter data
  const sampleLetters = [
    {
      id: 1,
      employeeName: "Alice Johnson",
      employeeId: "EMP001",
      email: "alice.johnson@company.com",
      department: "Engineering",
      position: "Software Engineer",
      letterType: "Salary Confirmation Letter",
      requestDate: "2025-07-10T14:30:00",
      status: "unread",
      reason: "Required for bank loan application",
      additionalDetails:
        "Need this letter urgently for mortgage approval process.",
      readBy: null,
      readAt: null,
      letterContent: null,
    },
    {
      id: 2,
      employeeName: "Bob Smith",
      employeeId: "EMP002",
      email: "bob.smith@company.com",
      department: "Marketing",
      position: "Marketing Manager",
      letterType: "Employment Confirmation Letter",
      requestDate: "2025-07-09T09:15:00",
      status: "read",
      reason: "Visa application requirement",
      additionalDetails: "Needed for work permit renewal in Canada.",
      readBy: "Admin User",
      readAt: "2025-07-11T10:30:00",
      letterContent: "This is to certify that Mr. Bob Smith...",
    },
    {
      id: 3,
      employeeName: "Carol Davis",
      employeeId: "EMP003",
      email: "carol.davis@company.com",
      department: "Design",
      position: "UX Designer",
      letterType: "Letter for Skill Assessment",
      requestDate: "2025-07-12T16:45:00",
      status: "unread",
      reason: "Professional certification",
      additionalDetails: "Required for UX certification program enrollment.",
      readBy: null,
      readAt: null,
      letterContent: null,
    },
    {
      id: 4,
      employeeName: "David Wilson",
      employeeId: "EMP004",
      email: "david.wilson@company.com",
      department: "Finance",
      position: "Financial Analyst",
      letterType: "EPF/ETF Name Change Letter",
      requestDate: "2025-07-08T11:20:00",
      status: "read",
      reason: "Legal name change",
      additionalDetails: "Recently married and need to update EPF records.",
      readBy: "Admin User",
      readAt: "2025-07-09T08:30:00",
      letterContent: "This letter confirms the name change request...",
    },
  ];

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLetters(sampleLetters);
    } catch (error) {
      console.error("Error fetching letters:", error);
      showSnackbar("Error fetching letter submissions", "error");
      setLetters(sampleLetters);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const markAsRead = async (letterId) => {
    try {
      setLetters((prev) =>
        prev.map((letter) =>
          letter.id === letterId
            ? {
                ...letter,
                status: "read",
                readBy: "Current Admin",
                readAt: new Date().toISOString(),
              }
            : letter
        )
      );
      showSnackbar("Letter marked as read", "success");
    } catch (error) {
      console.error("Error marking letter as read:", error);
      showSnackbar("Error marking letter as read", "error");
    }
  };

  const markAsUnread = async (letterId) => {
    try {
      setLetters((prev) =>
        prev.map((letter) =>
          letter.id === letterId
            ? {
                ...letter,
                status: "unread",
                readBy: null,
                readAt: null,
              }
            : letter
        )
      );
      showSnackbar("Letter marked as unread", "success");
    } catch (error) {
      console.error("Error marking letter as unread:", error);
      showSnackbar("Error marking letter as unread", "error");
    }
  };

  const handleViewDetails = (letter) => {
    setSelectedLetter(letter);
    setOpenDetailDialog(true);

    if (letter.status === "unread") {
      markAsRead(letter.id);
    }
  };

  const generateLetter = async (letterId) => {
    try {
      setLetters((prev) =>
        prev.map((letter) =>
          letter.id === letterId
            ? {
                ...letter,
                processedBy: "Current Admin",
                processedAt: new Date().toISOString(),
                letterContent: `Generated ${letter.letterType} for ${letter.employeeName}...`,
              }
            : letter
        )
      );
      showSnackbar("Letter generated successfully", "success");
    } catch (error) {
      console.error("Error generating letter:", error);
      showSnackbar("Error generating letter", "error");
    }
  };

  const downloadLetter = (letterId, employeeName, letterType) => {
    const link = document.createElement("a");
    link.href = `#`;
    link.download = `${letterType.replace(/\s+/g, "_")}_${employeeName.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSnackbar("Letter download started", "success");
  };

  const filteredLetters = letters.filter((letter) => {
    const matchesSearch =
      letter.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.letterType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatusFilter =
      filterStatus === "all" || letter.status === filterStatus;

    const matchesTypeFilter =
      filterType === "all" || letter.letterType === filterType;

    return matchesSearch && matchesStatusFilter && matchesTypeFilter;
  });

  const unreadCount = letters.filter((l) => l.status === "unread").length;

  const commonProps = {
    loading,
    searchQuery,
    handleSearchChange,
    onViewDetails: handleViewDetails,
    onMarkAsRead: markAsRead,
    onMarkAsUnread: markAsUnread,
    onGenerateLetter: generateLetter,
    onDownloadLetter: downloadLetter,
  };

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label={
              <Badge badgeContent={unreadCount} color="primary">
                Unread
              </Badge>
            }
          />
          <Tab label="Read" />
          <Tab label="All Letters" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <UnReadTab
            letters={filteredLetters.filter((l) => l.status === "unread")}
            {...commonProps}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ReadTab
            letters={filteredLetters.filter((l) => l.status === "read")}
            {...commonProps}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AllLettersTab
            letters={filteredLetters}
            letterTypes={letterTypes}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterType={filterType}
            setFilterType={setFilterType}
            {...commonProps}
          />
        </TabPanel>

      <LetterDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        selectedLetter={selectedLetter}
        onGenerateLetter={generateLetter}
        onDownloadLetter={downloadLetter}
      />

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
