// @ts-nocheck
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import api from '../api';

interface Props {
  onSubmit?: (data: { role: string; level: string; rate: number }) => void;
  initial?: { role?: string; level?: string; rate?: number };
  submitText?: string;
}

export default function BudgetForm({ onSubmit, initial, submitText = 'Create' }: Props) {
  const [role, setRole] = useState(initial?.role || '');
  const [level, setLevel] = useState(initial?.level || '');
  const [rate, setRate] = useState(initial?.rate != null ? String(initial.rate) : '');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    setRole(initial?.role || '');
    setLevel(initial?.level || '');
    setRate(initial?.rate != null ? String(initial.rate) : '');
  }, [initial]);

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
        {submitText}
      </Button>
    </Box>
  );
}
