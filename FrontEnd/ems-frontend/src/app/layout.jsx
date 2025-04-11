
import { Poppins,Roboto,Lexend } from "next/font/google";
import "./globals.css";
import { Inter } from 'next/font/google';
import Layout from './(components)/layout/Layout';

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
      <Layout>
        {children}
        </Layout>
      </body>
    </html>
  );
}
     
