// @ts-nocheck
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import { differenceInDays, format } from 'date-fns';
import api from '../api';
import { Layout, Popup, ProjectForm } from '../components';
import { withAuth, useAuth } from '../context/AuthContext';

function ProjectManagement() {
  const router = useRouter();
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  async function loadData() {
    const pro = await api.get('/api/v1/projects');
    setProjects(pro.data);
    const usr = await api.get('/api/v1/resources');
    setUsers(usr.data);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleCreate = async data => {
    const payload = {
      ...data,
      resources: (data.members?.length || 0) + (data.lead ? 1 : 0),
    };
    await api.post('/api/v1/projects', payload);
    setOpen(false);
    loadData();
  };

  const columns = [
    {
      field: 'no',
      headerName: 'No.',
      width: 70,
      valueGetter: (_value, row, _col, api) => {
        if (!api) return '';
        const index = api.current.getRowIndexRelativeToVisibleRows(row._id);
        return typeof index === 'number' ? index + 1 : '';
      },
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'lead',
      headerName: 'Lead',
      flex: 1,
      valueGetter: (_value, row) => row.lead?.name || '',
    },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'totalDay',
      headerName: 'Total Day',
      width: 100,
      valueGetter: (_value, row) =>
        row.start ? differenceInDays(new Date(), new Date(row.start)) : '',
    },
    {
      field: 'remainManday',
      headerName: 'Remain Manday',
      width: 150,
      valueGetter: (_value, row) =>
        row.start && typeof row.manday === 'number'
          ? row.manday - differenceInDays(new Date(), new Date(row.start))
          : '',
    },
    {
      field: 'start',
      headerName: 'Start Date',
      width: 120,
      valueGetter: (_value, row) =>
        row.start ? format(new Date(row.start), 'yyyy-MM-dd') : '',
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
            <DownloadIcon fontSize="small" />
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
      <Container maxWidth={false} sx={{ mt: 4, width: '90%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Project Management</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            New Project
          </Button>
        </Box>
        <Paper>
          <DataGrid
            rows={projects}
            columns={columns}
            getRowId={row => row._id}
            pageSize={25}
            rowsPerPageOptions={[25]}
            autoHeight
            onRowClick={params => router.push(`/project/${params.row._id}`)}
          />
        </Paper>
        <Popup open={open} onClose={() => setOpen(false)} title="Add Project">
          <ProjectForm users={users} onSubmit={handleCreate} />
        </Popup>
      </Container>
    </Layout>
  );
}

export default withAuth(ProjectManagement);
