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
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { useRouter } from 'next/router';
import { useState } from 'react';

// width when sidebar is expanded
const drawerWidth = 220;

export default function Sidebar({ open, onClose }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [openTeamMgmt, setOpenTeamMgmt] = useState(false);

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
          {!collapsed && <ListItemText primary="Project Management" />}
        </ListItemButton>
        <ListItemButton
          selected={router.pathname.startsWith('/team-setting')}
          onClick={() => setOpenTeamMgmt(!openTeamMgmt)}
        >
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          {!collapsed && (
            <>
              <ListItemText primary="Team Management" />
              {openTeamMgmt ? <ExpandLess /> : <ExpandMore />}
            </>
          )}
        </ListItemButton>
        {!collapsed && (
          <Collapse in={openTeamMgmt} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={router.pathname === '/team-setting'}
                onClick={() => router.push('/team-setting')}
              >
                <ListItemIcon>
                  <GroupIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Resource" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={router.pathname === '/team-setting/team'}
                onClick={() => router.push('/team-setting/team')}
              >
                <ListItemIcon>
                  <GroupIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Team" />
              </ListItemButton>
            </List>
          </Collapse>
        )}
      </List>
    </Drawer>
  );
}
