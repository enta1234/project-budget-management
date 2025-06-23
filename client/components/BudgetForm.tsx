// @ts-nocheck
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { Input } from '.';

interface Props {
  onSubmit?: (data: { role: string; level: string; rate: number }) => void;
  initial?: { role?: string; level?: string; rate?: number };
  submitText?: string;
}

export default function BudgetForm({ onSubmit, initial, submitText = 'Create' }: Props) {
  const [role, setRole] = useState(initial?.role || '');
  const [level, setLevel] = useState(initial?.level || '');
  const [rate, setRate] = useState(initial?.rate != null ? String(initial.rate) : '');

  useEffect(() => {
    setRole(initial?.role || '');
    setLevel(initial?.level || '');
    setRate(initial?.rate != null ? String(initial.rate) : '');
  }, [initial]);

  const handleSubmit = e => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ role, level, rate: Number(rate) });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      }}
    >
      <Input label="Role" value={role} onChange={e => setRole(e.target.value)} required />
      <Input label="Level" value={level} onChange={e => setLevel(e.target.value)} required />
      <Input
        label="Baht / MD"
        type="number"
        value={rate}
        onChange={e => setRate(e.target.value)}
        required
      />
      <Button variant="contained" type="submit" sx={{ gridColumn: 'span 2' }}>
        {submitText}
      </Button>
    </Box>
  );
}
