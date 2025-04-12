import { Poppins,Roboto,Lexend,Inter } from "next/font/google";
import "./globals.css";
import Layout from './(components)/layout/Layout';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

const inter = Inter({ subsets: ['latin'] });

const poppins = Poppins({
  weight:["100","200","300","400", "500", "600"],
  variable: "--font-poppins",
  subsets: ["latin"]
});

const roboto = Roboto({
  weight: ["100","200","300","400", "500", "600"],
  variable: "--font-roboto",
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-roboto',
});

const lexend = Lexend({
  weight: ["100","200","300","400", "500", "600"],
  variable: "--font-lexend",
  subsets: ["latin"],
});


export const metadata = {
  title: "SHIFTLY",
  description: "Employee Management System",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable} ${lexend.variable} ${inter.variable}`}>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
         <ThemeProvider theme={theme}>
            <Layout>{children}</Layout>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
     
