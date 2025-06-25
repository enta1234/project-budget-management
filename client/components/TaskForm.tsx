// @ts-nocheck
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function TaskForm({ phases = [], onSubmit, initial }) {
  const [name, setName] = useState(initial?.name || '');
  const [phase, setPhase] = useState(initial?.phase || null);
  const [feature, setFeature] = useState(initial?.isFeature || false);

  useEffect(() => {
    setName(initial?.name || '');
    setPhase(initial?.phase || null);
    setFeature(initial?.isFeature || false);
  }, [initial]);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit &&
      onSubmit({
        name,
        phase: phase?._id || phase?.id,
        ...(feature ? { isFeature: true } : {}),
      });
    setName('');
    setPhase(null);
    setFeature(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <Autocomplete
        options={phases}
        getOptionLabel={o => o.name}
        value={phase}
        onChange={(_, v) => setPhase(v)}
        renderInput={params => <TextField {...params} label="Phase" required />}
        sx={{ mb: 2 }}
      />
      <FormControlLabel control={<Checkbox checked={feature} onChange={e => setFeature(e.target.checked)} />} label="Feature" />
      <Button type="submit" variant="contained" sx={{ display: 'block', mt: 2 }}>
        {initial ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
