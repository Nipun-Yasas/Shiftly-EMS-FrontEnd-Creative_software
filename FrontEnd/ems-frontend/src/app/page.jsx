"use client"; // Mark this as a Client Component

import React, { useState } from "react"; // Import React and useState
import { usePathname } from "next/navigation"; // Import usePathname for current page tracking
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MailIcon from "@mui/icons-material/Mail";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import {
  AppBar,
  Autocomplete,
  Avatar,
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image"; // Next.js Image component
import Link from "next/link"; // Next.js Link component for navigation

const navItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    hasDropdown: false,
    link: "/dashboard", // Link for the parent item
  },
  {
    text: "Employee",
    icon: <AccountCircleIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "Add Employee", link: "/employee/add" },
      { text: "View Employees", link: "/employee/view" },
      { text: "Manage Roles", link: "/employee/roles" },
      { text: "Profile", link: "/employee/profile" },
    ],
  },
  {
    text: "Organization",
    icon: <ApartmentIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "View Organization", link: "/organization/view" },
      { text: "Edit Organization", link: "/organization/edit" },
    ],
  },
  {
    text: "Project",
    icon: <WorkIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "All Projects", link: "/project/projects" },
      { text: "My Project", link: "/project/myProject" },
      { text: "Add Project", link: "/project/addProject" },
      { text: "Assign to Project", link: "/project/assignProject" },
    ],
  },
  {
    text: "Timesheet",
    icon: <AccessTimeIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "Update Timesheet", link: "/timesheet/updateTimesheet" },
      { text: "Review Timesheets", link: "/timesheet/reviewTimesheets" },
      { text: "Work Calendar", link: "/timesheet/workCalendar" },
    ],
  },
  {
    text: "Letter",
    icon: <MailOutlineIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "Request Letter", link: "/letter/request" },
      { text: "Request History", link: "/letter/requestHistory" },
      { text: "Review Requests", link: "/letter/reviewRequests" },
      { text: "Generate Letters", link: "/letter/letterGeneration" },
    ],
  },
  {
    text: "Leave",
    icon: <OpenInNewIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "Apply Leave", link: "/leave/applyLeave" },
      { text: "Leave History", link: "/leave/leaveHistory" },
      { text: "Review Leaves", link: "/leave/reviewLeaves" },
    ],
  },
  {
    text: "Claim",
    icon: <ReceiptIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "Claim Submission", link: "/claim/submitClaim" },
      { text: "Claim History", link: "/claim/claimHistory" },
      { text: "Review Claims", link: "/claim/reviewClaims" },
    ],
  },
  {
    text: "Event",
    icon: <DateRangeIcon />,
    hasDropdown: false,
    link: "/event", // Link for the parent item
  },
  {
    text: "Refer Candidate",
    icon: <PersonIcon />,
    hasDropdown: false,
    link: "/refCandidate", // Link for the parent item
  },
];

export default function Group() {
  const pathname = usePathname(); // Get the current page URL
  const [openDropdown, setOpenDropdown] = useState(null); // Track open dropdown
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Track drawer visibility

  // Check if a parent or dropdown item is active
  const isActive = (link) => pathname === link;

  // Toggle dropdown
  const handleDropdownToggle = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(null); // Close the dropdown if it's already open
    } else {
      setOpenDropdown(index); // Open the dropdown
    }
  };

  // Toggle drawer visibility
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        color="default"
        elevation={1}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: 86,
          backgroundColor: "white",
        }}
      >
        <Toolbar sx={{ height: "100%" }}>
          <IconButton edge="start" sx={{ mr: 2 }} onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>

          {/* Company Logo */}
          <Image
            src="/logo.png" // Moved to public folder
            alt="Company Logo"
            width={135}
            height={58}
            style={{ marginRight: 16 }}
          />

          {/* Search Bar */}
          <Autocomplete
            freeSolo
            options={[]}
            sx={{
              width: 402,
              bgcolor: "rgb(243, 246, 249)",
              borderRadius: "16px",
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "16px",
                    "& fieldset": { border: "1px solid rgb(224, 230, 237)" },
                  },
                }}
              />
            )}
          />

          <Box sx={{ flexGrow: 1 }} />

          {/* Icons and User Info */}
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              size="small"
              sx={{ bgcolor: "#737791", width: 22, height: 22 }}
            >
              <DarkModeIcon sx={{ color: "white", fontSize: 13 }} />
            </IconButton>

            <IconButton>
              <NotificationsIcon sx={{ color: "text.secondary" }} />
            </IconButton>

            <IconButton>
              <MailIcon sx={{ color: "text.secondary" }} />
            </IconButton>

            <Divider orientation="vertical" flexItem />

            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                src="/image-55.png" // Moved to public folder
                alt="User Avatar"
                sx={{ width: 44, height: 44 }}
              />
              <Typography
                variant="body1"
                color="#737791"
                fontFamily="'Poppins-Medium', Helvetica"
                fontWeight={500}
              >
                Brooklyn Simson
              </Typography>
              <KeyboardArrowDownIcon
                sx={{ color: "text.secondary", fontSize: 11 }}
              />
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: isDrawerOpen ? 256 : 72, // Adjust width based on drawer state
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isDrawerOpen ? 256 : 72, // Adjust width based on drawer state
            boxSizing: "border-box",
            top: 86,
            height: "calc(100% - 86px)",
            borderRight: "1px solid rgb(224, 230, 237)", // Add border to the right
            transition: "width 0.2s", // Smooth transition
          },
        }}
      >
        <List sx={{ p: 0 }}>
          {navItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding sx={{ mb: 1 }}>
                {item.hasDropdown ? (
                  <ListItemButton
                    sx={{
                      borderRadius: 1,
                      px: 2,
                      py: 1.5, // Add padding between icons in collapsed state
                      bgcolor: isActive(item.link) ? "#e80a4d1a" : "transparent", // Highlight parent if active
                      "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: isDrawerOpen ? "flex-start" : "center", // Center icons when drawer is collapsed
                      gap: isDrawerOpen ? 2 : 0, // Add gap between icon and text in expanded state
                    }}
                    onClick={() => handleDropdownToggle(index)}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: isDrawerOpen ? 2 : 0 }}>
                      {item.icon}
                    </ListItemIcon>
                    {isDrawerOpen && ( // Only show text if drawer is open
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          color: isActive(item.link) ? "#e80a4d" : "text.primary", // Change text color if active
                          variant: "body1",
                        }}
                      />
                    )}
                    {item.hasDropdown && isDrawerOpen && ( // Only show dropdown icon if drawer is open
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent parent ListItemButton from triggering
                          handleDropdownToggle(index); // Toggle dropdown
                        }}
                      >
                        <ExpandMoreIcon
                          sx={{
                            transform:
                              openDropdown === index ? "rotate(180deg)" : "none",
                            transition: "transform 0.2s",
                          }}
                        />
                      </IconButton>
                    )}
                  </ListItemButton>
                ) : (
                  <Link href={item.link} passHref>
                    <ListItemButton
                      sx={{
                        borderRadius: 1,
                        px: 2,
                        py: 1.5, // Add padding between icons in collapsed state
                        bgcolor: isActive(item.link) ? "#e80a4d1a" : "transparent", // Highlight parent if active
                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isDrawerOpen ? "flex-start" : "center", // Center icons when drawer is collapsed
                        gap: isDrawerOpen ? 2 : 0, // Add gap between icon and text in expanded state
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 0, mr: isDrawerOpen ? 2 : 0 }}>
                        {item.icon}
                      </ListItemIcon>
                      {isDrawerOpen && ( // Only show text if drawer is open
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            color: isActive(item.link) ? "#e80a4d" : "text.primary", // Change text color if active
                            variant: "body1",
                          }}
                        />
                      )}
                    </ListItemButton>
                  </Link>
                )}
              </ListItem>

              {/* Dropdown Items */}
              {item.hasDropdown && isDrawerOpen && ( // Only show dropdown items if drawer is open
                <Collapse in={openDropdown === index} timeout="auto" unmountOnExit>
                  <List sx={{ pl: 4 }}>
                    {item.dropdownItems.map((dropdownItem, i) => (
                      <ListItem key={i} disablePadding>
                        <Link href={dropdownItem.link} passHref>
                          <ListItemButton
                            sx={{
                              pl: 4,
                              bgcolor: isActive(dropdownItem.link) ? "#e80a4d1a" : "transparent", // Highlight dropdown if active
                            }}
                          >
                            <ListItemText
                              primary={dropdownItem.text}
                              primaryTypographyProps={{
                                color: isActive(dropdownItem.link) ? "#e80a4d" : "text.primary", // Change text color if active
                              }}
                            />
                          </ListItemButton>
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "86px",
          bgcolor: "background.default",
          marginLeft: isDrawerOpen ? "256px" : "72px", // Adjust margin based on drawer state
          transition: "margin-left 0.2s", // Smooth transition
        }}
      >
        {/* Main content goes here */}
      </Box>
    </Box>
  );
}