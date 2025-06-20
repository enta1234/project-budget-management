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
import { Layout, Popup } from '../components';
import { withAuth, useAuth } from '../context/AuthContext';

const positions = [
  { value: 'project_manager_sr', label: 'Project Manager - Senior' },
  { value: 'project_manager_inter', label: 'Project Manager - Intermediate' },
  { value: 'project_manager_jr', label: 'Project Manager - Junior' },
  { value: 'sa_sr', label: 'System Analyst - Senior' },
  { value: 'sa_inter', label: 'System Analyst - Intermediate' },
  { value: 'sa_jr', label: 'System Analyst - Junior' },
  { value: 'pa_sr', label: 'PA - Senior' },
  { value: 'pa_inter', label: 'PA - Intermediate' },
  { value: 'pa_jr', label: 'PA - Junior' },
  { value: 'qa_sr', label: 'QA - Senior' },
  { value: 'qa_inter', label: 'QA - Intermediate' },
  { value: 'qa_jr', label: 'QA - Junior' },
];

const defaultRates = {
  project_manager_sr: 10000,
  project_manager_inter: 8000,
  project_manager_jr: 6000,
  sa_sr: 9000,
  sa_inter: 7000,
  sa_jr: 5000,
  pa_sr: 8000,
  pa_inter: 6000,
  pa_jr: 4000,
  qa_sr: 7000,
  qa_inter: 5000,
  qa_jr: 3000,
};

function BudgetManagement() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [editId, setEditId] = useState(null);
  const [rate, setRate] = useState('');

  useEffect(() => {
    if (!token) return;
    api.get('/api/v1/resources').then(res => {
      const counts = {} as any;
      res.data.forEach(r => {
        counts[r.position] = (counts[r.position] || 0) + 1;
      });
      const rws = positions.map(p => {
        const [role, level] = p.label.split(' - ');
        return {
          id: p.value,
          role,
          level,
          count: counts[p.value] || 0,
          rate: defaultRates[p.value] || 0,
        };
      });
      setRows(rws);
    });
  }, [token]);

  const handleSaveRate = () => {
    setRows(rows.map(r => (r.id === editId ? { ...r, rate: Number(rate) } : r)));
    setEditId(null);
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
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Budget Management
        </Typography>
        <Paper>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            pageSize={5}
            rowsPerPageOptions={[5]}
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
      </Container>
    </Layout>
  );
}

export default withAuth(BudgetManagement);
