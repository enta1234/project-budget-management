// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { Layout, useToast, PageBreadcrumbs } from '../../components';
import { withAuth, useAuth } from '../../context/AuthContext';
import {
  fetchRoles,
  createRole,
  addLevel,
  removeLevel,
} from '../../models/roleModel';

function RoleSetting() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [levelInputs, setLevelInputs] = useState({});

  async function loadData() {
    const data = await fetchRoles();
    setRoles(data);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleCreateRole = async () => {
    try {
      await createRole({ name: newRole });
      showToast('Role created');
      setNewRole('');
      loadData();
    } catch (e) {
      showToast('Error creating role', { severity: 'error' });
    }
  };

  const handleAddLevel = async roleId => {
    const level = levelInputs[roleId];
    if (!level) return;
    try {
      await addLevel(roleId, level);
      showToast('Level added');
      setLevelInputs({ ...levelInputs, [roleId]: '' });
      loadData();
    } catch (e) {
      showToast('Error adding level', { severity: 'error' });
    }
  };

  const handleRemoveLevel = async (roleId, level) => {
    if (!window.confirm('Remove this level?')) return;
    try {
      await removeLevel(roleId, level);
      showToast('Level removed');
      loadData();
    } catch (e) {
      showToast('Error removing level', { severity: 'error' });
    }
  };

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Role Setting
        </Typography>
        <PageBreadcrumbs items={[{ label: 'Role Setting' }]} />
        <Typography variant="body2" sx={{ mb: 2 }}>
          Manage your roles and their levels. Press Enter or click Add to save. Click a level chip to remove it.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            label="New Role"
            placeholder="Enter role name"
            value={newRole}
            onChange={e => setNewRole(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleCreateRole();
            }}
            size="small"
          />
          <Button variant="contained" onClick={handleCreateRole}>
            Add
          </Button>
        </Box>
        {roles.length === 0 && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            No roles defined yet. Add one above.
          </Typography>
        )}
        {roles.map(r => (
          <Paper key={r._id} sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6">{r.name}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {r.levels.map(level => (
                <Chip
                  key={level}
                  label={level}
                  onClick={() => handleRemoveLevel(r._id, level)}
                  onDelete={() => handleRemoveLevel(r._id, level)}
                />
              ))}
            </Stack>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField
                label="New Level"
                placeholder="Enter level name"
                size="small"
                value={levelInputs[r._id] || ''}
                onChange={e =>
                  setLevelInputs({ ...levelInputs, [r._id]: e.target.value })
                }
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddLevel(r._id);
                }}
              />
              <Button variant="outlined" onClick={() => handleAddLevel(r._id)}>
                Add Level
              </Button>
            </Box>
          </Paper>
        ))}
      </Container>
    </Layout>
  );
}

export default withAuth(RoleSetting);
