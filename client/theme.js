import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#89A8B2',
    },
    secondary: {
      main: '#B3C8CF',
    },
    background: {
      default: '#F1F0E8',
      paper: '#E5E1DA',
    },
  },
  typography: {
    fontFamily: '"Fira Code", monospace',
  },
});

export default theme;
