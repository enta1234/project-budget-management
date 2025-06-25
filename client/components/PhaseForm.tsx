// @ts-nocheck
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function PhaseForm({ onSubmit, initial }) {
  const [name, setName] = useState(initial?.name || '');
  const [order, setOrder] = useState(initial?.order != null ? String(initial.order) : '');

  useEffect(() => {
    setName(initial?.name || '');
    setOrder(initial?.order != null ? String(initial.order) : '');
  }, [initial]);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit && onSubmit({ name, ...(order ? { order: Number(order) } : {}) });
    setName('');
    setOrder('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <TextField label="Order" type="number" value={order} onChange={e => setOrder(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <Button type="submit" variant="contained">{initial ? 'Update' : 'Create'}</Button>
    </form>
  );
}
