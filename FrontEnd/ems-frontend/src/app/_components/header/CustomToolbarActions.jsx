"use client";
import { ThemeSwitcher } from "@toolpad/core";
import Box from "@mui/material/Box";
import UserMenu from "./UserMenu";
import NotificationMenu from "./NotificationMenu";
import CalendarMenu from "./CalendarMenu";

export default function CustomToolbarActions() {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <ThemeSwitcher />
      <NotificationMenu />
      <CalendarMenu />
      <UserMenu />
    </Box>
  );
}
