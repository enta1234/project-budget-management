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
import api from '../../api';
import { Layout, Popup, TeamForm, useToast, ConfirmDialog, PageBreadcrumbs } from '../../components';
import {
  fetchTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from '../../models/teamModel';
import { withAuth, useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

function TeamPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);

  async function loadData() {
    const [t, u] = await Promise.all([
      fetchTeams(),
      api.get('/api/v1/resources'),
    ]);
    setTeams(t);
    setUsers(u.data);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleCreate = async data => {
    try {
      await createTeam(data);
      showToast('Team created');
      setOpen(false);
      loadData();
    } catch (e) {
      showToast('Error creating team', { severity: 'error' });
    }
  };

  const handleSave = async data => {
    try {
      if (editRow?._id) {
        await updateTeam(editRow._id, data);
        showToast('Team updated');
        setEditRow(null);
        loadData();
      }
    } catch (e) {
      showToast('Error updating team', { severity: 'error' });
    }
  };

  const handleDelete = row => {
    setDeleteRow(row);
  };

  const confirmDelete = async () => {
    try {
      await deleteTeam(deleteRow._id);
      showToast('Team deleted');
      loadData();
    } catch (e) {
      showToast('Error deleting team', { severity: 'error' });
    }
    setDeleteRow(null);
  };

  const columns = [
    { field: 'name', headerName: 'Team Name', flex: 1 },
    { field: 'lead', headerName: 'Team Lead', flex: 1 },
    {
      field: 'totalMember',
      headerName: 'Total Member',
      width: 120,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      valueGetter: (_value, row) => {
        if (Array.isArray(row?.members)) {
          const count = row.members.length + (row.lead ? 1 : 0);
          return count;
        }
        return '';
      },
    },
    {
      field: 'createdAt',
      headerName: 'Create Date',
      width: 150,
      valueGetter: (_value, row) => {
        if (row?.createdAt) {
          try {
            return format(new Date(row.createdAt), 'yyyy-MM-dd');
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
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Teams</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            New Team
          </Button>
        </Box>
        <PageBreadcrumbs items={[{ label: 'Teams' }]} />
        <Paper>
          <DataGrid
            rows={teams}
            columns={columns}
            getRowId={row => row._id}
            autoHeight
            pageSize={25}
            rowsPerPageOptions={[25]}
            sx={{ width: '100%' }}
          />
        </Paper>
        <Popup open={open} onClose={() => setOpen(false)} title="Add Team">
          <TeamForm users={users} onSubmit={handleCreate} />
        </Popup>
        <Popup open={!!editRow} onClose={() => setEditRow(null)} title="Edit Team">
          {editRow && (
            <TeamForm
              users={users}
              onSubmit={handleSave}
              initial={editRow}
              submitText="Save"
            />
          )}
        </Popup>
        <ConfirmDialog
          open={!!deleteRow}
          title="Confirm Delete"
          content="Delete this team?"
          onClose={() => setDeleteRow(null)}
          onConfirm={confirmDelete}
        />
      </Container>
    </Layout>
  );
}

export default withAuth(TeamPage);
