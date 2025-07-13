// Utility functions for Dashboard components

export const getGreeting = (hour) => {
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 22) return "Good Evening";
  return "Good Night";
};

export const getPriorityColor = (priority, theme) => ({
  high: theme.palette.error.main,
  medium: theme.palette.warning.main,
  low: theme.palette.success.main,
  default: theme.palette.grey[500],
})[priority] || theme.palette.grey[500];

export const getEventTypeColor = (type, theme) => ({
  interview: theme.palette.primary.main,
  meeting: theme.palette.info.main,
  review: theme.palette.warning.main,
  default: theme.palette.grey[500],
})[type] || theme.palette.grey[500];

import { Person, Event, CheckCircle } from "@mui/icons-material";
export const getEventTypeIcon = (type) => ({
  interview: <Person fontSize="small" />,
  meeting: <Event fontSize="small" />,
  review: <CheckCircle fontSize="small" />,
  default: <Event fontSize="small" />,
})[type] || <Event fontSize="small" />; 