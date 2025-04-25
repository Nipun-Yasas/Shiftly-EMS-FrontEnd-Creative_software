'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignuUpFrom';
import mainImage from '../../../public/mainImage.png';

export default function Dashboard() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background  collage */}
      <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 z-0 overflow-hidden">
      {Array.from({ length: 15 }).map((_, index) => {
        const top = Math.floor(Math.random() * 90); 
        const left = Math.floor(Math.random() * 90); 
        const size = 100 + Math.floor(Math.random() * 200); 
        const rotate = Math.floor(Math.random() * 30) - 15; 

      return (
      <div
        key={index}
        className="absolute opacity-30 rounded-lg overflow-hidden"
        style={{
          top: `${top}vh`,
          left: `${left}vw`,
          width: `${size}px`,
          height: `${size}px`,
          transform: `rotate(${rotate}deg)`,
        }}
        >
          <Image
            src={`/placeholder/thumb-${(index % 5) + 1}.jpg`}
            alt={`Thumb ${index + 1}`}
            fill
            className="object-cover"
          />
      </div>
       );
  })}

  
</div>

        
        
      </div>

      {/* Foreground content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative bg-black/85 backdrop-blur-md rounded-3xl w-full max-w-5xl overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-red-400 opacity-20 rounded-lg blur-3xl animate-pulse z-0"></div>

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
              <h6
                  style={{
                    color:'white',
                    opacity:'0.4',
                    fontFamily: 'var(--font-poppins)',
                    whiteSpace: 'nowrap', 
                    fontSize: '0.963rem', 
                    
                  }}
              >Employee Management System</h6>


              
            </motion.div>

            
           
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Image
              src={mainImage}
              alt="Creative Banner"
              width={1024}
              height={576}
              className="w-full h-auto object-cover opacity-80"
            />
          </motion.div>


         {/*buttons*/}
         <div
              style={{
                padding:'0px 0px 50px 20px',
                alignItems:'bottom-left',
                margin:'0px 10px 10px 600px'
              }}
              className="space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 text-black font-bold px-5 py-2 rounded-md"
                onClick={() => setShowLogin(true)}
              >
                LOGIN
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-black/80 text-white px-5 py-2 rounded-md"
                onClick={() => setShowSignup(true)}
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
