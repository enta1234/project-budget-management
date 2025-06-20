// @ts-nocheck
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from 'react';
import { Input } from '.';
import api from '../api';

export default function ResourceForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [positions, setPositions] = useState([]);
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    async function loadPositions() {
      const { data } = await api.get('/api/v1/positions');
      setPositions(data);
    }
    loadPositions();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const found = positions.find(
      p => p.label === `${role} - ${level}`,
    );
    const position = found ? found.value : '';
    if (onSubmit) {
      onSubmit({ name, email, position, startDate });
    }
    setName('');
    setEmail('');
    setRole('');
    setLevel('');
    setStartDate(null);
  }

  const roles = Array.from(new Set(positions.map(p => p.label.split(' - ')[0])));
  const levels = Array.from(new Set(positions.map(p => p.label.split(' - ')[1])));

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <TextField select label="Role" value={role} onChange={e => setRole(e.target.value)} required>
        {roles.map(r => (
          <MenuItem key={r} value={r}>
            {r}
          </MenuItem>
        ))}
      </TextField>
      <TextField select label="Level" value={level} onChange={e => setLevel(e.target.value)} required>
        {levels.map(l => (
          <MenuItem key={l} value={l}>
            {l}
          </MenuItem>
        ))}
      </TextField>
      <DatePicker
        label="Service Start Date"
        value={startDate}
        onChange={setStartDate}
        renderInput={params => <TextField {...params} required />}
      />
      <Button variant="contained" type="submit">Create</Button>
    </Box>
  );
}
