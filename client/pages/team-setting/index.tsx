// @ts-nocheck
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import api from '../../api';
import { Layout, ResourceForm, Popup } from '../../components';
import { withAuth, useAuth } from '../../context/AuthContext';

function TeamSetting() {
  const { token } = useAuth();
  const [resources, setResources] = useState([]);
  const [open, setOpen] = useState(false);

  async function loadData() {
    const res = await api.get('/api/v1/users');
    setResources(res.data);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleCreate = async data => {
    await api.post('/api/v1/users', { username: data.name });
    setOpen(false);
    loadData();
  };

  const columns = [
    {
      field: 'no',
      headerName: 'No.',
      width: 70,
      // valueGetter: params => params.api.getRowIndex(params.id) + 1,
      sortable: false,
    },
    { field: 'username', headerName: 'Username', flex: 1 },
  ];

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
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
            pageSize={5}
            rowsPerPageOptions={[5]}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{ toolbar: { showQuickFilter: true } }}
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
