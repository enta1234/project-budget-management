// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import api from '../api';
import { Layout, Popup, BudgetForm } from '../components';
import { withAuth, useAuth } from '../context/AuthContext';
import { fetchBudgets, createBudget } from '../models/budgetModel';

function BudgetManagement() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [editId, setEditId] = useState(null);
  const [rate, setRate] = useState('');
  const [open, setOpen] = useState(false);

  async function loadData() {
    const [res, budgets, pos] = await Promise.all([
      api.get('/api/v1/resources'),
      fetchBudgets(),
      api.get('/api/v1/positions'),
    ]);
    const counts = {} as any;
    res.data.forEach(r => {
      counts[r.position] = (counts[r.position] || 0) + 1;
    });
    const rateMap = {} as any;
    budgets.forEach(b => {
      rateMap[b.position] = b.rate;
    });
    const rws = pos.data.map(p => {
      const [role, level] = p.label.split(' - ');
      return {
        id: p.value,
        role,
        level,
        count: counts[p.value] || 0,
        rate: rateMap[p.value] || 0,
      };
    });
    setRows(rws);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleSaveRate = () => {
    setRows(rows.map(r => (r.id === editId ? { ...r, rate: Number(rate) } : r)));
    setEditId(null);
  };

  const handleCreate = async data => {
    await createBudget(data);
    setOpen(false);
    loadData();
  };

  const columns = [
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'level', headerName: 'Level', width: 130 },
    { field: 'count', headerName: 'Count', width: 100 },
    { field: 'rate', headerName: 'Baht/MD', width: 120 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 100,
      renderCell: params => (
        <IconButton
          size="small"
          onClick={() => {
            setEditId(params.row.id);
            setRate(String(params.row.rate));
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4, width: '90%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Budget Management</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            New Rate
          </Button>
        </Box>
        <Paper>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            pageSize={25}
            rowsPerPageOptions={[25]}
            disableSelectionOnClick
          />
        </Paper>
        <Popup open={!!editId} onClose={() => setEditId(null)} title="Edit Rate">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Baht / MD"
              type="number"
              value={rate}
              onChange={e => setRate(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleSaveRate}>
              Save
            </Button>
          </Box>
        </Popup>
        <Popup open={open} onClose={() => setOpen(false)} title="Add Rate">
          <BudgetForm onSubmit={handleCreate} />
        </Popup>
      </Container>
    </Layout>
  );
}

export default withAuth(BudgetManagement);
