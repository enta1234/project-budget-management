// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function MilestoneForm({ onSubmit, initial, existingDates = [] }) {
  const [name, setName] = useState(initial?.name || '');
  const [date, setDate] = useState(initial?.date || null);
  const [detail, setDetail] = useState(initial?.detail || '');

  useEffect(() => {
    setName(initial?.name || '');
    setDate(initial?.date || null);
    setDetail(initial?.detail || '');
  }, [initial]);

  const dateError = useMemo(
    () =>
      !!(
        date && existingDates.includes(new Date(date).toDateString())
      ),
    [date, existingDates],
  );

  const formValid = useMemo(
    () => name.trim() !== '' && !!date && !dateError,
    [name, date, dateError],
  );

  const handleSubmit = e => {
    e.preventDefault();
    if (!formValid) return;
    onSubmit && onSubmit({ name, date, detail });
    setName('');
    setDate(null);
    setDetail('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <TextField label="Detail" value={detail} onChange={e => setDetail(e.target.value)} fullWidth multiline sx={{ mb: 2 }} />
      <DatePicker
        label="Date"
        value={date}
        onChange={setDate}
        slotProps={{
          textField: {
            required: true,
            error: dateError,
            helperText: dateError ? 'Date overlaps existing milestone' : undefined,
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ display: 'block', mt: 2 }}
        disabled={!formValid}
      >
        {initial ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
