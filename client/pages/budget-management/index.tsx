// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  Layout,
  Popup,
  BudgetForm,
  BudgetTable,
  useToast,
  PageBreadcrumbs,
} from '../../components';
import { withAuth, useAuth } from '../../context/AuthContext';
import {
  createBudget,
  updateBudget,
  deleteBudget,
  fetchBudgetOverview,
} from '../../models/budgetModel';

function BudgetManagement() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [editRow, setEditRow] = useState(null);

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


  const handleEdit = row => {
    setEditRow(row);
  };

  const handleDelete = async row => {
    if (window.confirm('Delete this rate?')) {
      try {
        await deleteBudget(row.budgetId);
        showToast('Rate deleted');
        loadData();
      } catch (e) {
        showToast('Error deleting rate', { severity: 'error' });
      }
    }
  };

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Budget Management</Typography>
        </Box>
        <PageBreadcrumbs items={[{ label: 'Budget Management' }]} />
        <BudgetTable data={rows} onEdit={handleEdit} onDelete={handleDelete} />
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
      </Container>
    </Layout>
  );
}

export default withAuth(BudgetManagement);
