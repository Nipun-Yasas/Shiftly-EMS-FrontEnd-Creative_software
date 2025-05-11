'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Box, Button, CardContent, Container, Typography, Modal } from '@mui/material';
import LoginForm from './_components/dialog/Login';
import SignupForm from './_components/dialog/Signup';
import companyLogo from '../../public/creative_software_logo.png';
import shiftlyLogo from '../../public/shiftly-logo.png';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import { useWindowSize } from './_hooks/useWindowSize';
import { PHOTO_WIDTH, PHOTO_HEIGHT, MAX_PHOTOS, LOGO_WIDTH, LOGO_HEIGHT, SHIFTLY_LOGO_WIDTH, SHIFTLY_LOGO_HEIGHT } from './_utils/constants';

import LandingStyledCard from './_components/landing/LandingStyledCard';
import { ThemeSwitcher } from '@toolpad/core';
import CollagePhoto from './_components/landing/CollagePhoto';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { user, loading} = useAuth();
  const router = useRouter();
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const cols = Math.ceil(width / PHOTO_WIDTH);
  const rows = Math.ceil(height / PHOTO_HEIGHT);
  const numPhotos = Math.min(rows * cols, MAX_PHOTOS);

  const collagePhotos = useMemo(() => {
    const indices = Array.from({ length: numPhotos }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const photos = [];
    for (let i = 0; i < numPhotos; i++) {
      const shuffledIndex = indices[i];
      const row = Math.floor(shuffledIndex / cols);
      const col = shuffledIndex % cols;
      const rotate = Math.floor(Math.random() * 10) - 5;
      const delay = (i % 10) * 0.1;

      photos.push(
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
    }
    return photos;
  }, [cols, rows, numPhotos]);

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        {collagePhotos}
      </Box>

      <Container
        sx={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <LandingStyledCard>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  position: 'absolute',
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
                  style={{ objectFit: 'contain' }}
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
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                >
                  <Image
                    src={shiftlyLogo}
                    alt="Shiftly Application Logo"
                    width={SHIFTLY_LOGO_WIDTH}
                    height={SHIFTLY_LOGO_HEIGHT}
                    style={{ objectFit: 'contain' }}
                  />
                </motion.div>
              </motion.div>

              <Box sx={{ display: 'flex', gap: 2, zIndex: 10 }}>
                <motion.button
              initial={{ backgroundColor: '#E80A4D' }}
              whileHover={{ scale: 1.1, backgroundColor: '#E90A4D' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-black-800 text-white font-semibold px-6 py-3 rounded-md shadow-md"
              onClick={() => setShowLogin(true)}
              aria-label="Open login form"
              style={{ cursor: 'pointer' }}
            >
              <Typography variant="button" color="white">
                LOGIN</Typography>
            </motion.button>
            <motion.button
              initial={{ backgroundColor: '#FFFFFF' }}
              whileHover={{ scale: 1.1, backgroundColor: '#E5E7EB' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="bg-white text-black font-semibold px-6 py-3 rounded-md shadow-md"
              onClick={() => setShowSignup(true)}
              aria-label="Open sign up form"
              style={{ cursor: 'pointer' }}
            >
              <Typography variant="button" color="black">
                Sign Up</Typography>
            </motion.button>
              </Box>
            </CardContent>
          </LandingStyledCard>
        </Box>

        <Modal
          open={showLogin}
          onClose={() => setShowLogin(false)}
          aria-labelledby="login-modal"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box>
            <LoginForm onClose={() => setShowLogin(false)} />
          </Box>
        </Modal>
        <Modal
          open={showSignup}
          onClose={() => setShowSignup(false)}
          aria-labelledby="signup-modal"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box>
            <SignupForm onClose={() => setShowSignup(false)} />
          </Box>
        </Modal>

        <Box component="footer" sx={{ zIndex: 10, textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight="bold">
            © Copyright 2025 by Creative Software. All Rights Reserved.
          </Typography>
          <ThemeSwitcher/>
        </Box>
      </Container>
      
    </Box>
  );
}