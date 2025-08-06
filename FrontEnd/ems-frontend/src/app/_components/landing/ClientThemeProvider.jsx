'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../../../theme';

export default function ClientThemeProvider({ children }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true);
    const html = document.documentElement;
    html.setAttribute("data-toolpad-color-scheme", "light");
   }, []);
  if (!hasMounted) return null;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 