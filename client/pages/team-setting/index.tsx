// @ts-nocheck
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import {
  format,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addYears,
  addMonths,
} from 'date-fns';
import { Layout, ResourceForm, Popup } from '../../components';
import { withAuth, useAuth } from '../../context/AuthContext';

function TeamSetting() {
  const { token } = useAuth();
  const [resources, setResources] = useState([]);
  const [open, setOpen] = useState(false);

  function getServiceDuration(date: string | Date) {
    const start = new Date(date);
    const now = new Date();
    const years = differenceInYears(now, start);
    const afterYears = addYears(start, years);
    const months = differenceInMonths(now, afterYears);
    const afterMonths = addMonths(afterYears, months);
    const days = differenceInDays(now, afterMonths);
    return `${years}y ${months}m ${days}d`;
  }

  async function loadData() {
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.get('/api/v1/resources', { headers });
    setResources(res.data);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleCreate = async data => {
    const headers = { Authorization: `Bearer ${token}` };
    await axios.post('/api/v1/resources', data, { headers });
    setOpen(false);
    loadData();
  };
  const columns = [
    {
      field: 'no',
      headerName: 'No.',
      width: 70,
      sortable: false,
      valueGetter: params =>
        params.api ? params.api.getRowIndex(params.id) + 1 : '',
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'position', headerName: 'Position', flex: 1 },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 120,
      valueGetter: params =>
        params.row.startDate
          ? format(new Date(params.row.startDate), 'yyyy-MM-dd')
          : '',
    },
    {
      field: 'serviceYear',
      headerName: 'Service Year',
      width: 120,
      valueGetter: params =>
        params.row.startDate
          ? differenceInYears(new Date(), new Date(params.row.startDate))
          : '',
    },
  ];
  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4, width: '90%' }}>
        <Typography variant="h5" gutterBottom>
          Team Setting
        </Typography>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
        >
          <Typography variant="h5">Resources</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            New Resource
          </Button>
        </Box>
        <Paper>
          <DataGrid
            rows={resources}
            columns={columns}
            getRowId={row => row.id}
            autoHeight
            pageSize={25}
            rowsPerPageOptions={[25]}
          />
        </Paper>
        <Popup open={open} onClose={() => setOpen(false)} title="Add Resource">
          <ResourceForm onSubmit={handleCreate} />
        </Popup>
      </Container>
    </Layout>
  );
}

export default withAuth(TeamSetting);
