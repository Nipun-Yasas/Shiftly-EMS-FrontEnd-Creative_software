'use client';
import { createTheme } from '@mui/material/styles';

import { outlinedInputClasses } from '@mui/material/OutlinedInput';

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
          contrastText: "#0000"
        },
        error: {
          main: "#F44336",
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
        textblack:{
          main: '#000000',
          contrastText: '#ffffff',
        }
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
          main: "#F44336",
          light: "#ef5350",
          dark: "#c62828",
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
        },
        textblack: {
          main: '#ffffff',
          contrastText: '#000000',
        },
        textblack:{
          main: '#ffffff',
          contrastText: '#000000',
        }
      },
    },
  },
  components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-borderColor': '#E0E3E7',
            '--TextField-borderHoverColor': '#E90A4D',
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: 'var(--TextField-borderColor)',
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-borderHoverColor)',
            },
            
          }
        }
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            '&::before, &::after': {
              borderBottom: '2px solid var(--TextField-borderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-borderHoverColor)',
            }
          }
        }
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&::before': {
              borderBottom: '2px solid var(--TextField-borderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-borderHoverColor)',
            }
          }
        }
      }
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
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
    },
     h7: {
      fontSize: '1rem',
      fontWeight: 600,
      fontFamily: 'Poppins, sans-serif',
    },
  },
});

export default theme;
