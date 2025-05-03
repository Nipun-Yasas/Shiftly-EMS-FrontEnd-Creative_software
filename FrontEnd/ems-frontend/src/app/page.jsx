'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import LoginForm from './_components/_login/login';
import SignupForm from './_components/_sign-up/signup';
import companyLogo from '../../public/creative_software_logo.png';
import shiftlyLogo from '../../public/shiftly-logo.png';

// Component for a single collage photo
const CollagePhoto = ({ index, row, col, photoWidth, photoHeight, rotate, delay }) => {
  return (
    <motion.div
      key={index}
      className="absolute rounded-lg overflow-hidden"
      style={{
        top: `${row * photoHeight}px`,
        left: `${col * photoWidth}px`,
        width: `${photoWidth}px`,
        height: `${photoHeight}px`,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 0 15px rgba(255, 105, 180, 0.7), 0 0 25px rgba(255, 105, 180, 0.5)', // Glowing edges
      }}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{
        opacity: 0.6,
        scale: 1,
        y: 0,
        transition: { opacity: { duration: 0.8, delay, ease: 'easeOut' }, scale: { duration: 0.8, delay, ease: 'easeOut' }, y: { duration: 0.8, delay, ease: 'easeOut' } }
      }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      whileHover={{ opacity: 0.8, scale: 1.05, transition: { duration: 0.3 } }}
      whileInView={{
        y: [0, -10, 0],
        transition: {
          y: {
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: Math.random() * 2,
          },
        },
      }}
    >
      <Image
        src={`/placeholder/thumb-${(index % 7) + 1}.jpg`}
        alt={`Collage Photo ${index + 1}`}
        fill
        className="object-cover"
        loading="lazy"
      />
    </motion.div>
  );
};

export default function Dashboard() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Dynamically calculate the number of photos to cover the entire screen
  const photoWidth = 200;
  const photoHeight = 200;
  const cols = Math.ceil(window.innerWidth / photoWidth);
  const rows = Math.ceil(window.innerHeight / photoHeight);
  const numPhotos = rows * cols;

  // Memoize the collage photos to prevent re-renders
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
          photoWidth={photoWidth}
          photoHeight={photoHeight}
          rotate={rotate}
          delay={delay}
        />
      );
    }
    return photos;
  }, [cols, rows, numPhotos, photoWidth, photoHeight]);

  return (
    <div className="relative min-h-screen bg-white text-white overflow-hidden font-sans">
      {/* Background collage */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-0">
          {collagePhotos}
        </div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative bg-white/5 backdrop-blur-xl rounded-3xl w-full max-w-lg sm:max-w-xl min-h-[600px] flex flex-col justify-center items-center shadow-2xl border border-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-6 sm:p-8"
        >
          {/* Creative Software Logo (Top-Left) */}
          <div className="absolute top-4 left-4 z-10">
            <Image
              src={companyLogo}
              alt="Creative Software Logo"
              width={200}
              height={50}
              className="object-contain"
            />
          </div>

          
          {/* Shiftly logo (Centered) */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 mb-8"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            >
              <Image
                src={shiftlyLogo}
                alt="Shiftly Logo"
                width={300}
                height={100}
                className="object-contain"
              />
            </motion.div>
          </motion.div>

          {/* Buttons (Centered Below Shiftly Logo) */}
          <div className="flex space-x-4 z-10">
            <motion.button
              initial={{ backgroundColor: '#1F2937' }} // Initial background color (gray-800)
              whileHover={{
                scale: 1.1,
                backgroundColor: '#3e4756', // Darker shade on hover (gray-700)
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }} // Smooth transition for all properties
              className="bg-black-800 text-white font-semibold px-6 py-3 rounded-md shadow-md"
              onClick={() => setShowLogin(true)}
              aria-label="Open login form"
              style={{
                cursor: 'pointer',
              }}
            >
              LOGIN
            </motion.button>
            <motion.button
              initial={{ backgroundColor: '#FFFFFF' }} // Initial background color (white)
              whileHover={{
                scale: 1.1,
                backgroundColor: '', // Lighter shade on hover (gray-200)
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }} // Smooth transition for all properties
              className="bg-white text-black font-semibold px-6 py-3 rounded-md shadow-md"
              onClick={() => setShowSignup(true)}
              aria-label="Open sign up form"
              style={{
                cursor: 'pointer',
              }}
            >
              SIGN UP
            </motion.button>
          </div>
        </motion.div>

        {/* Forms */}
        {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
        {showSignup && <SignupForm onClose={() => setShowSignup(false)} />}
      </div>
    </div>
  );
}