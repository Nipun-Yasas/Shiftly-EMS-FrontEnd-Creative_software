import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EmailIcon from '@mui/icons-material/Email';
import MarkAsUnreadOutlinedIcon from '@mui/icons-material/MarkAsUnreadOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import ReceiptIcon from "@mui/icons-material/Receipt";
import WorkIcon from "@mui/icons-material/Work";
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import UpdateIcon from '@mui/icons-material/Update';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ApprovalIcon from '@mui/icons-material/Approval';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import FreeCancellationOutlinedIcon from '@mui/icons-material/FreeCancellationOutlined';
import { HistoryOutlined, PersonAddOutlined } from '@mui/icons-material';

const  NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'admin-portal',
    title: 'Admin Portal',
    icon: <AdminPanelSettingsIcon/>,
    children: [
      {
        segment: 'user-management',
        title: 'User Management',
        icon: <ManageAccountsOutlinedIcon/>,
      },
      {
        segment: 'project-management',
        title: 'Project Management',
        icon: <WorkOutlineIcon/>,
      },
       {
        segment: 'timesheet-management',
        title: 'Timesheet Management',
        icon: <WorkHistoryOutlinedIcon/>,
      },
      {
        segment: 'leaves',
        title: 'Leaves',
        icon: <FreeCancellationOutlinedIcon/>,
      },
      {
        segment: 'letters',
        title: 'Letters',
        icon: <MarkAsUnreadOutlinedIcon/>,
      },
      {
        segment: 'claims',
        title: 'Claims',
        icon: <ReceiptLongOutlinedIcon/>,
      },
      {
        segment: 'events',
        title: 'Events',
        icon: <EditCalendarOutlinedIcon/>,
      },
       {
        segment: 'candidates',
        title: 'Candidates',
        icon: <GroupAddOutlinedIcon/>,
      }
    ]
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
      }
    ]
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
        icon: <WorkHistoryIcon/>,
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
            icon: <EngineeringIcon />,
          }
        ]
      }
    ]
  },
  {
    segment: 'timesheet',
    title: 'Timesheet',
    icon: <AccessTimeFilledIcon/>,
    children: [
      {
        segment: 'update-timesheet',
        title: 'Update Timesheet',
        icon: <UpdateIcon />,
      },
      {
        segment: 'review-timesheet',
        title: 'Review Timesheet',
        icon: <ManageHistoryIcon />,
      }
    ]
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
    icon: <EmailIcon/>,
    children: [
      {
        segment: 'request-letter',
        title: 'Request Letter',
        icon: <HistoryEduOutlinedIcon />,
      },
      {
        segment: 'request-history',
        title: 'Request History',
        icon: <MarkAsUnreadOutlinedIcon />,
      }
    ]
  },
  {
    segment: 'leave',
    title: 'Leave',
    icon: <DirectionsRunIcon/>,
    children: [
      {
        segment: 'request-leave',
        title: 'Apply Leave',
        icon: <ApprovalIcon />,
      },
      {
        segment: 'leave-history',
        title: 'Leave History',
        icon: <HistoryOutlinedIcon />,
      }
    ]
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
      }
    ]
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
      }
    ]
  },
  {
    segment: 'refer',
    title: 'Refer',
    icon: <SupervisorAccountIcon/>,
    children: [
      {
        segment: 'refer-candidate',
        title: 'Refer Candidate',
        icon: <PersonAddOutlined />,
      },
      {
        segment: 'refer-history',
        title: 'Refer History',
        icon: <HistoryOutlined/>,
      }
    ]
  },
  
];

export default NAVIGATION;