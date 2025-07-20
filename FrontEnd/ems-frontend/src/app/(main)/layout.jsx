"use client";
import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import CustomToolbarActions from '../_components/header/CustomToolbarActions';
import CustomAppTitle from '../_components/header/CustomAppTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { useAuth } from '../context/AuthContext';
import theme from '../../theme';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { NextAppProvider } from '@toolpad/core/nextjs';
import { getNavigationForUser } from '../_utils/navigation';

export default function Layout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if we're not on the landing page and there's no user
    if (!loading && !user && pathname !== '/') {
      router.replace('/');
    }
  }, [user, loading, router, pathname]);

  // Show loading while checking authentication status
  if (loading) {
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

  // If no user after loading, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  const navigation = getNavigationForUser(user);

  return (
    <NextAppProvider theme={theme} navigation={navigation}>
      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,
          toolbarActions: CustomToolbarActions,
        }}
      >
        <PageContainer>
          {children}
        </PageContainer>
      </DashboardLayout>
    </NextAppProvider>
  );
}