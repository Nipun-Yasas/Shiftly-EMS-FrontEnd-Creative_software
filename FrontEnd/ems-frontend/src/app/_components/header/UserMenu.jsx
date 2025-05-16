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

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../_utils/axiosInstance';
import { API_PATHS } from '../../_utils/apiPaths';


const UserMenu = () => {

  //  const { user, signOut, loading } = useAuth();
    const router = useRouter();
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);


  //   useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/');
  //   } else if (user && user.roles?.includes('ROLE_SUPER_ADMIN')) {
  //     const fetchEmployees = async () => {
  //       try {
  //         const response = await axiosInstance.get(API_PATHS.SUPER_ADMIN.GET_ALL_EMPLOYEES);
  //         setEmployees(response.data);
  //       } catch (err) {
  //         setError(err.message || 'Failed to fetch employees');
  //       }
  //     };
  //     fetchEmployees();
  //   }
  // }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
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

  // Handle logout action
  const handlelogout = () => {
    handleLogout();
    console.log("Logging out...");
    handleCloseMenu();
    // You could redirect to login page or call an API here
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
            src="/profilePic.jpg"
            alt="User Avatar"
            sx={{ width: 44, height: 44 }}
          />
          <Typography
            variant="body1"
            color="#737791"
            fontFamily="'Poppins-Medium', Helvetica"
            fontWeight={500}
          >
            {/* {user?.username} */} user
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