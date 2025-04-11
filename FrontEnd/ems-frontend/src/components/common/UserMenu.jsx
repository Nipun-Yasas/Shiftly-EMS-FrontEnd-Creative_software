"use client";

import React, { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import NotificationMenu from "./NotificationMenu";
import CalendarMenu from "./CalendarMenu";

const UserMenu = () => {
  // State for managing the dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Open dropdown menu handler
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close dropdown menu handler
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Handle logout action
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    handleCloseMenu();
    // You could redirect to login page or call an API here
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <IconButton
        size="small"
        sx={{ bgcolor: "#737791", width: 22, height: 22 }}
      >
        <DarkModeIcon sx={{ color: "white", fontSize: 13 }} />
      </IconButton>

      {/* Notifications Menu */}
      <NotificationMenu />

      {/* Calendar Menu - Replaced Mail Icon */}
      <CalendarMenu />

      <Divider orientation="vertical" flexItem />

      {/* User profile section with dropdown trigger */}
      <Box 
        sx={{ 
          cursor: "pointer", 
          display: "flex", 
          alignItems: "center" 
        }}
        onClick={handleOpenMenu}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            src="/image-55.png"
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
            sx={{ 
              color: "text.secondary", 
              fontSize: 11,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </Stack>
      </Box>

      {/* User Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
            mt: 1.5,
            width: 200,
            borderRadius: 2,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.5,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Link href="/profile" passHref style={{ textDecoration: "none", color: "inherit" }}>
          <MenuItem>
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" sx={{ color: "#737791" }} />
            </ListItemIcon>
            <Typography variant="body2" color="text.primary">Profile</Typography>
          </MenuItem>
        </Link>
        
        <Link href="/settings" passHref style={{ textDecoration: "none", color: "inherit" }}>
          <MenuItem>
            <ListItemIcon>
              <SettingsIcon fontSize="small" sx={{ color: "#737791" }} />
            </ListItemIcon>
            <Typography variant="body2" color="text.primary">Settings</Typography>
          </MenuItem>
        </Link>
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem onClick={handleLogout} sx={{ color: "#e80a4d" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "#e80a4d" }} />
          </ListItemIcon>
          <Typography variant="body2">Log out</Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default UserMenu;