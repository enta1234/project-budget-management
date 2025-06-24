// @ts-nocheck
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from 'react';
import { Input } from '.';

export default function WorkdayForm({ onSubmit, initial, submitText = 'Create' }) {
  const [name, setName] = useState(initial?.name || '');
  const [date, setDate] = useState(initial?.date ? new Date(initial.date) : null);

  useEffect(() => {
    setName(initial?.name || '');
    setDate(initial?.date ? new Date(initial.date) : null);
  }, [initial]);

  const handleSubmit = e => {
    e.preventDefault();
    if (onSubmit && date) {
      onSubmit({ name, date });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
      <DatePicker label="Date" value={date} onChange={setDate} slotProps={{ textField: { required: true } }} />
      <Button variant="contained" type="submit">
        {submitText}
      </Button>
    </Box>
  );
}
