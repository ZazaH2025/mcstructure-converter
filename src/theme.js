/**
 * Material-UI Theme Configuration
 * 
 * This file defines the global theme for Material-UI components used throughout the app.
 * The theme controls colors, typography, spacing, and other design tokens.
 * 
 * Color Palette:
 * - Primary: Minecraft grass green (#4CAF50)
 * - Secondary: Minecraft stone gray (#607D8B)
 * - Accents: Diamond blue, gold, redstone red
 */

import { createTheme } from '@mui/material/styles';

// Create a custom Material-UI theme with Minecraft-inspired colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',      // Minecraft grass green
      light: '#81C784',     // Lighter green
      dark: '#388E3C',      // Darker green
      contrastText: '#fff',
    },
    secondary: {
      main: '#607D8B',      // Stone gray
      light: '#90A4AE',
      dark: '#455A64',
      contrastText: '#fff',
    },
    success: {
      main: '#66BB6A',      // Success green
    },
    warning: {
      main: '#FFA726',      // Gold/amber
    },
    error: {
      main: '#EF5350',      // Redstone red
    },
    info: {
      main: '#42A5F5',      // Diamond blue
    },
    background: {
      default: '#f5f5f5',   // Light gray background
      paper: '#ffffff',     // White for cards/papers
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
    button: {
      textTransform: 'none',  // Don't uppercase buttons
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,  // Rounded corners
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.12)',
    '0 8px 16px rgba(0,0,0,0.14)',
    '0 12px 24px rgba(0,0,0,0.16)',
    '0 16px 32px rgba(0,0,0,0.18)',
    '0 20px 40px rgba(0,0,0,0.20)',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.12)',
    '0 8px 16px rgba(0,0,0,0.14)',
    '0 12px 24px rgba(0,0,0,0.16)',
    '0 16px 32px rgba(0,0,0,0.18)',
    '0 20px 40px rgba(0,0,0,0.20)',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.12)',
    '0 8px 16px rgba(0,0,0,0.14)',
    '0 12px 24px rgba(0,0,0,0.16)',
    '0 16px 32px rgba(0,0,0,0.18)',
    '0 20px 40px rgba(0,0,0,0.20)',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.12)',
    '0 8px 16px rgba(0,0,0,0.14)',
    '0 12px 24px rgba(0,0,0,0.16)',
    '0 16px 32px rgba(0,0,0,0.18)',
    '0 20px 40px rgba(0,0,0,0.20)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.95rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  },
});

export default theme;
