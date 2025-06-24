// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';

export default function TeamForm({ users = [], onSubmit, initial, submitText = 'Create' }) {
  const [name, setName] = useState(initial?.name || '');
  const [lead, setLead] = useState(() => {
    if (initial?.lead) {
      return users.find(u => u.name === initial.lead) || null;
    }
    return null;
  });
  const [members, setMembers] = useState(initial?.members || []);

  const idNameMap = useMemo(() => {
    const map = {} as Record<string, string>;
    users.forEach(u => {
      map[u.id] = u.name;
    });
    return map;
  }, [users]);

  const nameIdMap = useMemo(() => {
    const map = {} as Record<string, string>;
    users.forEach(u => {
      map[u.name] = u.id;
    });
    return map;
  }, [users]);

  const selectionModel = useMemo(() => {
    const ids = members.map(m => nameIdMap[m]).filter(Boolean);
    if (lead?.id && !ids.includes(lead.id)) {
      ids.unshift(lead.id);
    }
    return ids;
  }, [members, lead, nameIdMap]);

  const originalOrder = useMemo(() => {
    const map = {} as Record<string, number>;
    users.forEach((u, i) => {
      map[u.id] = i;
    });
    return map;
  }, [users]);

  const rows = useMemo(() => {
    const selected = new Set(
      selectionModel.filter(id => id !== lead?.id)
    );
    return [...users].sort((a, b) => {
      if (lead?.id) {
        if (a.id === lead.id) return -1;
        if (b.id === lead.id) return 1;
      }
      const aSel = selected.has(a.id);
      const bSel = selected.has(b.id);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;
      return originalOrder[a.id] - originalOrder[b.id];
    });
  }, [users, selectionModel, lead, originalOrder]);

  const handleSelectionChange = model => {
    let ids = Array.isArray(model) ? model : [];
    if (lead?.id && !ids.includes(lead.id)) {
      ids = [lead.id, ...ids];
    }
    const names = ids
      .filter(id => id !== lead?.id)
      .map(id => idNameMap[id])
      .filter(Boolean);
    setMembers(names);
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

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'position', headerName: 'Position', flex: 1 },
  ];

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
      <Paper sx={{ gridColumn: 'span 2', height: 300 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          isRowSelectable={params => params.id !== lead?.id}
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={handleSelectionChange}
          getRowId={row => row.id}
        />
      </Paper>
      <Button variant="contained" type="submit" sx={{ gridColumn: 'span 2' }}>
        {submitText}
      </Button>
    </Box>
  );
}
