import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';

export default function AnimatedCount({ value }) {
  const [display, setDisplay] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  useEffect(() => {
    let start = display;
    let end = value;
    if (start === end) return;
    let raf;
    const step = () => {
      start += (end - start) / 8;
      if (Math.abs(end - start) < 1) {
        setDisplay(end);
        return;
      }
      setDisplay(Math.round(start));
      raf = requestAnimationFrame(step);
    };
    step();
    return () => raf && cancelAnimationFrame(raf);
  }, [value]);
  return <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'var(--font-poppins)' }}>{hasMounted ? Math.round(display) : value}%</Typography>;
} 