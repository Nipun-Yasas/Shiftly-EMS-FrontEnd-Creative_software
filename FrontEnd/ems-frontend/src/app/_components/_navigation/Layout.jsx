"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import TopBar from "./TopBar";
import SideNav from "./SideNav";

const Layout = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to dashboard if path is root
  useEffect(() => {
    if (pathname === "/" || pathname === "" || !pathname) {
      router.push("/dashboard");
    }
  }, [pathname, router]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Top Bar */}
      <TopBar toggleDrawer={toggleDrawer} />

      {/* Side Navigation */}
      <SideNav isDrawerOpen={isDrawerOpen} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "86px",
          bgcolor: "background.default",
          
          transition: "margin-left 0.2s",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;