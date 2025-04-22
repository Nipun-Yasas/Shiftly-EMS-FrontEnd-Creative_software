'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignuUpFrom';

export default function Dashboard() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative bg-white/80 backdrop-blur-lg rounded-3xl w-full max-w-5xl overflow-hidden"
      >
        {/* Glow backgrounds */}
        <div className="absolute -top-10 -left-10 w-60 h-60  opacity-30 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-purple-300 opacity-30 rounded-full blur-3xl animate-pulse z-0"></div>

        {/* Header */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-between items-center px-8 py-4 z-10 relative"
        >
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            className="w-40"
          >
            <Image
              src="/shiftly-logo.png"
              alt="Shiftly Logo"
              width={160}
              height={60}
              className="object-contain"
            />
          </motion.div>
          <div className="space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-black text-white px-5 py-2 rounded-md"
              onClick={() => setShowLogin(true)}
            >
              LOGIN
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-black text-white px-5 py-2 rounded-md"
              onClick={() => setShowSignup(true)}
            >
              SIGN UP
            </motion.button>
          </div>
        </motion.div>

        {/* Banner Image */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Image
            src="/mainImage.jpg"
            alt="Creative Banner"
            width={1024}
            height={576}
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Forms */}
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
      {showSignup && <SignupForm onClose={() => setShowSignup(false)} />}
    </div>
  );
}
