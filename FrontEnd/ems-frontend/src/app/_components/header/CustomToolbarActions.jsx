"use client";
import { ThemeSwitcher } from "@toolpad/core";
import Box from "@mui/material/Box";
import UserMenu from "./UserMenu";

export default function CustomToolbarActions() {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <ThemeSwitcher />
      <UserMenu />
    </Box>
  );
}
