// @ts-nocheck
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openPlanMgmt, setOpenPlanMgmt] = useState(false);
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
          selected={router.pathname.startsWith('/summary')}
          onClick={() => setOpenDashboard(!openDashboard)}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          {!collapsed && (
            <>
              <ListItemText primary="Dashboard" />
              {openDashboard ? <ExpandLess /> : <ExpandMore />}
            </>
          )}
        </ListItemButton>
        {!collapsed && (
          <Collapse in={openDashboard} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={router.pathname === '/summary/detail'}
                onClick={() => {
                  router.push('/summary/detail');
                  onClose();
                }}
              >
                <ListItemIcon>
                  <DashboardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Detail" />
              </ListItemButton>
            </List>
          </Collapse>
        )}
        <ListItemButton
          selected={router.pathname.startsWith('/plan-management')}
          onClick={() => setOpenPlanMgmt(!openPlanMgmt)}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          {!collapsed && (
            <>
              <ListItemText primary="Plan Management" />
              {openPlanMgmt ? <ExpandLess /> : <ExpandMore />}
            </>
          )}
        </ListItemButton>
        {!collapsed && (
          <Collapse in={openPlanMgmt} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={router.pathname === '/plan-management'}
                onClick={() => {
                  router.push('/plan-management');
                  onClose();
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Overview" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={router.pathname === '/plan-management/planing-setting'}
                onClick={() => {
                  router.push('/plan-management/planing-setting');
                  onClose();
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Planing Setting" />
              </ListItemButton>
            </List>
          </Collapse>
        )}
        <ListItemButton
          selected={router.pathname === '/project-management'}
          onClick={() => {
            router.push('/project-management');
            onClose();
          }}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Project Management" />}
        </ListItemButton>
        <ListItemButton
          selected={router.pathname === '/budget-management'}
          onClick={() => {
            router.push('/budget-management');
            onClose();
          }}
        >
          <ListItemIcon>
            <AttachMoneyIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Budget Management" />}
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
