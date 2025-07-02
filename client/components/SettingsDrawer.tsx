// @ts-nocheck
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  fetchSettings,
  updateCostMultiplier,
  resetAdminPassword,
} from '../models/settingsModel';

export default function SettingsDrawer({ open, onClose }) {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [cost, setCost] = useState('1');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!open || !token) return;
    fetchSettings()
      .then(data => {
        if (data?.costMultiplier != null) {
          setCost(String(data.costMultiplier));
        }
      })
      .catch(console.error);
  }, [open, token]);

  const handleSaveCost = async () => {
    try {
      await updateCostMultiplier(Number(cost));
      showToast('Cost multiplier saved');
    } catch (e) {
      showToast('Error saving', { severity: 'error' });
    }
  };

  const handleReset = async () => {
    try {
      await resetAdminPassword(password);
      setPassword('');
      showToast('Password updated');
    } catch (e) {
      showToast('Error updating password', { severity: 'error' });
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: (t) => t.zIndex.modal + 2 }}
    >
      <Box sx={{ width: 300, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1">Cost Multiplier</Typography>
          <TextField
            size="small"
            type="number"
            label="Multiplier"
            value={cost}
            onChange={e => setCost(e.target.value)}
            sx={{ mr: 1, width: 120 }}
            inputProps={{ step: '0.01', min: '0', max: '1' }}
          />
          <Button variant="contained" onClick={handleSaveCost}>
            Save
          </Button>
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1">Reset Admin Password</Typography>
          <TextField
            size="small"
            type="password"
            label="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            sx={{ mr: 1, width: 200 }}
          />
          <Button variant="contained" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
