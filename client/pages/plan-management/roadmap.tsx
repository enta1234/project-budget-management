// @ts-nocheck
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Layout, PageBreadcrumbs, Popup, ConfirmDialog, useToast, ProjectTimeline } from '../../components';
import { withAuth } from '../../context/AuthContext';
import api from '../../api';
import {
  fetchPhases,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../models/planningModel';
import TaskForm from '../../components/TaskForm';
import { DataGrid } from '@mui/x-data-grid';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { sanitizeList } from '../../utils/sanitize';
import { addDays, differenceInCalendarDays } from 'date-fns';
import {
  Gantt,
  ViewMode,
  Task as GanttTask,
} from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

function Roadmap() {
  const router = useRouter();
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [phases, setPhases] = useState([]);
  const [members, setMembers] = useState([]);
  const [viewMode, setViewMode] = useState(ViewMode.Week);
  const [scheduleView, setScheduleView] = useState<'gantt' | 'roadmap'>('gantt');
  const [dialog, setDialog] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [sprints, setSprints] = useState([]);
  const ganttRef = useRef<HTMLDivElement | null>(null);
  const columnWidth = 60;

  const idNameMap = useMemo(() => {
    const m: Record<string, string> = {};
    members.forEach(mem => {
      m[mem.id] = mem.name;
    });
    return m;
  }, [members]);

  const statusOptions = [
    'planing',
    'in progress',
    'break',
    'production',
    'waiting payment',
    'paid',
    'cancelled',
  ];

  const statusColors: Record<string, string> = {
    planing: 'default',
    'in progress': 'info',
    break: 'warning',
    production: 'primary',
    'waiting payment': 'secondary',
    paid: 'success',
    cancelled: 'error',
  };

  const cleanList = <T extends Record<string, unknown>>(items: T[]) =>
    sanitizeList(items);

  useEffect(() => {
    if (!router.isReady) return;
    api
      .get('/api/v1/projects')
      .then(res => {
        const list = sanitizeList(res.data.filter(p => !p.deleted));
        setProjects(list);
        const pid = router.query.project;
        if (pid) {
          const p = list.find(pr => String(pr._id || pr.id) === pid);
          if (p) setProject(p);
        }
      })
      .catch(console.error);
  }, [router.isReady, router.query.project]);

  useEffect(() => {
    if (!project) return;
    const pid = project._id || project.id;
    Promise.all([
      fetchPhases(pid),
      fetchTasks(pid),
      api.get(`/api/v1/projects/${pid}`),
      api.get('/api/v1/resources'),
    ]).then(([ph, t, proj, res]) => {
      setPhases(ph);
      setTasks(cleanList(t));
      const memIds = proj.data.members || [];
      const leadId = proj.data.lead?._id;
      const list = res.data.filter(u => memIds.includes(u.id) || u.id === leadId);
      setMembers(list);
      // calculate sprints
      if (proj.data.start && proj.data.sprintLength) {
        const start = new Date(proj.data.start);
        const end = proj.data.end ? new Date(proj.data.end) : new Date();
        const len = Number(proj.data.sprintLength);
        const arr = [] as any[];
        let s = new Date(start);
        let e = addDays(start, len - 1);
        let num = 1;
        while (s <= end) {
          arr.push({
            number: num,
            start: new Date(s),
            end: e > end ? new Date(end) : new Date(e),
          });
          num += 1;
          s = addDays(s, len);
          e = addDays(s, len - 1);
        }
        setSprints(arr);
      } else {
        setSprints([]);
      }
    });
  }, [project]);

  const refreshAll = async () => {
    if (!project) return;
    const pid = project._id || project.id;
    const [p, t, proj, res] = await Promise.all([
      fetchPhases(pid),
      fetchTasks(pid),
      api.get(`/api/v1/projects/${pid}`),
      api.get('/api/v1/resources'),
    ]);
    setPhases(p);
    setTasks(cleanList(t));
    const memIds = proj.data.members || [];
    const leadId = proj.data.lead?._id;
    const list = res.data.filter(u => memIds.includes(u.id) || u.id === leadId);
    setMembers(list);
  };

  const handleCreateTask = async data => {
    await createTask(project._id, data);
    await refreshAll();
    setDialog('');
  };

  const handleUpdateTask = async data => {
    if (!editTask) return;
    await updateTask(editTask._id || editTask.id, data);
    await refreshAll();
    setEditTask(null);
  };

  const handleDelete = row => {
    setDeleteRow(row);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(deleteRow._id || deleteRow.id);
      showToast('Item deleted');
      await refreshAll();
    } catch (e) {
      console.error(e);
      showToast('Error deleting item', { severity: 'error' });
    }
    setDeleteRow(null);
  };

  const handleDateChange = async (task: GanttTask) => {
    if (task.type !== 'task') return;
    await updateTask(task.id, {
      startDate: task.start,
      endDate: task.end,
    });
    await refreshAll();
  };

  const handleStatusChange = async (e: any) => {
    if (!project) return;
    const newStatus = e.target.value;
    setProject({ ...project, status: newStatus });
    try {
      await api.patch(`/api/v1/projects/${project._id || project.id}`, {
        status: newStatus,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const combinedTasks = tasks;

  const taskStatus = t => {
    const now = new Date();
    const start = t.startDate ? new Date(t.startDate) : null;
    const end = t.endDate ? new Date(t.endDate) : null;
    if (end && end.getTime() < now.getTime()) return 'late';
    if (start && start.getTime() > now.getTime()) return 'not-started';
    if (start && end && start.getTime() <= now.getTime() && end.getTime() >= now.getTime()) return 'in-progress';
    return 'not-started';
  };

  const statusColor = status =>
    ({ 'not-started': 'grey', 'in-progress': '#2196f3', late: 'red' }[status] || 'grey');

  const parseValidDate = (value: any): Date | null => {
    if (!value) return null;
    try {
      const d = value instanceof Date ? value : new Date(value);
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  };

  const toGanttTask = (t: any): GanttTask | null => {
    const start = parseValidDate(t.startDate || t.date);
    if (!start) return null;
    const end = parseValidDate(t.endDate) || start;
    if (!end) return null;
    return {
      start,
      end,
      name: t.name ?? '',
      id: t._id || t.id,
      type: t.type === 'milestone' ? 'milestone' : 'task',
      progress: 0,
      dependencies: t.blockedBy ? [String(t.blockedBy)] : [],
      styles: { backgroundColor: statusColor(taskStatus(t)) },
    } as GanttTask;
  };

  const ganttTasks: GanttTask[] = tasks.map(toGanttTask).filter(Boolean);

  useEffect(() => {
    if (!project || !project.start || !ganttRef.current) return;
    const container = ganttRef.current;
    const start = new Date(project.start as any);
    const today = new Date();
    const diff = differenceInCalendarDays(today, start);
    const unit = viewMode === ViewMode.Week ? 7 : viewMode === ViewMode.Month ? 30 : 1;
    const dayWidth = columnWidth / unit;
    const offset = diff * dayWidth - container.clientWidth / 2;
    container.scrollLeft = offset > 0 ? offset : 0;
  }, [project, viewMode, tasks]);

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Roadmap
        </Typography>
        <PageBreadcrumbs items={[{ label: 'Plan Management', href: '/plan-management' }, { label: 'Roadmap' }]} />
        <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
          <Autocomplete
            options={projects}
            getOptionLabel={o => o.name}
            isOptionEqualToValue={(o, v) =>
              v ? (o._id || o.id) === (v._id || v.id) : false
            }
            renderOption={(props, option) => (
              <li {...props} key={option._id || option.id}>
                {option.name}
              </li>
            )}
            value={project}
            onChange={(_, v) => setProject(v)}
            renderInput={params => <TextField {...params} label="Project" />}
          />
        </Paper>
        {project && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {project.name}
            </Typography>
            <Box sx={{ display: 'grid', rowGap: 1 }}>
              <Typography>
                <strong>Description:</strong> {project.description}
              </Typography>
              <Typography>
                <strong>Start:</strong>{' '}
                {project.start ? new Date(project.start).toLocaleDateString() : ''}
              </Typography>
              <Typography>
                <strong>End:</strong>{' '}
                {project.end ? new Date(project.end).toLocaleDateString() : ''}
              </Typography>
              <Typography>
                <strong>Sprint Length:</strong> {project.sprintLength || '-'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 1 }}>
                  <strong>Status:</strong>
                </Typography>
                <Select
                  value={project.status || 'planing'}
                  onChange={handleStatusChange}
                  size="small"
                  renderValue={s => (
                    <Chip
                      label={s}
                      color={statusColors[s as string] || 'default'}
                      size="small"
                    />
                  )}
                >
                  {statusOptions.map(s => (
                    <MenuItem key={s} value={s}>
                      <Chip label={s} color={statusColors[s] || 'default'} size="small" />
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Paper>
        )}
        {project && (
          <Grid container>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Tasks</Typography>
                <Box>
                  <Button variant="contained" onClick={() => setDialog('task')} sx={{ mr: 1 }}>
                    Add Task
                  </Button>
                </Box>
              </Box>
              <Paper sx={{ p: 2, minWidth: '100%', overflowX: 'auto', mb: 2 }}>
                <Box sx={{ minWidth: '100%' }}>
                  <DataGrid
                    rows={combinedTasks.map(t => ({ id: t._id || t.id, ...t }))}
                    columns={[
                      { field: 'name', headerName: 'Name', flex: 1, width: 160 },
                      {
                        field: 'startDate',
                        headerName: 'Start Date',
                        valueFormatter: params => {
                          return params ? new Date(params).toLocaleDateString() : '-';
                        },
                        width: 140,
                      },
                      {
                        field: 'endDate',
                        headerName: 'End Date',
                        valueFormatter: params => {
                          return params ? new Date(params).toLocaleDateString() : '-';
                        },
                        width: 140,
                      },
                      {
                        field: 'roles',
                        headerName: 'Roles',
                        width: 160,
                        valueGetter: (_value, row) =>
                          Array.isArray(row.roles) ? row.roles.join(', ') : '-',
                      },
                      {
                        field: 'assignees',
                        headerName: 'Assignees',
                        width: 160,
                        valueGetter: (_value, row) => {
                          if (!row.assignees) return '';
                          const list: string[] = [];
                          Object.values(row.assignees).forEach((ids: any) => {
                            if (Array.isArray(ids)) {
                              ids.forEach((id: string) => {
                                if (idNameMap[id]) list.push(idNameMap[id]);
                              });
                            }
                          });
                          return list.join(', ');
                        },
                      },
                    {
                      field: 'manday',
                      headerName: 'Manday',
                      width: 100,
                      type: 'number',
                      valueGetter: (value) => {
                        return value ?? '-';
                      },
                    },
                    {
                      field: 'actualManday',
                      headerName: 'Actual Manday',
                      width: 120,
                      type: 'number',
                      valueGetter: (_value, row) => {
                        const startValue = row.startDate || row.date;
                        if (!startValue) return '';
                        const start = new Date(startValue);
                        const end = row.endDate ? new Date(row.endDate) : new Date();
                        const today = new Date();
                        const until = end < today ? end : today;
                        const diff = differenceInCalendarDays(until, start) + 1;
                        return diff > 0 ? diff : 0;
                      },
                    },
                    { field: 'duration', headerName: 'Duration', width: 100, type: 'number' },
                    {
                      field: 'blockedBy',
                      headerName: 'Blocked By',
                      width: 160,
                      valueGetter: (_value, row) => {
                        const allItems = tasks;
                        const target = allItems.find(i => String(i._id || i.id) === String(row.blockedBy));
                        return target ? target.name : '';
                      },
                    },
                    { field: 'type', headerName: 'Type', width: 120 },
                    {
                      field: 'actions',
                      headerName: 'Action',
                      width: 110,
                      sortable: false,
                      renderCell: params => (
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small" onClick={() => setEditTask(params.row)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(params.row)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      ),
                    },
                  ]}
                    autoHeight
                    hideFooter
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Schedule</Typography>
                <Box>
                  <ToggleButtonGroup
                    value={scheduleView}
                    exclusive
                    onChange={(_, v) => v && setScheduleView(v)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <ToggleButton value="gantt">Gantt</ToggleButton>
                    <ToggleButton value="roadmap">Roadmap</ToggleButton>
                  </ToggleButtonGroup>
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, v) => v && setViewMode(v)}
                    size="small"
                    sx={{ display: scheduleView === 'gantt' ? 'inline-flex' : 'none' }}
                  >
                    <ToggleButton value={ViewMode.Day}>Day</ToggleButton>
                    <ToggleButton value={ViewMode.Week}>Week</ToggleButton>
                    <ToggleButton value={ViewMode.Month}>Month</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>
              <Paper sx={{ p: 2, overflowX: 'auto', maxWidth: '114rem' }}>
                <Grid container spacing={2}>
                  <Grid size={12} sx={{ maxWidth: '100%', overflow: 'auto' }}>
                    {scheduleView === 'gantt' ? (
                      ganttTasks.length > 0 ? (
                        <Box ref={ganttRef} sx={{ width: '100%', overflowX: 'auto' }}>
                          <Gantt
                            tasks={ganttTasks}
                            viewMode={viewMode}
                            onDateChange={handleDateChange}
                            columnWidth={columnWidth}
                            viewDate={Date.now()}
                            preStepsCount={0}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" align="center">
                          No schedule data
                        </Typography>
                      )
                    ) : (
                      tasks.length > 0 ? (
                        <ProjectTimeline projects={[{ ...project, tasks }]} />
                      ) : (
                        <Typography variant="body2" align="center">
                          No schedule data
                        </Typography>
                      )
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* closing tag for outer Grid container */}
            </Grid>
          )}
        <Popup open={dialog === 'task'} onClose={() => setDialog('')} title="Add Task">
          <TaskForm onSubmit={handleCreateTask} tasks={tasks} members={members} />
        </Popup>
        <Popup open={!!editTask} onClose={() => setEditTask(null)} title="Edit Task">
          {editTask && (
            <TaskForm
              onSubmit={handleUpdateTask}
              initial={editTask}
              tasks={tasks}
              members={members}
            />
          )}
        </Popup>
        <ConfirmDialog
          open={!!deleteRow}
          title="Confirm Delete"
          content="Delete this item?"
          onClose={() => setDeleteRow(null)}
          onConfirm={confirmDelete}
        />
      </Container>
    </Layout>
  );
}

export default withAuth(Roadmap);
