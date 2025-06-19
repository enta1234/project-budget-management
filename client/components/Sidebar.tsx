// @ts-nocheck
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import { useRouter } from 'next/router';
import { useState } from 'react';

// width when sidebar is expanded
const drawerWidth = 220;

export default function Sidebar({ open, onClose }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // width to use when sidebar is collapsed
  const width = collapsed ? 72 : drawerWidth;

  return (
    <Drawer
      anchor="left"
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        [`& .MuiDrawer-paper`]: {
          width,
          boxSizing: 'border-box',
          bgcolor: 'background.default',
          borderRight: '1px solid #d0d7de',
          height: '100vh',
        },
      }}
    >
      <Toolbar />
      <List>
        <ListItemButton onClick={() => setCollapsed(!collapsed)}>
          <ListItemIcon>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Collapse" />}
        </ListItemButton>
      </List>
      <Divider />
      <List>
        <ListItemButton
          selected={router.pathname === '/workspace'}
          onClick={() => {
            router.push('/workspace');
            onClose();
          }}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Summary" />}
        </ListItemButton>
        <ListItemButton
          selected={router.pathname === '/project-installation'}
          onClick={() => {
            router.push('/project-installation');
            onClose();
          }}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Project Installation" />}
        </ListItemButton>
        <ListItemButton
          selected={router.pathname === '/team-setting'}
          onClick={() => {
            router.push('/team-setting');
            onClose();
          }}
        >
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Team Setting" />}
        </ListItemButton>
      </List>
    </Drawer>
  );
}
