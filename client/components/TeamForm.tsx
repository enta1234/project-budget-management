// @ts-nocheck
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';

export default function TeamForm({ users = [], onSubmit, initial, submitText = 'Create' }) {
  const [name, setName] = useState(initial?.name || '');
  const [lead, setLead] = useState(() => {
    if (initial?.lead) {
      return users.find(u => u.name === initial.lead) || null;
    }
    return null;
  });
  const [members, setMembers] = useState(initial?.members || []);

  const toggleMember = id => {
    setMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setName(initial?.name || '');
    setMembers(initial?.members || []);
    if (initial?.lead) {
      setLead(users.find(u => u.name === initial.lead) || null);
    } else {
      setLead(null);
    }
  }, [initial, users]);

  const handleSubmit = e => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ name, lead: lead?.name, members });
    }
    if (!initial) {
      setName('');
      setLead(null);
      setMembers([]);
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
      <TextField label="Team Name" value={name} onChange={e => setName(e.target.value)} required />
      <Autocomplete
        options={users}
        getOptionLabel={o => o.name}
        value={lead}
        onChange={(_, v) => setLead(v)}
        renderInput={params => <TextField {...params} label="Team Lead" />}
      />
      <FormGroup sx={{ gridColumn: 'span 2' }}>
        {users.map(u => (
          <FormControlLabel
            key={u.id}
            control={<Checkbox checked={members.includes(u.name)} onChange={() => toggleMember(u.name)} />}
            label={u.name}
          />
        ))}
      </FormGroup>
      <Button variant="contained" type="submit" sx={{ gridColumn: 'span 2' }}>
        {submitText}
      </Button>
    </Box>
  );
}
