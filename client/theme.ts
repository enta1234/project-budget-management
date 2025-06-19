// @ts-nocheck
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E90FF', // bright blue
    },
    secondary: {
      main: '#00008B', // dark blue
    },
    background: {
      default: '#E0F7FF',
      paper: '#B0C4DE',
    },
  },
  typography: {
    fontFamily: '"Fira Code", monospace',
  },
});

export default theme;
