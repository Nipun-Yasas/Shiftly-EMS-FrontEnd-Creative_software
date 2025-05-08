import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReceiptIcon from "@mui/icons-material/Receipt";
import WorkIcon from "@mui/icons-material/Work";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

const  NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon/>,
  },
  {
    segment: 'employee',
    title: 'Employee',
    icon: <AccountCircleIcon/>,
    children: [
      {
        segment: 'profile',
        title: 'Profile',
        icon: <PersonIcon/>,
      },
    ],
  },
  {
    segment: 'organization',
    title: 'Organization',
    icon: <ApartmentIcon/>
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Work',
  },
  {
    segment: 'project',
    title: 'Project',
    icon: <WorkIcon/>,
    children: [
      {
        segment: 'all-projects',
        title: 'All Projects',
        icon: <PersonIcon />,
      },
      {
        segment: 'my-projects',
        title: 'My Project',
        icon: <PersonIcon />,
        children: [
          {
            segment: 'basic-info',
            title: 'Basic Information',
            icon: <PersonIcon />,
          },
          {
            segment: 'team',
            title: 'Team',
            icon: <PersonIcon />,
          },
        ],
      },
    ],
  },
  {
    segment: 'timesheet',
    title: 'Timesheet',
    icon: <AccessTimeIcon/>,
    children: [
      {
        segment: 'update-timesheet',
        title: 'Update Timesheet',
        icon: <PersonIcon />,
      },
      {
        segment: 'review-timesheet',
        title: 'Review Timesheet',
        icon: <PersonIcon />,
      },
    ],
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Letter',
  },
  {
    segment: 'letter',
    title: 'Letter',
    icon: <MailOutlineIcon/>,
    children: [
      {
        segment: 'request-letter',
        title: 'Request Letter',
        icon: <PersonIcon />,
      },
      {
        segment: 'request-history',
        title: 'Request History',
        icon: <PersonIcon />,
      },
    ],
  },
  {
    segment: 'leave',
    title: 'Leave',
    icon: <OpenInNewIcon/>,
    children: [
      {
        segment: 'request-leave',
        title: 'Apply Leave',
        icon: <PersonIcon />,
      },
      {
        segment: 'leave-history',
        title: 'Leave Histor',
        icon: <PersonIcon />,
      },
    ],
  },
  {
    segment: 'claim',
    title: 'Claim',
    icon: <ReceiptIcon/>,
    children: [
      {
        segment: 'claim-submission',
        title: 'Claim Submission',
        icon: <ContentPasteIcon />,
      },
      {
        segment: 'claim-history',
        title: 'Claim History',
        icon: <PendingActionsIcon />,
      },
    ],
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Other',
  },
  {
    segment: 'events',
    title: 'Event',
    icon: <DateRangeIcon/>,
    children: [
      {
        segment: 'add-event',
        title: 'Add Event',
        icon: <AddCircleOutlineIcon />,
      },
      {
        segment: 'event-history',
        title: 'Event History',
        icon: <HistoryEduIcon />,
      },
    ],
  },
  {
    segment: 'refer',
    title: 'Refer Candidate',
    icon: <PersonIcon/>,
  },
  
];

export default NAVIGATION;