// @ts-nocheck
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Head from 'next/head';
import theme from '../theme';
import { AuthProvider } from '../context/AuthContext';
import { SidebarProvider } from '../context/SidebarContext';
import { ToastProvider } from '../components';
import '../styles/globals.scss';

export default function MyApp({ Component, pageProps }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Head>
          <title>Project Budget Management</title>
        </Head>
        <AuthProvider>
          <SidebarProvider>
            <ToastProvider>
              <Component {...pageProps} />
            </ToastProvider>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
