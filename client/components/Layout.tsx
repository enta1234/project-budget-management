// @ts-nocheck
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { useSidebar } from '../context/SidebarContext';

export default function Layout({ children }) {
  const { open: sidebarOpen, toggleSidebar, setOpen } = useSidebar();

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar onMenuClick={handleToggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={() => setOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '90%', mx: 'auto' }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
