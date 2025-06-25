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
import PhaseForm from '../../components/PhaseForm';
import TaskForm from '../../components/TaskForm';
import MilestoneForm from '../../components/MilestoneForm';

function PlanningSetting() {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [phases, setPhases] = useState([]);
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
    api.get('/api/v1/planning/phases', { params: { project: pid } }).then(res => setPhases(res.data));
    api.get('/api/v1/planning/tasks', { params: { project: pid } }).then(res => setTasks(res.data));
    api.get('/api/v1/planning/milestones', { params: { project: pid } }).then(res => setMilestones(res.data));
  }, [project]);

  const refreshAll = async () => {
    if (!project) return;
    const pid = project._id || project.id;
    const [p, t, m] = await Promise.all([
      api.get('/api/v1/planning/phases', { params: { project: pid } }),
      api.get('/api/v1/planning/tasks', { params: { project: pid } }),
      api.get('/api/v1/planning/milestones', { params: { project: pid } }),
    ]);
    setPhases(p.data);
    setTasks(t.data);
    setMilestones(m.data);
  };

  const handleCreatePhase = async data => {
    await api.post('/api/v1/planning/phases', { ...data, project: project._id });
    await refreshAll();
    setDialog('');
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
                <Typography variant="h6">Phases</Typography>
                <Button variant="contained" onClick={() => setDialog('phase')}>Add Phase</Button>
              </Box>
              <Paper sx={{ p: 2 }}>
                {phases.map((p, idx) => (
                  <Typography key={p._id || idx}>{p.name}</Typography>
                ))}
              </Paper>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Tasks / Features</Typography>
                <Button variant="contained" onClick={() => setDialog('task')} disabled={phases.length === 0}>Add</Button>
              </Box>
              <Paper sx={{ p: 2 }}>
                {tasks.map((t, idx) => (
                  <Typography key={t._id || idx}>{t.name} {t.isFeature ? '(Feature)' : ''}</Typography>
                ))}
              </Paper>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Milestones</Typography>
                <Button variant="contained" onClick={() => setDialog('milestone')}>Add Milestone</Button>
              </Box>
              <Paper sx={{ p: 2 }}>
                {milestones.map((m, idx) => (
                  <Typography key={m._id || idx}>{m.name} - {new Date(m.date).toLocaleDateString()}</Typography>
                ))}
              </Paper>
            </Box>
          </Stack>
        )}
        <Popup open={dialog === 'phase'} onClose={() => setDialog('')} title="Add Phase">
          <PhaseForm onSubmit={handleCreatePhase} />
        </Popup>
        <Popup open={dialog === 'task'} onClose={() => setDialog('')} title="Add Task/Feature">
          <TaskForm phases={phases} onSubmit={handleCreateTask} />
        </Popup>
        <Popup open={dialog === 'milestone'} onClose={() => setDialog('')} title="Add Milestone">
          <MilestoneForm onSubmit={handleCreateMilestone} existingDates={milestoneDates} />
        </Popup>
      </Container>
    </Layout>
  );
}

export default withAuth(PlanningSetting);
