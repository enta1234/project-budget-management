// @ts-nocheck
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { useState } from 'react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar onMenuClick={handleToggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={handleToggleSidebar} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
