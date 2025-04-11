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
    link: "/event",
  },
  {
    text: "Refer Candidate",
    icon: <PersonIcon />,
    hasDropdown: false,
    link: "/refCandidate",
  },
];