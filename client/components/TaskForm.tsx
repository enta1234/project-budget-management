// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addDays } from 'date-fns';

export default function TaskForm({ onSubmit, initial, members = [], tasks = [], milestones = [] }) {
  const [name, setName] = useState(initial?.name || '');
  const [detail, setDetail] = useState(initial?.detail || '');
  const [startDate, setStartDate] = useState(initial?.startDate || null);
  const [endDate, setEndDate] = useState(initial?.endDate || null);
  const [owner, setOwner] = useState(initial?.owner || '');
  const [manday, setManday] = useState(initial?.manday != null ? String(initial.manday) : '');
  const [duration, setDuration] = useState(initial?.duration != null ? String(initial.duration) : '');
  const [blockedBy, setBlockedBy] = useState(initial?.blockedBy || '');
  const [feature, setFeature] = useState(initial?.isFeature || false);

  const blockOptions = [
    ...tasks.map(t => ({
      id: t._id || t.id,
      label: t.name,
      end: t.endDate ? new Date(t.endDate) : null,
    })),
    ...milestones.map(m => ({
      id: m._id || m.id,
      label: m.name,
      end: m.date ? new Date(m.date) : null,
    })),
  ];

  useEffect(() => {
    setName(initial?.name || '');
    setDetail(initial?.detail || '');
    setStartDate(initial?.startDate || null);
    setEndDate(initial?.endDate || null);
    setOwner(initial?.owner || '');
    setManday(initial?.manday != null ? String(initial.manday) : '');
    setDuration(initial?.duration != null ? String(initial.duration) : '');
    setBlockedBy(initial?.blockedBy || '');
    setFeature(initial?.isFeature || false);
  }, [initial]);

  useEffect(() => {
    if (startDate && duration) {
      const d = addDays(new Date(startDate), Number(duration) - 1);
      setEndDate(d);
    }
  }, [startDate, duration]);

  useEffect(() => {
    if (!blockedBy) return;
    const opt = blockOptions.find(o => String(o.id) === String(blockedBy));
    if (opt && opt.end) {
      const next = addDays(opt.end, 1);
      setStartDate(next);
    }
  }, [blockedBy, blockOptions]);

  const dateError = useMemo(
    () =>
      !!(
        startDate &&
        endDate &&
        new Date(startDate).getTime() > new Date(endDate).getTime()
      ),
    [startDate, endDate],
  );

  const formValid = useMemo(
    () => name.trim() !== '' && !dateError,
    [name, dateError],
  );

  const handleSubmit = e => {
    e.preventDefault();
    if (!formValid) return;
    onSubmit &&
      onSubmit({
        name,
        detail,
        startDate,
        endDate,
        duration: duration ? Number(duration) : undefined,
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
    setDuration('');
    setBlockedBy('');
    setFeature(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <TextField label="Detail" value={detail} onChange={e => setDetail(e.target.value)} fullWidth multiline sx={{ mb: 2 }} />
      <DatePicker
        label="Start Date"
        value={startDate}
        onChange={setStartDate}
        sx={{ mb: 2 }}
        slotProps={{ textField: { error: dateError } }}
      />
      <TextField
        label="Duration (days)"
        type="number"
        value={duration}
        onChange={e => setDuration(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <DatePicker
        label="End Date"
        value={endDate}
        onChange={setEndDate}
        sx={{ mb: 2 }}
        slotProps={{
          textField: {
            error: dateError,
            helperText: dateError ? 'End date must be after start date' : undefined,
          },
        }}
      />
      <Autocomplete
        options={members}
        getOptionLabel={o => o.name}
        value={members.find(m => m.name === owner) || null}
        onChange={(_, v) => setOwner(v ? v.name : '')}
        renderInput={params => <TextField {...params} label="Owner" />}
        sx={{ mb: 2 }}
        fullWidth
      />
      <TextField label="Manday" type="number" value={manday} onChange={e => setManday(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <Autocomplete
        options={blockOptions}
        getOptionLabel={o => o.label}
        value={blockOptions.find(o => String(o.id) === String(blockedBy)) || null}
        onChange={(_, v) => setBlockedBy(v ? v.id : '')}
        renderInput={params => <TextField {...params} label="Blocked By" />}
        sx={{ mb: 2 }}
        fullWidth
      />
      <FormControlLabel control={<Checkbox checked={feature} onChange={e => setFeature(e.target.checked)} />} label="Feature" />
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
