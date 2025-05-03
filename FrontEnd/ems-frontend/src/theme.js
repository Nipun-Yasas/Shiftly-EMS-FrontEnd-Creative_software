'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#E90A4D",
          light: "#E90A4D",
          dark: "#E90A4D",
          contrastText: "#fff"
        },
        secondary: {
          main: "#E80A4D",
          light: "#E80A4D",
          dark: "#E80A4D",
          contrastText: "#fff"
        },
        error: {
          main: "#d32f2f",
          light: "#ef5350",
          dark: "#c62828",
          contrastText: "#fff"
        },
        warning: {
          main: "#ed6c02",
          light: "#ff9800",
          dark: "#e65100",
          contrastText: "#fff"
        },
        info: {
          main: "#0288d1",
          light: "#03a9f4",
          dark: "#01579b",
          contrastText: "#fff"
        },
        success: {
          main: "#2e7d32",
          light: "#4caf50",
          dark: "#1b5e20",
          contrastText: "#fff"
        },
      }
    },
    dark: {
      palette: {
        primary: {
          main: "#E90A4D",
          light: "#E90A4D",
          dark: "#E90A4D",
          contrastText: "#fff"
        },
        secondary: {
          main: "#E80A4D",
          light: "#E80A4D",
          dark: "#E80A4D",
          contrastText: "#fff"
        },
        error: {
          main: "#f44336",
          light: "#e57373",
          dark: "#d32f2f",
          contrastText: "#fff"
        },
        warning: {
          main: "#ffa726",
          light: "#ffb74d",
          dark: "#f57c00",
          contrastText: "rgba(0, 0, 0, 0.87)"
        },
        info: {
          main: "#29b6f6",
          light: "#4fc3f7",
          dark: "#0288d1",
          contrastText: "rgba(0, 0, 0, 0.87)"
        },
        success: {
          main: "#66bb6a",
          light: "#81c784",
          dark: "#388e3c",
          contrastText: "rgba(0, 0, 0, 0.87)"
        }
      },
    }
  },

  components: {

  },
  typography: {
    fontFamily: 'Lexend, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
      color: '#E90A4D',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
      color: '#E90A4D',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
      color: '#E90A4D',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
      color: '#E90A4D',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
      color: '#E90A4D',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
      color: '#E90A4D',
    },
  },
});

export default theme;
