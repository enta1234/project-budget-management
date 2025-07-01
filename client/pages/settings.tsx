// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Layout, PageBreadcrumbs, useToast } from '../components';
import { withAuth, useAuth } from '../context/AuthContext';
import {
  fetchSettings,
  updateCostMultiplier,
  resetAdminPassword,
} from '../models/settingsModel';

function SettingsPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [cost, setCost] = useState('1');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchSettings()
      .then(data => {
        if (data?.costMultiplier != null) {
          setCost(String(data.costMultiplier));
        }
      })
      .catch(console.error);
  }, [token]);

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
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
        <PageBreadcrumbs items={[{ label: 'Settings' }]} />
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Cost Multiplier</Typography>
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
          <Typography variant="h6">Reset Admin Password</Typography>
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
      </Container>
    </Layout>
  );
}

export default withAuth(SettingsPage);
