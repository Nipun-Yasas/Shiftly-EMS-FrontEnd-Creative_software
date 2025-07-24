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
import useEmployeeProfileCheck from "../_hooks/useEmployeeProfileCheck";
import {UserContext} from "../context/UserContext";

export default function Layout({ children }) {
  useUserAuth();
  
  const { user } = useContext(UserContext);
  const router = useRouter();
  const navigation = getNavigationForUser(user);
  
  // Check for employee profile and redirect if not found
  const { isChecking: isCheckingProfile, shouldRender, hasEmployeeProfile } = useEmployeeProfileCheck();

  useEffect(() => {
    // Check for both token and user data
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const currentPath = window.location.pathname;
    if (!token && !userData && !user) {
      // No authentication data found, redirect to landing page
      router.push("/");
    }
    // If authenticated but missing employee profile, block all routes except /employee/update
    if (user && shouldRender && !isCheckingProfile && hasEmployeeProfile === false) {
      if (!currentPath.startsWith("/employee/update")) {
        router.replace("/employee/update");
      }
    }
  }, [user, router, shouldRender, isCheckingProfile, hasEmployeeProfile]);

  // Show loading if user data is still being fetched, profile is being checked, or shouldn't render yet
  if (!user || isCheckingProfile || !shouldRender) {
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


