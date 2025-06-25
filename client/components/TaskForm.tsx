// @ts-nocheck
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function TaskForm({ onSubmit, initial }) {
  const [name, setName] = useState(initial?.name || '');
  const [detail, setDetail] = useState(initial?.detail || '');
  const [startDate, setStartDate] = useState(initial?.startDate || null);
  const [endDate, setEndDate] = useState(initial?.endDate || null);
  const [owner, setOwner] = useState(initial?.owner || '');
  const [manday, setManday] = useState(initial?.manday != null ? String(initial.manday) : '');
  const [blockedBy, setBlockedBy] = useState(initial?.blockedBy || '');
  const [feature, setFeature] = useState(initial?.isFeature || false);

  useEffect(() => {
    setName(initial?.name || '');
    setDetail(initial?.detail || '');
    setStartDate(initial?.startDate || null);
    setEndDate(initial?.endDate || null);
    setOwner(initial?.owner || '');
    setManday(initial?.manday != null ? String(initial.manday) : '');
    setBlockedBy(initial?.blockedBy || '');
    setFeature(initial?.isFeature || false);
  }, [initial]);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit &&
      onSubmit({
        name,
        detail,
        startDate,
        endDate,
        owner,
        manday: manday ? Number(manday) : undefined,
        blockedBy: blockedBy || undefined,
        ...(feature ? { isFeature: true } : {}),
      });
    setName('');
    setDetail('');
    setStartDate(null);
    setEndDate(null);
    setOwner('');
    setManday('');
    setBlockedBy('');
    setFeature(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <TextField label="Detail" value={detail} onChange={e => setDetail(e.target.value)} fullWidth multiline sx={{ mb: 2 }} />
      <DatePicker label="Start Date" value={startDate} onChange={setStartDate} sx={{ mb: 2 }} />
      <DatePicker label="End Date" value={endDate} onChange={setEndDate} sx={{ mb: 2 }} />
      <TextField label="Owner" value={owner} onChange={e => setOwner(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <TextField label="Manday" type="number" value={manday} onChange={e => setManday(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <TextField label="Blocked By" value={blockedBy} onChange={e => setBlockedBy(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <FormControlLabel control={<Checkbox checked={feature} onChange={e => setFeature(e.target.checked)} />} label="Feature" />
      <Button type="submit" variant="contained" sx={{ display: 'block', mt: 2 }}>
        {initial ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
