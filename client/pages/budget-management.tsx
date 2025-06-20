// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Layout, Popup, BudgetForm, BudgetTable } from '../components';
import { withAuth, useAuth } from '../context/AuthContext';
import {
  createBudget,
  updateBudget,
  fetchBudgetOverview,
} from '../models/budgetModel';

function BudgetManagement() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [open, setOpen] = useState(false);

  async function loadData() {
    const data = await fetchBudgetOverview();
    setRows(data);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleSave = async data => {
    if (editRow?.budgetId) {
      await updateBudget(editRow.budgetId, data);
    } else {
      await createBudget(data);
    }
    setEditRow(null);
    loadData();
  };

  const handleCreate = async data => {
    await createBudget(data);
    setOpen(false);
    loadData();
  };

  const handleEdit = row => {
    setEditRow(row);
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
        <Popup open={!!editRow} onClose={() => setEditRow(null)} title="Edit Rate">
          {editRow && (
            <BudgetForm
              onSubmit={handleSave}
              initial={{
                role: editRow.role,
                level: editRow.level,
                rate: editRow.rate,
              }}
              submitText="Save"
            />
          )}
        </Popup>
        <Popup open={open} onClose={() => setOpen(false)} title="Add Rate">
          <BudgetForm onSubmit={handleCreate} />
        </Popup>
      </Container>
    </Layout>
  );
}

export default withAuth(BudgetManagement);
