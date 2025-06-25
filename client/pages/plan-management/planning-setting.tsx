// @ts-nocheck
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Layout, PageBreadcrumbs, Popup } from '../../components';
import { withAuth } from '../../context/AuthContext';
import api from '../../api';
import TaskForm from '../../components/TaskForm';
import MilestoneForm from '../../components/MilestoneForm';
import { DataGrid } from '@mui/x-data-grid';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

function PlanningSetting() {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [dialog, setDialog] = useState('');

  useEffect(() => {
    api
      .get('/api/v1/projects')
      .then(res => setProjects(res.data.filter(p => !p.deleted)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!project) return;
    const pid = project._id || project.id;
    api.get('/api/v1/planning/tasks', { params: { project: pid } }).then(res => setTasks(res.data));
    api.get('/api/v1/planning/milestones', { params: { project: pid } }).then(res => setMilestones(res.data));
  }, [project]);

  const refreshAll = async () => {
    if (!project) return;
    const pid = project._id || project.id;
    const [t, m] = await Promise.all([
      api.get('/api/v1/planning/tasks', { params: { project: pid } }),
      api.get('/api/v1/planning/milestones', { params: { project: pid } }),
    ]);
    setTasks(t.data);
    setMilestones(m.data);
  };

  const handleCreateTask = async data => {
    await api.post('/api/v1/planning/tasks', { ...data, project: project._id });
    await refreshAll();
    setDialog('');
  };

  const handleCreateMilestone = async data => {
    await api.post('/api/v1/planning/milestones', { ...data, project: project._id });
    await refreshAll();
    setDialog('');
  };

  const milestoneDates = milestones.map(m => new Date(m.date).toDateString());

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
            isOptionEqualToValue={(o, v) => (o._id || o.id) === (v._id || v.id)}
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
          <Stack spacing={2}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Tasks / Features</Typography>
                <Button variant="contained" onClick={() => setDialog('task')}>Add</Button>
              </Box>
              <Paper sx={{ p: 2 }}>
                <DataGrid
                  rows={tasks.map(t => ({ id: t._id || t.id, ...t }))}
                  columns={[
                    { field: 'name', headerName: 'Name', flex: 1 },
                    { field: 'detail', headerName: 'Detail', flex: 1 },
                    { field: 'startDate', headerName: 'Start', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '', width: 120 },
                    { field: 'endDate', headerName: 'End', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '', width: 120 },
                    { field: 'owner', headerName: 'Owner', width: 120 },
                    { field: 'manday', headerName: 'Manday', width: 100, type: 'number' },
                    { field: 'blockedBy', headerName: 'Blocked By', width: 120 },
                    { field: 'isFeature', headerName: 'Feature', width: 80, type: 'boolean' },
                  ]}
                  autoHeight
                  hideFooter
                />
              </Paper>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Milestones</Typography>
                <Button variant="contained" onClick={() => setDialog('milestone')}>Add Milestone</Button>
              </Box>
              <Paper sx={{ p: 2 }}>
                <DataGrid
                  rows={milestones.map(m => ({ id: m._id || m.id, ...m }))}
                  columns={[
                    { field: 'name', headerName: 'Name', flex: 1 },
                    { field: 'detail', headerName: 'Detail', flex: 1 },
                    { field: 'date', headerName: 'Date', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '', width: 120 },
                  ]}
                  autoHeight
                  hideFooter
                />
              </Paper>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>Timeline</Typography>
              <Paper sx={{ p: 2 }}>
                <Timeline>
                  {[...tasks.map(t => ({ type: 'task', date: t.startDate || t.endDate, title: t.name })),
                    ...milestones.map(m => ({ type: 'milestone', date: m.date, title: m.name }))]
                    .filter(i => i.date)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((item, idx, arr) => (
                      <TimelineItem key={idx}>
                        <TimelineSeparator>
                          <TimelineDot />
                          {idx < arr.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          {item.title} - {new Date(item.date).toLocaleDateString()}
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                </Timeline>
              </Paper>
            </Box>
          </Stack>
        )}
        <Popup open={dialog === 'task'} onClose={() => setDialog('')} title="Add Task/Feature">
          <TaskForm onSubmit={handleCreateTask} />
        </Popup>
        <Popup open={dialog === 'milestone'} onClose={() => setDialog('')} title="Add Milestone">
          <MilestoneForm onSubmit={handleCreateMilestone} existingDates={milestoneDates} />
        </Popup>
      </Container>
    </Layout>
  );
}

export default withAuth(PlanningSetting);
