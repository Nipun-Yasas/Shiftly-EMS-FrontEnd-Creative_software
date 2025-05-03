"use client";
import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import CustomToolbarActions from '../_components/header/CustomToolbarActions';
import CustomAppTitle from '../_components/header/CustomAppTitle';


export default function Layout({ children }) {
  return (
    <DashboardLayout
      slots={{
        appTitle: CustomAppTitle,
        toolbarActions: CustomToolbarActions,
      }}
    >
      <PageContainer >
        {children}
      </PageContainer>
    </DashboardLayout>
  );
}