'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../../../theme';

export default function ClientThemeProvider({ children }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  if (!hasMounted) return null;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 