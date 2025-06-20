// @ts-nocheck
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';

export default function TeamForm({ users = [], onSubmit }) {
  const [name, setName] = useState('');
  const [lead, setLead] = useState(null);
  const [members, setMembers] = useState([]);

  const toggleMember = id => {
    setMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ name, lead: lead?.name, members });
    setName('');
    setLead(null);
    setMembers([]);
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
        Create
      </Button>
    </Box>
  );
}
