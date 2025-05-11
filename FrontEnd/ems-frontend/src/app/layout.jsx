import { Poppins, Roboto, Lexend, Inter } from 'next/font/google';
import './globals.css';
import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import LinearProgress from '@mui/material/LinearProgress';
import theme from '../theme';
import NAVIGATION from './_utils/navigation';
import { AuthProvider } from './context/AuthContext';
import { signIn, signOut } from './context/AuthActions';

const inter = Inter({ subsets: ['latin'] });

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600'],
  variable: '--font-poppins',
  subsets: ['latin'],
});

const roboto = Roboto({
  weight: ['100', '200', '300', '400', '500', '600'],
  variable: '--font-roboto',
  subsets: ['latin'],
  display: 'swap',
});

const lexend = Lexend({
  weight: ['100', '200', '300', '400', '500', '600'],
  variable: '--font-lexend',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Employee Management System',
  description: 'Employee Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        <AppRouterCacheProvider>
          <React.Suspense fallback={<LinearProgress />}>
            <AuthProvider>
              <NextAppProvider
                theme={theme}
                navigation={NAVIGATION}
                authentication={{
                  signIn,
                  signOut,
                }}
              >
                {children}
              </NextAppProvider>
            </AuthProvider>
          </React.Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}