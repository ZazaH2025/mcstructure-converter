/**
 * Material-UI Theme Configuration
 * 
 * This file defines the global theme for Material-UI components used throughout the app.
 * The theme controls colors, typography, spacing, and other design tokens.
 * You can customize the palette, typography, and component styling here.
 */

import { createTheme } from '@mui/material/styles';

// Create a custom Material-UI theme
// Currently using default Material-UI theme settings
// You can customize colors, fonts, spacing, and more here
const theme = createTheme({
  palette: {
    // Custom color palette can be defined here
    // Example:
    // primary: { main: '#1976d2' },
    // secondary: { main: '#dc004e' },
  }
});

export default theme;
