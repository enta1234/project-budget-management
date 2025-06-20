// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Layout, Popup, BudgetForm, BudgetTable, useToast } from '../components';
import { withAuth, useAuth } from '../context/AuthContext';
import {
  createBudget,
  updateBudget,
  fetchBudgetOverview,
} from '../models/budgetModel';

function BudgetManagement() {
  const { token } = useAuth();
  const { showToast } = useToast();
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
    try {
      if (editRow?.budgetId) {
        await updateBudget(editRow.budgetId, data);
        showToast('Rate updated');
      } else {
        await createBudget(data);
        showToast('Rate created');
      }
      setEditRow(null);
      loadData();
    } catch (e) {
      showToast('Error saving rate', { severity: 'error' });
    }
  };

  const handleCreate = async data => {
    try {
      await createBudget(data);
      showToast('Rate created');
      setOpen(false);
      loadData();
    } catch (e) {
      showToast('Error creating rate', { severity: 'error' });
    }
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
