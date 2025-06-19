// @ts-nocheck
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ onMenuClick }) {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Budget Manager
        </Typography>
        <IconButton color="inherit" onClick={handleMenu}>
          <AccountCircle />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              handleClose();
              setOpenProfile(true);
            }}
          >
            My Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              logout();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
        <Drawer anchor="right" open={openProfile} onClose={() => setOpenProfile(false)}>
          <Box sx={{ width: 250, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              My Profile
            </Typography>
            <Typography variant="body2">Profile details go here.</Typography>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
