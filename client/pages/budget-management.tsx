// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Layout, Popup, BudgetForm, BudgetTable } from '../components';
import { withAuth, useAuth } from '../context/AuthContext';
import { createBudget, fetchBudgetOverview } from '../models/budgetModel';

function BudgetManagement() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [editId, setEditId] = useState(null);
  const [rate, setRate] = useState('');
  const [open, setOpen] = useState(false);

  async function loadData() {
    const data = await fetchBudgetOverview();
    setRows(data);
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

  const handleEdit = row => {
    setEditId(row.id);
    setRate(String(row.rate));
  };

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4, width: '90%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Budget Management</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            New Rate
          </Button>
        </Box>
        <BudgetTable data={rows} onEdit={handleEdit} />
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
