// @ts-nocheck
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ProjectForm({ users = [], onSubmit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(null);
  const [lead, setLead] = useState(null);
  const [members, setMembers] = useState([]);
  const [manday, setManday] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        name,
        description,
        start,
        end: start,
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
      <TextField label="Name" value={name} onChange={e => setName(e.target.value)} required />
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
        renderInput={params => <TextField {...params} required />}
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
      <TextField
        label="Manday"
        type="number"
        value={manday}
        onChange={e => setManday(e.target.value)}
      />
      <Button type="submit" variant="contained" sx={{ gridColumn: 'span 2' }}>
        Create
      </Button>
    </Box>
  );
}
