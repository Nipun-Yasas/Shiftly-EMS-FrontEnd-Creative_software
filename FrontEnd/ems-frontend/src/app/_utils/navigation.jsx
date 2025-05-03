// Navigation configuration for Shiftly
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DateRangeIcon from "@mui/icons-material/DateRange";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import WorkIcon from "@mui/icons-material/Work";

export const navItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    hasDropdown: false,
    link: "/dashboard", 
  },
  {
    text: "Employee",
    icon: <AccountCircleIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "Add Employee", link: "/dashboard/profile" },
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
      { text: "View Organization", link: "/dashboard/organization" },
      { text: "Edit Organization", link: "/organization/edit" },
    ],
  },
  {
    text: "Project",
    icon: <WorkIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "All Projects", link: "/dashboard/project/all-projects" },
      { text: "My Project", link: "/dashboard/my-projects/basic-info" },
      { text: "Add Project", link: "/project/addProject" },
      { text: "Assign to Project", link: "/project/assignProject" },
    ],
  },
  {
    text: "Timesheet",
    icon: <AccessTimeIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "Update Timesheet", link: "/dashboard/timesheet/update-timesheet" },
      { text: "Review Timesheets", link: "/dashboard/timesheet/review-timesheet" },
      { text: "Work Calendar", link: "/dashboard/timesheet/workCalendar" },
    ],
  },
  {
    text: "Letter",
    icon: <MailOutlineIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "Request Letter", link: "/dashboard/request-letter" },
      { text: "Request History", link: "/letter/request-history" },
      { text: "Review Requests", link: "/letter/reviewRequests" },
      { text: "Generate Letters", link: "/letter/letterGeneration" },
    ],
  },
  {
    text: "Leave",
    icon: <OpenInNewIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "Apply Leave", link: "/dashboard/request-leave" },
      { text: "Leave History", link: "/dashboard/leave-history" },
      { text: "Review Leaves", link: "/leave/reviewLeaves" },
    ],
  },
  {
    text: "Claim",
    icon: <ReceiptIcon />,
    hasDropdown: true,
    dropdownItems: [
      { text: "Claim Submission", link: "/dashboard/claim-submission" },
      { text: "Claim History", link: "/dashboard/claim-history" },
      { text: "Review Claims", link: "/dashboard/reviewClaims" },
    ],
  },
  {
    text: "Event",
    icon: <DateRangeIcon />,
    hasDropdown: false,
    link: "/dashboard/events",
  },
  {
    text: "Refer Candidate",
    icon: <PersonIcon />,
    hasDropdown: false,
    link: "/dashboard/refer",
  },
];