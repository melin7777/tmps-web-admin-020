'use client';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7c3aed',
    },
    secondary: {
      main: '#10b981',
    },
  },
});

export default function CustomThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}