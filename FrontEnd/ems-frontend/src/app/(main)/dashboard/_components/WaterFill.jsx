import { Box } from '@mui/material';
import { useState, useEffect } from 'react';

export default function WaterFill({ progress }) {
  const [level, setLevel] = useState(progress);
  const [waveOffset, setWaveOffset] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  useEffect(() => {
    let frame;
    const animate = () => {
      setLevel(prev => (Math.abs(prev - progress) < 1 ? progress : prev + (progress - prev) / 8));
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => frame && cancelAnimationFrame(frame);
  }, [progress]);
  useEffect(() => {
    let raf;
    const animateWave = () => {
      setWaveOffset(prev => (prev + 2) % 400);
      raf = requestAnimationFrame(animateWave);
    };
    animateWave();
    return () => raf && cancelAnimationFrame(raf);
  }, []);
  const height = `${level}%`;
  const wavePath = `M0,24 Q50,${28 + 4 * Math.sin((waveOffset + 0) * 0.03)} 100,24 T200,24 T300,24 T400,24 V32 H0 Z`;
  if (!hasMounted) {
    // Render static fill for SSR
    return (
      <Box sx={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: `${progress}%`, zIndex: 1, pointerEvents: 'none', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <svg width="100%" height="32" viewBox="0 0 400 32" preserveAspectRatio="none" style={{ position: 'absolute', top: -16, left: 0, width: '100%', height: 32 }}>
          <defs><linearGradient id="pinkWaterGradient" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stopColor="#ff80ab" /><stop offset="100%" stopColor="#ffd6e0" /></linearGradient></defs>
          <path d="M0,24 Q50,32 100,24 T200,24 T300,24 T400,24 V32 H0 Z" fill="url(#pinkWaterGradient)" opacity="0.7" />
        </svg>
        <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(0deg, #ff80ab 0%, #ffd6e0 100%)', opacity: 0.18 }} />
      </Box>
    );
  }
  return (
    <Box sx={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height, zIndex: 1, transition: 'height 1s cubic-bezier(.4,2,.6,1)', pointerEvents: 'none', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
      <svg width="100%" height="32" viewBox="0 0 400 32" preserveAspectRatio="none" style={{ position: 'absolute', top: -16, left: 0, width: '100%', height: 32 }}>
        <defs><linearGradient id="pinkWaterGradient" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stopColor="#ff80ab" /><stop offset="100%" stopColor="#ffd6e0" /></linearGradient></defs>
        <path d={wavePath} fill="url(#pinkWaterGradient)" opacity="0.7" />
      </svg>
      <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(0deg, #ff80ab 0%, #ffd6e0 100%)', opacity: 0.18 }} />
    </Box>
  );
} 