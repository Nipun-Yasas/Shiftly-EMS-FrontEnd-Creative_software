'use client';
import { createTheme } from '@mui/material/styles';

import { outlinedInputClasses } from '@mui/material/OutlinedInput';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  defaultColorScheme: 'light',
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
          light: "#ff908eff",
          dark: "#c62828",
          contrastText: "#ffffff"
        },
        warning: {
          main: "#ed6c02",
          light: "#ffd79aff",
          dark: "#e65100",
          contrastText: "#ffffff"
        },
        info: {
          main: "#0288d1",
          light: "#acd4ffff",
          dark: "#01579b",
          contrastText: "#ffffff"
        },
        success: {
          main: "#2e7d32",
          light: "#73e177ff",
          dark: "#1b5e20",
          contrastText: "#ffffff"
        },
        textblack: {
          main: '#000000',
          light: '#000000',
          dark: '#000000',
          contrastText: '#ffffff',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#4D4D4D',
        },
        avatarname: {
          main: '#1A3C5E',
          contrastText: '#ffffff',
        },
        viewButton: {
          main: '#FFF1F2',
          contrastText: '#ffffff',
        },
        background: {
          default: '#fafafa',
          paper: '#fff',
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
          main: "#F44336",
          light: "#ef5350",
          dark: "#c62828",
          contrastText: "#000000"
        },
        warning: {
          main: "#ffa726",
          light: "#ffb74d",
          dark: "#f57c00",
          contrastText: "#000000"
        },
        info: {
          main: "#29b6f6",
          light: "#4fc3f7",
          dark: "#0288d1",
          contrastText: "#000000"
        },
        success: {
          main: "#66bb6a",
          light: "#81c784",
          dark: "#388e3c",
          contrastText: "#000000"
        },
        textblack: {
          main: '#ffffff',
          light: '#ffffff',
          dark: '#ffffff',
          contrastText: '#000000',
        },
        avatarname: {
          main: '#F5F7FA',
          contrastText: '#ffffff',
        },
        viewButton: {
          main: '#FFC1DA',
          contrastText: '#ffffff',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
        },
        background: {
          default: '#181a20',
          paper: '#232323',
        },
      }
    },
  },
  components: {
    MuiButton: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      }
    }
  },
  MuiTab: {
    styleOverrides: {
      root: {
        fontFamily: 'var(--font-lexend)',
        fontWeight: 500,
        textTransform: 'none',
        '&.Mui-selected': {
          fontWeight: 600,
        }
      }
    }
  },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '--DataGrid-borderColor': '#000000',
          '[data-toolpad-color-scheme="dark"] &': {
            '--DataGrid-borderColor': '#E0E3E7', 
          },
          border: '1px solid var(--DataGrid-borderColor)',
          borderRadius: '10px',
        },
        columnHeaders: {
          borderBottom: '1px solid var(--DataGrid-borderColor)',
           '& .MuiDataGrid-columnHeader.last-column .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
        },
        cell: {
          borderBottom: '1px solid var(--DataGrid-borderColor)',
        },
        columnSeparator: {
          color: 'var(--DataGrid-borderColor)',
        },
        iconSeparator: {
          color: 'var(--DataGrid-borderColor)',
        },
        footerContainer: {
          '& .MuiSvgIcon-root': {
            color: 'var(--DataGrid-borderColor)'
          },
        },
      },
    },
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
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '[data-toolpad-color-scheme="dark"] &': {
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '[data-toolpad-color-scheme="dark"] &': {
            '& .MuiTableRow-root': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          '[data-toolpad-color-scheme="dark"] &': {
            '&[data-weekly-summary="true"]': {
              backgroundColor: 'transparent !important',
            },
            '&[style*="background-color: rgb(245, 245, 245)"]': {
              backgroundColor: 'transparent !important',
            },
          },
        },
      },
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
    fontSize: 14,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      fontFamily: 'var(--font-poppins)',
      color: '#E90A4D',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      fontFamily: 'var(--font-poppins)',
      color: '#E90A4D',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      fontFamily: 'var(--font-poppins)',
      color: '#E90A4D',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      fontFamily: 'var(--font-poppins)',
      color: '#E90A4D',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 700,
      fontFamily: 'var(--font-poppins)',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
      fontFamily: 'var(--font-poppins)',
    }
  },
});

export default theme;