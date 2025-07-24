"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { Box, CircularProgress } from "@mui/material";

import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";

import CustomToolbarActions from "../_components/header/CustomToolbarActions";
import CustomAppTitle from "../_components/header/CustomAppTitle";
import theme from "../../theme";
import { getNavigationForUser } from "../_utils/navigation";
import useUserAuth from "../_hooks/useUserAuth";
import {UserContext} from "../context/UserContext";

export default function Layout({ children }) {
  useUserAuth();
  
  const { user } = useContext(UserContext);
  const router = useRouter();
  const navigation = getNavigationForUser(user);

  useEffect(() => {
    // Check for both token and user data
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token && !userData && !user) {
      // No authentication data found, redirect to landing page
      router.push("/");
    }
  }, [user, router]);

  // Show loading if user data is still being fetched
  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <NextAppProvider theme={theme} navigation={navigation}>
      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,
          toolbarActions: CustomToolbarActions,
        }}
      >
        <PageContainer>{children}</PageContainer>
      </DashboardLayout>
    </NextAppProvider>
  );
}


