import React from "react";

import { Poppins, Roboto, Lexend, Inter } from "next/font/google";

import "./globals.css";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import LinearProgress from "@mui/material/LinearProgress";
import UserProvider from "./context/UserContext";

import ClientThemeProvider from "./ClientThemeProvider";

const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["100", "200", "300", "400", "500", "600"],
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

const lexend = Lexend({
  weight: ["100", "200", "300", "400", "500", "600"],
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata = {
  title: "Employee Management System",
  description: "Employee Management System",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${poppins.variable} ${roboto.variable} ${lexend.variable}`}
    >
      <body suppressHydrationWarning={true}>
        <ClientThemeProvider>
          <UserProvider>
            <AppRouterCacheProvider>
              <React.Suspense fallback={<LinearProgress />}>
                {children}
              </React.Suspense>
            </AppRouterCacheProvider>
          </UserProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
