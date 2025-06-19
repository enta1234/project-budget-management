// @ts-nocheck
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { useState } from 'react';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar onMenuClick={() => setOpen(!open)} />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
