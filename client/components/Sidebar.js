import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
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
        [`& .MuiDrawer-paper`]: { width, boxSizing: 'border-box' },
      }}
    >
      <List>
        <ListItem button onClick={() => setCollapsed(!collapsed)}>
          <ListItemIcon>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Collapse" />}
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => router.push('/workspace')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Summary" />}
        </ListItem>
        <ListItem button onClick={() => router.push('/project-installation')}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Project Installation" />}
        </ListItem>
        <ListItem button onClick={() => router.push('/team-setting')}>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Team Setting" />}
        </ListItem>
      </List>
    </Drawer>
  );
}
