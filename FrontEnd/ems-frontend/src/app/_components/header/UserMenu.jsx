"use client";

import React from "react";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../_utils/axiosInstance';
import { API_PATHS } from '../../_utils/apiPaths';
import { handleUserLogout } from '../../_utils/localStorageUtils';
import { getProfilePicture } from '../../_utils/profilePictureUtils';


const UserMenu = () => {

    const router = useRouter();
    const { user, updateUser, clearUser } = useContext(UserContext);
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);

    // Get user's profile picture from localStorage
    const userProfilePicture = getProfilePicture(user?.id || user?.username);

  const handleLogout = async () => {
    try {
      // Call logout API - but don't fail if server is down
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
    } catch (error) {
      // Handle network errors gracefully
      if (error.isNetworkError || error.message === 'Network Error' || !error.response) {
        console.warn("Server unavailable during logout - proceeding with client-side logout");
      } else {
        console.error("Logout error:", error);
      }
    } finally {
      // Always clear authentication data regardless of server response
      clearUser();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Clear any cookies
      document.cookie = 'JWT=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to home page
      router.push('/');
    }
  };

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

  // Handle logout action with data preservation
  const handlelogout = async () => {
    try {
      // Backup user data before logout (optional)
      handleUserLogout();
      
      // Call the original logout handler
      await handleLogout();
      handleCloseMenu();
    } catch (error) {
      console.error('Error during logout:', error);
      // Still proceed with logout even if backup fails
      await handleLogout();
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">

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
            src={userProfilePicture || "/profilePic.jpg"}
            alt="User Avatar"
            sx={{ width: 44, height: 44, bgcolor: '#1976d2' }}
          >
            {!userProfilePicture && user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Typography
            variant="body1"
            color="#737791"
            fontFamily="'Poppins-Medium', Helvetica"
            fontWeight={500}
          >
            {user?.username}
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
        <Link href="/employee/profile" passHref style={{ textDecoration: "none", color: "inherit" }}>
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
        
        <MenuItem onClick={handlelogout} sx={{ color: "#e80a4d" }}>
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