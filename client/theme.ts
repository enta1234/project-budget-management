// @ts-nocheck
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    // GitHub inspired colour scheme
    primary: {
      main: '#24292e', // dark header grey
      contrastText: '#fff',
    },
    secondary: {
      main: '#0969da', // link blue
    },
    background: {
      default: '#f6f8fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Fira Code", monospace',
  },
});

export default theme;
