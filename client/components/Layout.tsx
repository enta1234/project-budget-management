// @ts-nocheck
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
