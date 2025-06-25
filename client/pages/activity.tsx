// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import { Layout, PageBreadcrumbs, PageLoading } from '../components';
import { withAuth } from '../context/AuthContext';
import { fetchActivityLogs } from '../models/activityLogModel';

function ActivityPage() {
  const [logs, setLogs] = useState([]);
  const [methodFilter, setMethodFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchActivityLogs()
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const methods = useMemo(() => {
    return Array.from(new Set(logs.map(l => l.method))).sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (methodFilter && log.method !== methodFilter) {
        return false;
      }
      if (search) {
        const text = search.toLowerCase();
        const values = [log.name, log.detail, log.method, log.url, String(log.statusCode)];
        return values.some(v =>
          (v ?? '')
            .toString()
            .toLowerCase()
            .includes(text),
        );
      }
      return true;
    });
  }, [logs, methodFilter, search]);

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
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="method-filter-label">Method</InputLabel>
            <Select
              labelId="method-filter-label"
              label="Method"
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {methods.map(m => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Box>
        {loading ? (
          <PageLoading />
        ) : (
          <Paper>
            <DataGrid
              rows={filteredLogs}
              columns={columns}
              getRowId={row => row._id}
              autoHeight
              pageSize={25}
              rowsPerPageOptions={[25]}
              sx={{ width: '100%' }}
            />
          </Paper>
        )}
      </Container>
    </Layout>
  );
}

export default withAuth(ActivityPage);
