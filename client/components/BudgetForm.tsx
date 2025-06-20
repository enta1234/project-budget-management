// @ts-nocheck
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import api from '../api';

export default function BudgetForm({ onSubmit }) {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [rate, setRate] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/api/v1/roles');
      setRoles(data);
    }
    load();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ role, level, rate: Number(rate) });
    }
    setRole('');
    setLevel('');
    setRate('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField select label="Role" value={role} onChange={e => setRole(e.target.value)} required>
        {roles.map(r => (
          <MenuItem key={r.name} value={r.name}>
            {r.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField select label="Level" value={level} onChange={e => setLevel(e.target.value)} required>
        {(roles.find(r => r.name === role)?.levels || []).map(l => (
          <MenuItem key={l} value={l}>
            {l}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Baht / MD"
        type="number"
        value={rate}
        onChange={e => setRate(e.target.value)}
        required
      />
      <Button variant="contained" type="submit">
        Create
      </Button>
    </Box>
  );
}
