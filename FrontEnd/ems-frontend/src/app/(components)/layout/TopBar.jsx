"use client";

import React from "react";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import SearchBar from "../common/SearchBar";
import UserMenu from "../common/UserMenu";

const TopBar = ({ toggleDrawer }) => {
  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: 86,
        backgroundColor: "white",
      }}
    >
      <Toolbar sx={{ height: "100%" }}>
        <IconButton edge="start" sx={{ mr: 2 }} onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>

        {/* Company Logo */}
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={135}
          height={58}
          style={{ marginRight: 16 }}
        />

        {/* Search Bar */}
        <SearchBar />

        <Box sx={{ flexGrow: 1 }} />

        {/* User Menu */}
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;