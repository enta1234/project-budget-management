// @ts-nocheck
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import { Input } from '.';

const positions = [
  { value: 'project_manager_sr', label: 'Project Manager - Senior' },
  { value: 'project_manager_inter', label: 'Project Manager - Intermediate' },
  { value: 'project_manager_jr', label: 'Project Manager - Junior' },
  { value: 'sa_sr', label: 'System Analyst - Senior' },
  { value: 'sa_inter', label: 'System Analyst - Intermediate' },
  { value: 'sa_jr', label: 'System Analyst - Junior' },
  { value: 'pa_sr', label: 'PA - Senior' },
  { value: 'pa_inter', label: 'PA - Intermediate' },
  { value: 'pa_jr', label: 'PA - Junior' },
  { value: 'qa_sr', label: 'QA - Senior' },
  { value: 'qa_inter', label: 'QA - Intermediate' },
  { value: 'qa_jr', label: 'QA - Junior' },
];

export default function ResourceForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [startDate, setStartDate] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ name, email, position, startDate });
    }
    setName('');
    setEmail('');
    setPosition('');
    setStartDate(null);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
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
