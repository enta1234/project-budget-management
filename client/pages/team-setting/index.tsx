// @ts-nocheck
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
import {
  fetchResources,
  createResource,
  updateResource,
  deleteResource,
} from '../../models/resourceModel';
import api from '../../api';

function TeamSetting() {
  const { token } = useAuth();
  const [resources, setResources] = useState([]);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

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
    const [res, pos] = await Promise.all([
      fetchResources(),
      api.get('/api/v1/positions'),
    ]);
    const map = {} as Record<string, { role: string; level: string }>;
    pos.data.forEach(p => {
      const [r, l] = p.label.split(' - ');
      map[p.value] = { role: r, level: l };
    });
    const data = res.map(r => ({
      ...r,
      role: map[r.position]?.role || '',
      level: map[r.position]?.level || '',
    }));
    setResources(data);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleCreate = async data => {
    await createResource(data);
    setOpen(false);
    loadData();
  };

  const handleSave = async data => {
    if (editRow?.id) {
      await updateResource(editRow.id, data);
      setEditRow(null);
      loadData();
    }
  };

  const handleDelete = async row => {
    if (window.confirm('Delete this resource?')) {
      await deleteResource(row.id);
      loadData();
    }
  };
  const columns = [
    {
      field: 'no',
      headerName: 'No.',
      width: 70,
      sortable: false,
      valueGetter: (_value, row, _col, api) => {
        if (!api) return '';
        const index = api.current.getRowIndexRelativeToVisibleRows(row.id);
        return typeof index === 'number' ? index + 1 : '';
      },
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'level', headerName: 'Level', width: 100 },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 120,
      valueGetter: (_value, row) => {
        if (row && row.startDate) {
          try {
            return format(new Date(row.startDate), 'yyyy-MM-dd');
          } catch {
            return '';
          }
        }
        return '';
      },
    },
    {
      field: 'serviceYear',
      headerName: 'Service Year',
      width: 120,
      valueGetter: (_value, row) => {
        if (row && row.startDate) {
          try {
            return getServiceDuration(row.startDate);
          } catch {
            return '';
          }
        }
        return '';
      },
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 150,
      renderCell: params => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => setEditRow(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
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
        <Popup open={!!editRow} onClose={() => setEditRow(null)} title="Edit Resource">
          {editRow && (
            <ResourceForm
              onSubmit={handleSave}
              initial={editRow}
              submitText="Save"
            />
          )}
        </Popup>
      </Container>
    </Layout>
  );
}

export default withAuth(TeamSetting);
