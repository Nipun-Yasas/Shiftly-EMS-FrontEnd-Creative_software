'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
    cssVariables: true,
  },
  palette: {
    primary: {
      main: '#E80A4D', // Shiftly's brand color (Pinkish Red)
    },
    secondary: {
      main: '#4D4D4D', // Dark Gray
    },
    background: {
      default: '#FFFFFF', // White background
    },
    text: {
      primary: '#4D4D4D', // Dark Gray text
    },
  },
});

export default theme;
