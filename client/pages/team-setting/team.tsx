// @ts-nocheck
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Layout, Popup, TeamForm } from '../../components';
import { withAuth, useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

function TeamPage() {
  const { token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  async function loadData() {
    const headers = { Authorization: `Bearer ${token}` };
    const [t, u] = await Promise.all([
      axios.get('/api/v1/teams', { headers }),
      axios.get('/api/v1/users', { headers }),
    ]);
    setTeams(t.data);
    setUsers(u.data);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleCreate = async data => {
    const headers = { Authorization: `Bearer ${token}` };
    await axios.post('/api/v1/teams', data, { headers });
    setOpen(false);
    loadData();
  };

  const columns = [
    { field: 'name', headerName: 'Team Name', flex: 1 },
    { field: 'lead', headerName: 'Team Lead', flex: 1 },
    {
      field: 'totalMember',
      headerName: 'Total Member',
      width: 120,
      valueGetter: params => params.row.members.length,
    },
    {
      field: 'createdAt',
      headerName: 'Create Date',
      width: 150,
      valueGetter: params => format(new Date(params.row.createdAt), 'yyyy-MM-dd'),
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 150,
      renderCell: () => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Teams</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            New Team
          </Button>
        </Box>
        <Paper>
          <DataGrid
            rows={teams}
            columns={columns}
            getRowId={row => row._id}
            autoHeight
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </Paper>
        <Popup open={open} onClose={() => setOpen(false)} title="Add Team">
          <TeamForm users={users} onSubmit={handleCreate} />
        </Popup>
      </Container>
    </Layout>
  );
}

export default withAuth(TeamPage);
