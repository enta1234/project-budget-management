// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Layout } from '../../components';
import { withAuth } from '../../context/AuthContext';
import { fetchEvents } from '../../models/eventsModel';

function WorkspaceDetail() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueGetter: params => new Date(params.row.date).toLocaleDateString(),
    },
  ];

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4, width: '90%' }}>
        <Typography variant="h5" gutterBottom>
          Summary Detail
        </Typography>
        <Paper>
          <DataGrid
            rows={events}
            columns={columns}
            getRowId={row => row._id}
            autoHeight
            pageSize={25}
            rowsPerPageOptions={[25]}
          />
        </Paper>
      </Container>
    </Layout>
  );
}

export default withAuth(WorkspaceDetail);
