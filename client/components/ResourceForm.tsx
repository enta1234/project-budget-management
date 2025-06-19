// @ts-nocheck
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { Input } from '.';

export default function ResourceForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    alert(`Created resource ${name}`);
    setName('');
    setEmail('');
    setPosition('');
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Add Resource</Typography>
      <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <Input label="Position" value={position} onChange={e => setPosition(e.target.value)} required />
      <Button variant="contained" type="submit">Create</Button>
    </Box>
  );
}
