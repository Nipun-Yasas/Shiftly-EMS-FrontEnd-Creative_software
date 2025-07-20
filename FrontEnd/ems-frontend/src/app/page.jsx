"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "@toolpad/core";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoginForm from "./_components/dialog/Login";
import SignUpForm from "./_components/dialog/SignUp";
import LandingCard from "./_components/landing/LandingCard";
import CollagePhoto from "./_components/landing/CollagePhoto";
import companyLogo from "../../public/creative_software_logo.png";
import shiftlyLogo from "../../public/shiftly-logo.png";
import { useAuth } from "./context/AuthContext";
import { useWindowSize } from "./_hooks/useWindowSize";
import {
  PHOTO_WIDTH,
  PHOTO_HEIGHT,
  MAX_PHOTOS,
  LOGO_WIDTH,
  LOGO_HEIGHT,
  SHIFTLY_LOGO_WIDTH,
  SHIFTLY_LOGO_HEIGHT,
} from "./_utils/constants";
import dynamic from "next/dynamic";

const CollageGridClient = dynamic(() => import("./CollageGridClient"), {
  ssr: false,
});

export default function LandingPage() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  // const { user, loading } = useAuth();
  const router = useRouter();
  const { width, height } = useWindowSize();

  // Uncomment when AuthContext is properly set up
  // useEffect(() => {
  //   if (!loading && user) {
  //     router.push("/dashboard");
  //   }
  // }, [user, loading, router]);

  // Responsive photo grid calculations
  const cols = Math.max(1, Math.ceil(width / PHOTO_WIDTH));
  const rows = Math.max(1, Math.ceil(height / PHOTO_HEIGHT));
  const numPhotos = Math.min(rows * cols, MAX_PHOTOS);

  // Memoize photo indices to avoid re-shuffling on every render
  const photoIndices = useMemo(() => {
    const indices = Array.from({ length: numPhotos }, (_, i) => i);
    // Only shuffle on client-side to avoid hydration mismatch
    if (typeof window !== "undefined") {
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
    }
    return indices;
  }, [numPhotos]);

  const collagePhotos = useMemo(() => {
    return photoIndices.map((shuffledIndex, i) => {
      const row = Math.floor(shuffledIndex / cols);
      const col = shuffledIndex % cols;
      // Generate rotate and delay only on client-side
      const rotate = typeof window !== "undefined" ? Math.floor(Math.random() * 10) - 5 : 0;
      const delay = typeof window !== "undefined" ? (i % 10) * 0.1 : 0;

      return (
        <CollagePhoto
          key={shuffledIndex}
          index={shuffledIndex}
          row={row}
          col={col}
          photoWidth={PHOTO_WIDTH}
          photoHeight={PHOTO_HEIGHT}
          rotate={rotate}
          delay={delay}
        />
      );
    });
  }, [photoIndices, cols, rows]);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <CollageGridClient photos={collagePhotos} />
      </Box>

      <Container
        sx={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <LandingCard>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  zIndex: 10,
                }}
              >
                <Image
                  src={companyLogo}
                  alt="Creative Software Company Logo"
                  width={LOGO_WIDTH}
                  height={LOGO_HEIGHT}
                  style={{ objectFit: "contain", width: "auto", height: "auto" }}
                  priority // Optimize for critical above-the-fold content
                />
              </Box>

              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                sx={{ mb: 4 }}
              >
                <motion.div
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Image
                    src={shiftlyLogo}
                    alt="Shiftly Application Logo"
                    width={SHIFTLY_LOGO_WIDTH}
                    height={SHIFTLY_LOGO_HEIGHT}
                    style={{ objectFit: "contain", width: "auto", height: "auto" }}
                    priority // Optimize for critical above-the-fold content
                  />
                </motion.div>
              </motion.div>

              <Box sx={{ display: "flex", gap: 2, zIndex: 10 }}>
                <motion.button
                  initial={{ backgroundColor: "#E80A4D" }}
                  whileHover={{ scale: 1.1, backgroundColor: "#E90A4D" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-black-800 text-white font-semibold px-6 py-3 rounded-md shadow-md"
                  onClick={() => setOpenLogin(true)}
                  aria-label="Open login form"
                  style={{ cursor: "pointer" }}
                >
                  <Typography variant="button" color="white">
                    LOGIN
                  </Typography>
                </motion.button>
                <motion.button
                  initial={{ backgroundColor: "#FFFFFF" }}
                  whileHover={{ scale: 1.1, backgroundColor: "#E5E7EB" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="bg-white text-black font-semibold px-6 py-3 rounded-md shadow-md"
                  onClick={() => setOpenSignUp(true)}
                  aria-label="Open sign up form"
                  style={{ cursor: "pointer" }}
                >
                  <Typography variant="button" color="black">
                    Sign Up
                  </Typography>
                </motion.button>
              </Box>
            </CardContent>
          </LandingCard>
        </Box>

        <Box
          component="footer"
          sx={{ zIndex: 10, textAlign: "center", py: 2 }}
        >
          <Typography variant="body2" fontWeight="bold">
            © Copyright 2025 by Creative Software. All Rights Reserved.
          </Typography>
          <ThemeSwitcher />
        </Box>
      </Container>

      <LoginForm
        openLogin={openLogin}
        setOpenLogin={setOpenLogin}
        openSignUp={() => setOpenSignUp(true)}
      />
      <SignUpForm
        openSignUp={openSignUp}
        setOpenSignUp={setOpenSignUp}
        openLogin={() => setOpenLogin(true)}
      />
    </Box>
  );
}