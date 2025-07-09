// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addDays } from 'date-fns';

export default function TaskForm({ onSubmit, initial, tasks = [], members = [] }) {
  const [name, setName] = useState(initial?.name || '');
  const [detail, setDetail] = useState(initial?.detail || '');
  const [startDate, setStartDate] = useState(initial?.startDate || initial?.date || null);
  const [endDate, setEndDate] = useState(initial?.endDate || null);
  const [assignees, setAssignees] = useState({});
  const [manday, setManday] = useState(initial?.manday != null ? String(initial.manday) : '');
  const [duration, setDuration] = useState(initial?.duration != null ? String(initial.duration) : '');
  const [blocked, setBlocked] = useState(null);
  const [taskType, setTaskType] = useState(
    initial?.type ||
      (initial ? (initial.isFeature ? 'feature' : 'milestone') : 'feature')
  );

  const roleMap = useMemo(() => {
    const map: any = {};
    members.forEach(m => {
      const role = String(m.position).split('_')[0].toUpperCase();
      if (!map[role]) map[role] = [];
      map[role].push(m);
    });
    return map;
  }, [members]);

  useEffect(() => {
    setName(initial?.name || '');
    setDetail(initial?.detail || '');
    setStartDate(initial?.startDate || initial?.date || null);
    setEndDate(initial?.endDate || null);
    const initAssign: any = {};
    Object.keys(roleMap).forEach(r => (initAssign[r] = []));
    if (initial?.assignees) {
      const idMap = Object.fromEntries(members.map(m => [m.id, m]));
      Object.entries(initial.assignees).forEach(([r, ids]: any) => {
        initAssign[r] = ids.map((id: string) => idMap[id]).filter(Boolean);
      });
    }
    setAssignees(initAssign);
    setManday(initial?.manday != null ? String(initial.manday) : '');
    setDuration(initial?.duration != null ? String(initial.duration) : '');
    setBlocked(null);
    setTaskType(
      initial?.type ||
        (initial ? (initial.isFeature ? 'feature' : 'milestone') : 'feature')
    );
  }, [initial, roleMap, members]);

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

  useEffect(() => {
    if (startDate && duration) {
      try {
        const d = addDays(new Date(startDate), Number(duration));
        setEndDate(d);
      } catch {}
    }
  }, [startDate, duration]);

  useEffect(() => {
    if (blocked?.date) {
      const d = addDays(new Date(blocked.date), 1);
      setStartDate(d);
    }
  }, [blocked]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!formValid) return;
    const roleList: string[] = [];
    const assignData: any = {};
    Object.entries(assignees).forEach(([r, list]: any) => {
      if (list.length) {
        roleList.push(r);
        assignData[r] = list.map((m: any) => m.id);
      }
    });
    onSubmit &&
      onSubmit({
        name,
        detail,
        startDate,
        endDate,
        roles: roleList,
        assignees: assignData,
        manday: manday ? Number(manday) : undefined,
        duration: duration ? Number(duration) : undefined,
        blockedBy: blocked ? blocked.id : undefined,
        type: taskType,
      });
    setName('');
    setDetail('');
    setStartDate(null);
    setEndDate(null);
    setAssignees(Object.fromEntries(Object.keys(roleMap).map(r => [r, []])));
    setManday('');
    setDuration('');
    setBlocked(null);
    setTaskType('feature');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <TextField label="Detail" value={detail} onChange={e => setDetail(e.target.value)} fullWidth multiline sx={{ mb: 2 }} />
      <>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          sx={{ mb: 2 }}
          slotProps={{ textField: { error: dateError } }}
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
        <TextField label="Duration (days)" type="number" value={duration} onChange={e => setDuration(e.target.value)} fullWidth sx={{ mb: 2 }} />
        {Object.entries(roleMap).map(([r, opts]) => (
          <Autocomplete
            key={r}
            multiple
            options={opts as any}
            getOptionLabel={(o: any) => o.name}
            value={assignees[r] || []}
            onChange={(_, v) =>
              setAssignees(a => ({ ...a, [r]: v }))
            }
            renderInput={params => <TextField {...params} label={r} />}
            sx={{ mb: 2 }}
          />
        ))}
        <TextField label="Manday" type="number" value={manday} onChange={e => setManday(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <Autocomplete
          options={tasks.map(t => ({ id: t._id || t.id, label: t.name, date: t.endDate }))}
          getOptionLabel={o => o.label}
          value={blocked}
          onChange={(_, v) => setBlocked(v)}
          renderInput={params => <TextField {...params} label="Blocked By" />}
          sx={{ mb: 2 }}
        />
      </>
      <ToggleButtonGroup
        value={taskType}
        exclusive
        onChange={(_, v) => v && setTaskType(v)}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="feature">Task</ToggleButton>
        <ToggleButton value="milestone">Milestone</ToggleButton>
      </ToggleButtonGroup>
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
