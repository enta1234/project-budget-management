// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Layout, PageBreadcrumbs } from '../components';
import { withAuth } from '../context/AuthContext';
import { fetchActivityLogs } from '../models/activityLogModel';

function ActivityPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchActivityLogs().then(setLogs).catch(console.error);
  }, []);

  const columns = [
    { field: 'name', headerName: 'Activity', width: 180 },
    { field: 'detail', headerName: 'Detail', flex: 1 },
    { field: 'method', headerName: 'Method', width: 100 },
    { field: 'url', headerName: 'URL', flex: 1 },
    { field: 'statusCode', headerName: 'Status', width: 100 },
    {
      field: 'timestamp',
      headerName: 'Time',
      width: 180,
      valueGetter: (_v, row) =>
        row?.timestamp ? new Date(row.timestamp).toLocaleString() : '',
    },
  ];

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Activity Logs
        </Typography>
        <PageBreadcrumbs items={[{ label: 'Activity Logs' }]} />
        <Paper>
          <DataGrid
            rows={logs}
            columns={columns}
            getRowId={row => row._id}
            autoHeight
            pageSize={25}
            rowsPerPageOptions={[25]}
            sx={{ width: '100%' }}
          />
        </Paper>
      </Container>
    </Layout>
  );
}

export default withAuth(ActivityPage);
