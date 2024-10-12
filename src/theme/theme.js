// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize your primary color
    },
    secondary: {
      main: '#dc004e', // Customize your secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    // Customize other typography styles as needed
  },
});

export default theme;
