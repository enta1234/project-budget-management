// @ts-nocheck
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import api from '../api';

export default function BudgetForm({ onSubmit }) {
  const [position, setPosition] = useState('');
  const [rate, setRate] = useState('');
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/api/v1/positions');
      setPositions(data);
    }
    load();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ position, rate: Number(rate) });
    }
    setPosition('');
    setRate('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        select
        label="Position"
        value={position}
        onChange={e => setPosition(e.target.value)}
        required
      >
        {positions.map(p => (
          <MenuItem key={p.value} value={p.value}>
            {p.label}
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
