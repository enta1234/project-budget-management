// @ts-nocheck
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Layout, PageBreadcrumbs, Popup } from '../../components';
import { withAuth } from '../../context/AuthContext';
import api from '../../api';
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
import EditIcon from '@mui/icons-material/Edit';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { addDays } from 'date-fns';
import {
  Gantt,
  ViewMode,
  Task as GanttTask,
} from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

function PlanningSetting() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [phases, setPhases] = useState([]);
  const [members, setMembers] = useState([]);
  const [viewMode, setViewMode] = useState(ViewMode.Week);
  const [dialog, setDialog] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [sprints, setSprints] = useState([]);

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

  useEffect(() => {
    if (!router.isReady) return;
    api
      .get('/api/v1/projects')
      .then(res => {
        const list = res.data
          .filter(p => !p.deleted)
          .map((p: any) => {
            if (typeof p.onClick !== 'undefined') {
              const { onClick, ...rest } = p;
              return rest;
            }
            return p;
          });
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
      api.get('/api/v1/planning/phases', { params: { project: pid } }),
      api.get('/api/v1/planning/tasks', { params: { project: pid } }),
      api.get('/api/v1/planning/milestones', { params: { project: pid } }),
      api.get(`/api/v1/projects/${pid}`),
      api.get('/api/v1/resources'),
    ]).then(([ph, t, m, proj, res]) => {
      setPhases(ph.data);
      setTasks(t.data);
      setMilestones(m.data);
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
    const [p, t, m, proj, res] = await Promise.all([
      api.get('/api/v1/planning/phases', { params: { project: pid } }),
      api.get('/api/v1/planning/tasks', { params: { project: pid } }),
      api.get('/api/v1/planning/milestones', { params: { project: pid } }),
      api.get(`/api/v1/projects/${pid}`),
      api.get('/api/v1/resources'),
    ]);
    setPhases(p.data);
    setTasks(t.data);
    setMilestones(m.data);
    const memIds = proj.data.members || [];
    const leadId = proj.data.lead?._id;
    const list = res.data.filter(u => memIds.includes(u.id) || u.id === leadId);
    setMembers(list);
  };

  const handleCreateTask = async data => {
    if (data.type === 'milestone') {
      await api.post('/api/v1/planning/milestones', {
        name: data.name,
        detail: data.detail,
        date: data.startDate,
        project: project._id,
      });
    } else {
      await api.post('/api/v1/planning/tasks', { ...data, project: project._id });
    }
    await refreshAll();
    setDialog('');
  };

  const handleUpdateTask = async data => {
    if (!editTask) return;
    await api.patch(`/api/v1/planning/tasks/${editTask._id || editTask.id}`, data);
    await refreshAll();
    setEditTask(null);
  };

  const handleDateChange = async (task: GanttTask) => {
    if (task.type !== 'task') return;
    await api.patch(`/api/v1/planning/tasks/${task.id}`, {
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

  const combinedTasks = [
    ...tasks,
    ...milestones.map(m => ({
      ...m,
      startDate: m.date,
      endDate: m.date,
      type: 'milestone',
    })),
  ];

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

  const ganttTasks: GanttTask[] = [
    ...tasks.map(t => ({
      start: t.startDate ? new Date(t.startDate) : new Date(),
      end: t.endDate ? new Date(t.endDate) : new Date(),
      name: t.name,
      id: t._id || t.id,
      type: 'task',
      progress: 0,
      dependencies: t.blockedBy ? [String(t.blockedBy)] : [],
      styles: { backgroundColor: statusColor(taskStatus(t)) },
    })),
    ...milestones.map(m => ({
      start: new Date(m.date),
      end: new Date(m.date),
      name: m.name,
      id: m._id || m.id,
      type: 'milestone',
      progress: 0,
    })),
  ];

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Planning Setting
        </Typography>
        <PageBreadcrumbs items={[{ label: 'Plan Management', href: '/plan-management' }, { label: 'Planning Setting' }]} />
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
        {project && sprints.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sprints
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              {sprints.map(s => (
                <Box key={s.number} sx={{ flex: 1, position: 'relative', mx: 0.5 }}>
                  <Box sx={{ borderBottom: '2px solid', borderColor: 'primary.main', height: 10 }} />
                  <Typography variant="caption" sx={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)' }}>
                    Sprint {s.number}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 10, display: 'block', textAlign: 'center', mt: 0.5 }}>
                    {new Date(s.start).toLocaleDateString()} - {new Date(s.end).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        )}
        {project && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Tasks</Typography>
                <Box>
                  <Button variant="contained" onClick={() => setDialog('task')} sx={{ mr: 1 }}>
                    Add Task
                  </Button>
                </Box>
              </Box>
              <Paper sx={{ p: 2, overflowX: 'auto' }}>
                <Box sx={{ minWidth: 800 }}>
                  <DataGrid
                    rows={combinedTasks.map(t => ({ id: t._id || t.id, ...t }))}
                  columns={[
                    { field: 'name', headerName: 'Name', flex: 1 },
                    { field: 'detail', headerName: 'Detail', flex: 1 },
                    { field: 'startDate', headerName: 'Start', valueFormatter: params => {
                      const value = params?.value;
                      return value ? new Date(value).toLocaleDateString() : '';
                    }, width: 120 },
                    { field: 'endDate', headerName: 'End', valueFormatter: params => {
                      const value = params?.value;
                      return value ? new Date(value).toLocaleDateString() : '';
                    }, width: 120 },
                    { field: 'owner', headerName: 'Owner', width: 120 },
                    { field: 'manday', headerName: 'Manday', width: 100, type: 'number' },
                    { field: 'duration', headerName: 'Duration', width: 100, type: 'number' },
                    { field: 'blockedBy', headerName: 'Blocked By', width: 120 },
                    { field: 'type', headerName: 'Type', width: 120 },
                    {
                      field: 'actions',
                      headerName: 'Action',
                      width: 80,
                      renderCell: params =>
                        params.row.type !== 'milestone' ? (
                          <IconButton
                            size="small"
                            onClick={() => setEditTask(params.row)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        ) : null,
                    },
                  ]}
                    autoHeight
                    hideFooter
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Schedule</Typography>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(_, v) => v && setViewMode(v)}
                  size="small"
                >
                  <ToggleButton value={ViewMode.Day}>Day</ToggleButton>
                  <ToggleButton value={ViewMode.Week}>Week</ToggleButton>
                  <ToggleButton value={ViewMode.Month}>Month</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Paper sx={{ p: 2, overflowX: 'auto' }}>
                <Grid container spacing={2}>
                  <Grid item xs={4} sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <TreeView>
                      {phases.map(ph => (
                        <TreeItem nodeId={String(ph._id || ph.id)} label={ph.name} key={ph._id || ph.id}>
                          {tasks
                            .filter(t => String(t.phase) === String(ph._id || ph.id))
                            .map(t => (
                              <TreeItem
                                nodeId={`task-${t._id || t.id}`}
                                key={t._id || t.id}
                                label={`${t.name} (${t.startDate ? new Date(t.startDate).toLocaleDateString() : ''} - ${t.endDate ? new Date(t.endDate).toLocaleDateString() : ''})`}
                              />
                            ))}
                        </TreeItem>
                      ))}
                      {tasks.filter(t => !t.phase).map(t => (
                        <TreeItem
                          nodeId={`task-${t._id || t.id}`}
                          key={t._id || t.id}
                          label={`${t.name} (${t.startDate ? new Date(t.startDate).toLocaleDateString() : ''} - ${t.endDate ? new Date(t.endDate).toLocaleDateString() : ''})`}
                        />
                      ))}
                      {milestones.map(m => (
                        <TreeItem
                          nodeId={`milestone-${m._id || m.id}`}
                          key={`m-${m._id || m.id}`}
                          label={`${m.name} (${new Date(m.date).toLocaleDateString()})`}
                        />
                      ))}
                    </TreeView>
                  </Grid>
                  <Grid item xs={8} sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {ganttTasks.length > 0 ? (
                      <Box sx={{ minWidth: 600, width: '100%' }}>
                        <Gantt
                          tasks={ganttTasks}
                          viewMode={viewMode}
                          onDateChange={handleDateChange}
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2" align="center">
                        No schedule data
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* closing tag for outer Grid container */}
            </Grid>
          )}
        <Popup open={dialog === 'task'} onClose={() => setDialog('')} title="Add Task/Feature">
          <TaskForm onSubmit={handleCreateTask} members={members} tasks={tasks} milestones={milestones} />
        </Popup>
        <Popup open={!!editTask} onClose={() => setEditTask(null)} title="Edit Task/Feature">
          {editTask && (
            <TaskForm
              onSubmit={handleUpdateTask}
              initial={editTask}
              members={members}
              tasks={tasks}
              milestones={milestones}
            />
          )}
        </Popup>
      </Container>
    </Layout>
  );
}

export default withAuth(PlanningSetting);
