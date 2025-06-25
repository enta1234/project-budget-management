// @ts-nocheck
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function MilestoneForm({ onSubmit, initial, existingDates = [] }) {
  const [name, setName] = useState(initial?.name || '');
  const [date, setDate] = useState(initial?.date || null);

  useEffect(() => {
    setName(initial?.name || '');
    setDate(initial?.date || null);
  }, [initial]);

  const handleSubmit = e => {
    e.preventDefault();
    if (date && existingDates.includes(new Date(date).toDateString())) {
      alert('Milestone date overlaps existing one');
      return;
    }
    onSubmit && onSubmit({ name, date });
    setName('');
    setDate(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <DatePicker label="Date" value={date} onChange={setDate} slotProps={{ textField: { required: true } }} />
      <Button type="submit" variant="contained" sx={{ display: 'block', mt: 2 }}>
        {initial ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
