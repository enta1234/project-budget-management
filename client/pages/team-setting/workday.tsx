// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { Layout, Popup, WorkdayForm, useToast, ConfirmDialog, PageBreadcrumbs } from '../../components';
import { withAuth, useAuth } from '../../context/AuthContext';
import {
  fetchWorkdays,
  createWorkday,
  updateWorkday,
  deleteWorkday,
} from '../../models/workdayModel';

function WorkdayPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);

  async function loadData() {
    const data = await fetchWorkdays(year);
    const filtered = data.filter(row => !String(row?.id).startsWith('weekend-'));
    setRows(filtered);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token, year]);

  const handleCreate = async data => {
    try {
      await createWorkday(data);
      showToast('Holiday created');
      setOpen(false);
      loadData();
    } catch (e) {
      showToast('Error creating holiday', { severity: 'error' });
    }
  };

  const handleSave = async data => {
    try {
      if (editRow?.id) {
        await updateWorkday(editRow.id, data);
        showToast('Holiday updated');
        setEditRow(null);
        loadData();
      }
    } catch (e) {
      showToast('Error updating holiday', { severity: 'error' });
    }
  };

  const handleDelete = row => {
    if (row.readonly) return;
    setDeleteRow(row);
  };

  const confirmDelete = async () => {
    try {
      await deleteWorkday(deleteRow.id);
      showToast('Holiday deleted');
      loadData();
    } catch (e) {
      showToast('Error deleting holiday', { severity: 'error' });
    }
    setDeleteRow(null);
  };

  const years = [] as number[];
  for (let i = currentYear - 2; i <= currentYear + 2; i++) years.push(i);

  const columns = [
    {
      field: 'no',
      headerName: 'No.',
      width: 70,
      sortable: false,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      valueGetter: (_value, row, _col, api) => {
        if (!api) return '';
        const index = api.current.getRowIndexRelativeToVisibleRows(row.id);
        return typeof index === 'number' ? index + 1 : '';
      },
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      valueGetter: (_value, row) => {
        if (row?.date) {
          try {
            return format(new Date(row.date), 'yyyy-MM-dd');
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
      width: 120,
      sortable: false,
      renderCell: params =>
        !params.row.readonly && (
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
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Workday Setting</Typography>
          <Box>
            <TextField
              select
              size="small"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              sx={{ mr: 1 }}
            >
              {years.map(y => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={() => setOpen(true)}>
              New Holiday
            </Button>
          </Box>
        </Box>
        <PageBreadcrumbs items={[{ label: 'Workday Setting' }]} />
        <Paper>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={row => row.id}
            autoHeight
            pageSize={25}
            rowsPerPageOptions={[25]}
            sx={{ width: '100%' }}
          />
        </Paper>
        <Popup open={open} onClose={() => setOpen(false)} title="Add Holiday">
          <WorkdayForm onSubmit={handleCreate} />
        </Popup>
        <Popup open={!!editRow} onClose={() => setEditRow(null)} title="Edit Holiday">
          {editRow && <WorkdayForm onSubmit={handleSave} initial={editRow} submitText="Save" />}
        </Popup>
        <ConfirmDialog
          open={!!deleteRow}
          title="Confirm Delete"
          content="Delete this holiday?"
          onClose={() => setDeleteRow(null)}
          onConfirm={confirmDelete}
        />
      </Container>
    </Layout>
  );
}

export default withAuth(WorkdayPage);
