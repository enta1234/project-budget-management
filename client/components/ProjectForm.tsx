// @ts-nocheck
import { useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ProjectForm({
  users = [],
  teams = [],
  budgets = [],
  onSubmit,
  initial,
  submitText = 'Create',
}) {
  const [active, setActive] = useState(0);
  const [team, setTeam] = useState(null);
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [start, setStart] = useState(initial?.start || null);
  const [status, setStatus] = useState(initial?.status || 'planing');
  const [lead, setLead] = useState(initial?.lead || null);
  const [members, setMembers] = useState(initial?.members || []);
  const [manday, setManday] = useState(
    initial?.manday != null ? String(initial.manday) : ''
  );

  useEffect(() => {
    setName(initial?.name || '');
    setDescription(initial?.description || '');
    setStart(initial?.start || null);
    setLead(initial?.lead || null);
    setMembers(initial?.members || []);
    setManday(initial?.manday != null ? String(initial.manday) : '');
    setStatus(initial?.status || 'planing');
  }, [initial]);

  const handleNext = () => setActive(a => Math.min(a + 1, 2));
  const handleBack = () => setActive(a => Math.max(a - 1, 0));

  const handleSubmit = e => {
    e.preventDefault();
    if (active < 2) return handleNext();
    if (onSubmit) {
      onSubmit({
        name,
        description,
        start,
        end: start,
        status,
        ...(manday ? { manday: Number(manday) } : {}),
        priority: 1,
        lead: lead?.id,
        members: members.map(m => m.id),
      });
    }
    setName('');
    setDescription('');
    setStart(null);
    setLead(null);
    setMembers([]);
    setManday('');
    setStatus('planing');
    setActive(0);
    setTeam(null);
  };

  const handleTeamChange = (_: any, v: any) => {
    setTeam(v);
    if (v) {
      const leadObj = users.find(u => u.name === v.lead) || null;
      const memObjs = Array.isArray(v.members)
        ? v.members
            .map((n: string) => users.find(u => u.name === n) || null)
            .filter(Boolean)
        : [];
      setLead(leadObj);
      setMembers(memObjs);
    }
  };

  const rateMap = useMemo(() => {
    const map = {} as Record<string, number>;
    budgets.forEach(b => {
      map[b.id] = b.rate;
    });
    return map;
  }, [budgets]);

  const summary = useMemo(() => {
    const counts: Record<string, number> = {};
    const list = [lead, ...members].filter(Boolean);
    list.forEach(r => {
      counts[r.position] = (counts[r.position] || 0) + 1;
    });
    const rows = Object.entries(counts).map(([pos, count]) => ({
      pos,
      count,
      rate: rateMap[pos] || 0,
      cost: count * (rateMap[pos] || 0),
    }));
    const total = rows.reduce((s, r) => s + r.cost, 0);
    return { rows, total };
  }, [lead, members, rateMap]);

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }),
    [],
  );

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
      <Stepper activeStep={active} sx={{ gridColumn: 'span 2' }}>
        {['General', 'Members', 'Preview'].map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {active === 0 && (
        <>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            multiline
            sx={{ gridColumn: 'span 2' }}
          />
          <DatePicker
            label="Start Date"
            value={start}
            onChange={setStart}
            slotProps={{ textField: { required: true } }}
          />
          <Autocomplete
            options={[
              'planing',
              'in progress',
              'production',
              'waiting payment',
              'paid',
            ]}
            value={status}
            onChange={(_, v) => setStatus(v)}
            renderInput={params => (
              <TextField {...params} label="Status" required />
            )}
          />
          <TextField
            label="Manday"
            type="number"
            value={manday}
            onChange={e => setManday(e.target.value)}
          />
        </>
      )}

      {active === 1 && (
        <>
          <Autocomplete
            options={teams}
            getOptionLabel={o => o.name}
            value={team}
            onChange={handleTeamChange}
            renderInput={params => <TextField {...params} label="Team" />}
            sx={{ gridColumn: 'span 2' }}
          />
          <Autocomplete
            options={users}
            getOptionLabel={o => o.name}
            value={lead}
            onChange={(_, v) => setLead(v)}
            renderInput={params => <TextField {...params} label="Team Lead" required />}
          />
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={o => o.name}
            value={members}
            onChange={(_, v) => setMembers(v)}
            renderInput={params => <TextField {...params} label="Members" />}
            sx={{ gridColumn: 'span 2' }}
          />
        </>
      )}

      {active === 2 && (
        <>
          <Typography sx={{ gridColumn: 'span 2' }} variant="h6">
            Preview
          </Typography>
          <Box sx={{ gridColumn: 'span 2', display: 'grid', rowGap: 1 }}>
            <Typography>
              <strong>Name:</strong> {name}
            </Typography>
            <Typography>
              <strong>Description:</strong> {description}
            </Typography>
          <Typography>
            <strong>Start:</strong>{' '}
            {start ? new Date(start).toLocaleDateString() : ''}
          </Typography>
          <Typography>
            <strong>Manday:</strong> {manday}
          </Typography>
          <Typography>
            <strong>Status:</strong> {status}
          </Typography>
          <Typography>
            <strong>Lead:</strong> {lead?.name || ''}
          </Typography>
            <Typography>
              <strong>Members:</strong>{' '}
              {members.map(m => m.name).join(', ')}
            </Typography>
          </Box>
          {summary.rows.length > 0 && (
            <Table size="small" sx={{ gridColumn: 'span 2' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Position</TableCell>
                  <TableCell>Count</TableCell>
                  <TableCell>Rate/MD</TableCell>
                  <TableCell>Cost/Day</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.rows.map(r => (
                  <TableRow key={r.pos}>
                    <TableCell>{r.pos.replace('_', ' ')}</TableCell>
                    <TableCell>{r.count}</TableCell>
                    <TableCell>{currencyFormatter.format(r.rate)}</TableCell>
                    <TableCell>{currencyFormatter.format(r.cost)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3}>Total / Day</TableCell>
                  <TableCell>{currencyFormatter.format(summary.total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </>
      )}

      <Box sx={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between' }}>
        {active > 0 && (
          <Button type="button" onClick={handleBack}>
            Back
          </Button>
        )}
        {active < 2 ? (
          <Button type="button" variant="contained" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button type="submit" variant="contained" onClick={handleSubmit}>
            {submitText}
          </Button>
        )}
      </Box>
    </Box>
  );
}
