// @ts-nocheck
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { differenceInDays, format } from 'date-fns';
import api from '../api';
import { Layout } from '../components';
import { withAuth, useAuth } from '../context/AuthContext';

function ProjectManagement() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(null);
  const [lead, setLead] = useState(null);
  const [members, setMembers] = useState([]);
  const [manday, setManday] = useState('');

  async function loadData() {
    const pro = await api.get('/api/v1/projects');
    setProjects(pro.data);
    const usr = await axios.get('/api/v1/resources', { headers });
    setUsers(usr.data);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post(
      '/api/v1/projects',
      {
        name,
        description,
        start,
        end: start,
        manday: Number(manday),
        priority: 1,
        lead: lead?.id,
        members: members.map(m => m.id),
      }
    );
    setName('');
    setDescription('');
    setStart(null);
    setLead(null);
    setMembers([]);
    setManday('');
    loadData();
  }

  const columns = [
    {
      field: 'no',
      headerName: 'No.',
      width: 70,
      valueGetter: params => params.api.getRowIndex(params.id) + 1,
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'lead',
      headerName: 'Lead',
      flex: 1,
      valueGetter: params => params.row.lead || '',
    },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'totalDay',
      headerName: 'Total Day',
      width: 100,
      valueGetter: params =>
        differenceInDays(new Date(), new Date(params.row.start)),
    },
    {
      field: 'remainMandat',
      headerName: 'Remain Mandat',
      width: 150,
      valueGetter: params =>
        params.row.manday -
        differenceInDays(new Date(), new Date(params.row.start)),
    },
    {
      field: 'start',
      headerName: 'Start Date',
      width: 120,
      valueGetter: params => format(new Date(params.row.start), 'yyyy-MM-dd'),
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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Project Management
        </Typography>
        <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            New Project
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Name" value={name} onChange={e => setName(e.target.value)} required />
            <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} multiline />
            <DatePicker label="Start Date" value={start} onChange={setStart} renderInput={params => <TextField {...params} required />} />
            <Autocomplete
              options={users}
              getOptionLabel={o => o.name}
              value={lead}
              onChange={(_, v) => setLead(v)}
              renderInput={params => <TextField {...params} label="Team Lead" required />}
            />
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={o => o.name}
              value={members}
              onChange={(_, v) => setMembers(v)}
              renderInput={params => <TextField {...params} label="Members" />}
            />
            <TextField label="Manday" type="number" value={manday} onChange={e => setManday(e.target.value)} required />
            <Button type="submit" variant="contained">Create</Button>
          </Box>
        </Paper>
        <Paper>
          <DataGrid
            rows={projects}
            columns={columns}
            getRowId={row => row._id}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
          />
        </Paper>
      </Container>
    </Layout>
  );
}

export default withAuth(ProjectManagement);
