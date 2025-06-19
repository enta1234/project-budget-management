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

const drawerWidth = 200;

export default function Sidebar({ open, onClose }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const width = collapsed ? 60 : drawerWidth;

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid #d0d7de',
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
          onClick={() => router.push('/workspace')}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Summary" />}
        </ListItemButton>
        <ListItemButton
          selected={router.pathname === '/project-installation'}
          onClick={() => router.push('/project-installation')}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Project Installation" />}
        </ListItemButton>
        <ListItemButton
          selected={router.pathname === '/team-setting'}
          onClick={() => router.push('/team-setting')}
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
