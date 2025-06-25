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
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import {
  differenceInDays,
  format,
  differenceInYears,
  differenceInMonths,
  addYears,
  addMonths,
} from 'date-fns';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import api from '../api';
import { Layout, Popup, ProjectForm, useToast } from '../components';
import { withAuth, useAuth } from '../context/AuthContext';

const statusOptions = [
  'planing',
  'in progress',
  'break',
  'production',
  'waiting payment',
  'paid',
  'cancelled',
];

const statusColors: Record<string, any> = {
  planing: 'default',
  'in progress': 'info',
  break: 'warning',
  production: 'primary',
  'waiting payment': 'secondary',
  paid: 'success',
  cancelled: 'error',
};

function StatusCell({ id, value }: { id: string; value: string }) {
  const { showToast } = useToast();
  const [status, setStatus] = useState(value);

  const handleChange = async (e: any) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await api.patch(`/api/v1/projects/${id}`, { status: newStatus });
      showToast('Status updated');
    } catch {
      showToast('Error updating status', { severity: 'error' });
    }
  };

  return (
    <Select
      value={status}
      onChange={handleChange}
      size="small"
      renderValue={s => (
        <Chip label={s} color={statusColors[s as string] || 'default'} size="small" />
      )}
    >
      {statusOptions.map(s => (
        <MenuItem key={s} value={s}>
          <Chip label={s} color={statusColors[s] || 'default'} size="small" />
        </MenuItem>
      ))}
    </Select>
  );
}

function ProjectManagement() {
  const router = useRouter();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [budgets, setBudgets] = useState([]);

  async function loadData() {
    const [pro, usr, tm, bg] = await Promise.all([
      api.get('/api/v1/projects'),
      api.get('/api/v1/resources'),
      api.get('/api/v1/teams'),
      api.get('/api/v1/budgets/overview'),
    ]);
    const cleaned = pro.data.map((p: any) => {
      if (typeof p.onClick !== 'undefined') {
        const { onClick, ...rest } = p;
        return rest;
      }
      return p;
    });
    setProjects(cleaned);
    setUsers(usr.data);
    setTeams(tm.data);
    setBudgets(bg.data);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleCreate = async data => {
    try {
      const payload = {
        ...data,
        resources: (data.members?.length || 0) + (data.lead ? 1 : 0),
      };
      await api.post('/api/v1/projects', payload);
      showToast('Project created');
      setOpen(false);
      loadData();
    } catch (e) {
      showToast('Error creating project', { severity: 'error' });
    }
  };

  const handleDelete = async row => {
    if (window.confirm('Delete this project?')) {
      try {
        await api.delete(`/api/v1/projects/${row._id}`);
        showToast('Project deleted');
        loadData();
      } catch (e) {
        showToast('Error deleting project', { severity: 'error' });
      }
    }
  };

  const handleRestore = async row => {
    try {
      await api.patch(`/api/v1/projects/${row._id}/restore`, {});
      showToast('Project restored');
      loadData();
    } catch (e) {
      showToast('Error restoring project', { severity: 'error' });
    }
  };

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
    {
      field: 'name',
      headerName: 'Project Name',
      flex: 1,
      minWidth: 80,
      renderCell: params => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          <Typography variant="body2">{params.value}</Typography>
          {params.row.deleted && params.row.deletedAt && (
            <Typography variant="caption" color="error" sx={{ fontSize: '0.5em' }}>
              {`will be deleted on ${format(new Date(params.row.deletedAt), 'yyyy-MM-dd')}`}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'lead',
      headerName: 'Project Lead',
      flex: 1,
      minWidth: 80,
      valueGetter: (_value, row) => row.lead?.name || '',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 140,
      renderCell: params => (
        <StatusCell id={params.row._id} value={params.row.status || 'planing'} />
      ),
    },
    {
      field: 'totalMember',
      headerName: 'Team Size',
      width: 80,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      valueGetter: (_value, row) => row.resources ?? row.members?.length ?? 0,
    },
    {
      field: 'actualManday',
      headerName: 'Actual Mandays',
      width: 80,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      valueGetter: (_value, row) =>
        row.start && row.resources
          ? differenceInDays(new Date(), new Date(row.start)) * row.resources
          : '',
    },
    {
      field: 'manday',
      headerName: 'Estimated Mandays',
      width: 80,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
    },
    {
      field: 'start',
      headerName: 'Start Date',
      width: 120,
      valueGetter: (_value, row) =>
        row.start ? format(new Date(row.start), 'yyyy-MM-dd') : '',
    },
    {
      field: 'projectService',
      headerName: 'Service Duration',
      width: 130,
      valueGetter: (_value, row) =>
        row.start ? getServiceDuration(row.start) : '',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: params => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => router.push(`/project/${params.row._id}`)}
            disabled={params.row.deleted}
          >
            <DescriptionIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" disabled={params.row.deleted}>
            <DownloadIcon fontSize="small" />
          </IconButton>
          {params.row.deleted ? (
            <IconButton
              size="small"
              onClick={() => handleRestore(params.row)}
              className="restore-button"
            >
              <RestoreIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton size="small" onClick={() => handleDelete(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
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
            getRowClassName={params => (params.row.deleted ? 'project-disabled' : '')}
            pageSize={25}
            rowsPerPageOptions={[25]}
            autoHeight
            sx={{ width: '100%' }}
          />
        </Paper>
        <Popup open={open} onClose={() => setOpen(false)} title="Add Project">
          <ProjectForm
            users={users}
            teams={teams}
            budgets={budgets}
            onSubmit={handleCreate}
          />
        </Popup>
      </Container>
    </Layout>
  );
}

export default withAuth(ProjectManagement);
