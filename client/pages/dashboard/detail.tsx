// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import { PieChart, BarChart } from '@mui/x-charts';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { differenceInDays } from 'date-fns';
import { Layout, PageBreadcrumbs } from '../../components';
import { withAuth } from '../../context/AuthContext';
import { fetchProjects } from '../../models/projectsModel';
import { fetchTeams } from '../../models/teamModel';
import { fetchResources } from '../../models/resourceModel';
import { fetchBudgets } from '../../models/budgetModel';
import { fetchSettings } from '../../models/settingsModel';

function DashboardDetail() {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [resources, setResources] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [costMultiplier, setCostMultiplier] = useState(1);

  const [projectFilter, setProjectFilter] = useState([]);
  const [teamFilter, setTeamFilter] = useState([]);
  const [resourceFilter, setResourceFilter] = useState([]);

  const [mandayGroup, setMandayGroup] = useState('project');
  const [costGroup, setCostGroup] = useState('project');
  const [activityGroup, setActivityGroup] = useState('project');
  const [activityFullscreen, setActivityFullscreen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchProjects(),
      fetchTeams(),
      fetchResources(),
      fetchBudgets(),
      fetchSettings(),
    ])
      .then(([p, t, r, b, s]) => {
        const activeProjects = Array.isArray(p)
          ? p.filter(pr => !pr.deleted)
          : [];
        setProjects(activeProjects);
        setTeams(t);
        setResources(r);
        setBudgets(b);
        if (s?.costMultiplier != null) {
          setCostMultiplier(Number(s.costMultiplier));
        }
      })
      .catch(console.error);
  }, []);

  const filteredProjects = useMemo(() => {
    if (!projectFilter.length) return projects;
    const ids = new Set(projectFilter.map(p => p.id));
    return projects.filter(p => ids.has(p.id));
  }, [projects, projectFilter]);

  const filteredResources = useMemo(() => {
    let list = resources;
    if (resourceFilter.length) {
      const ids = new Set(resourceFilter.map(r => r.id));
      list = list.filter(r => ids.has(r.id));
    }
    if (teamFilter.length) {
      const teamIds = new Set(teamFilter.map(t => t.id));
      const memberIds = new Set();
      teams
        .filter(t => teamIds.has(t.id))
        .forEach(t => t.members.forEach(m => memberIds.add(m)));
      list = list.filter(r => memberIds.has(r.id));
    }
    return list;
  }, [resources, resourceFilter, teamFilter, teams]);

  const rateMap = useMemo(() => {
    const map = {} as Record<string, number>;
    budgets.forEach(b => {
      const slug = `${b.role} ${b.level}`.toLowerCase().replace(/\s+/g, '_');
      map[slug] = b.rate;
    });
    return map;
  }, [budgets]);

  const mandaySummary = useMemo(() => {
    let est = 0;
    let act = 0;
    const today = new Date();
    filteredProjects.forEach(p => {
      est += p.manday || 0;
      if (p.start) {
        const start = new Date(p.start);
        const end = new Date(p.end || today);
        const last = end > today ? today : end;
        const diff = differenceInDays(last, start) + 1;
        act += diff * (p.resources || 0);
      }
    });
    return { est, act, diff: act - est };
  }, [filteredProjects]);

  const costData = useMemo(() => {
    let total = 0;
    const byRole: Record<string, number> = {};
    const resourceRows: any[] = [];
    const today = new Date();
    filteredResources.forEach(r => {
      const days = differenceInDays(today, new Date(r.startDate || today)) + 1;
      const rate = rateMap[r.position] || 0;
      const cost = days * rate * costMultiplier;
      total += cost;
      const role = r.position.split('_')[0];
      byRole[role] = (byRole[role] || 0) + cost;
      resourceRows.push({
        id: r.id,
        name: r.name,
        manday: days,
        tasks: 0,
        cost,
        utilization: Math.min(100, Math.round((days / 220) * 100)),
      });
    });
    const avgRate: Record<string, number> = {};
    Object.keys(byRole).forEach(role => {
      const roleRes = filteredResources.filter(r => r.position.startsWith(role));
      const sumRate = roleRes.reduce(
        (s, r) => s + (rateMap[r.position] || 0),
        0,
      );
      avgRate[role] = roleRes.length ? sumRate / roleRes.length : 0;
    });
    return { total, byRole, avgRate, resourceRows };
  }, [filteredResources, rateMap, costMultiplier]);

  const mandayChartData = [
    { label: 'Estimated', value: mandaySummary.est },
    { label: 'Actual', value: mandaySummary.act },
    { label: 'Diff', value: mandaySummary.diff },
  ];

  const costChartData = Object.keys(costData.byRole).map(role => ({
    id: role,
    value: costData.byRole[role],
    label: role,
  }));

  const activityColumns = [
    { field: 'name', headerName: 'Resource', flex: 1 },
    { field: 'manday', headerName: 'Manday Used', width: 130, type: 'number' },
    { field: 'tasks', headerName: 'Tasks', width: 100, type: 'number' },
    {
      field: 'cost',
      headerName: 'Cost',
      width: 120,
      type: 'number',
      valueFormatter: params => params.value?.toLocaleString() || '',
    },
    {
      field: 'utilization',
      headerName: 'Util %',
      width: 100,
      type: 'number',
    },
  ];

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Dashboard Detail
        </Typography>
        <PageBreadcrumbs items={[{ label: 'Dashboard Detail' }]} />

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Criteria Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                multiple
                options={projects}
                getOptionLabel={o => o.name}
                value={projectFilter}
                onChange={(_, v) => setProjectFilter(v)}
                renderInput={params => <TextField {...params} label="Project" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                multiple
                options={teams}
                getOptionLabel={o => o.name}
                value={teamFilter}
                onChange={(_, v) => setTeamFilter(v)}
                renderInput={params => <TextField {...params} label="Team" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                multiple
                options={resources}
                getOptionLabel={o => o.name}
                value={resourceFilter}
                onChange={(_, v) => setResourceFilter(v)}
                renderInput={params => (
                  <TextField {...params} label="Resource" />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Manday Summary</Typography>
                <FormControl size="small" sx={{ width: 100 }}>
                  <InputLabel id="manday-group-label">Group By</InputLabel>
                  <Select
                    labelId="manday-group-label"
                    label="Group By"
                    value={mandayGroup}
                    onChange={e => setMandayGroup(e.target.value)}
                  >
                    <MenuItem value="project">Project</MenuItem>
                    <MenuItem value="team">Team</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">Estimated: {mandaySummary.est}</Typography>
                <Typography variant="body2">Actual: {mandaySummary.act}</Typography>
                <Typography variant="body2" gutterBottom>Diff: {mandaySummary.diff}</Typography>
                <BarChart
                  height={150}
                  dataset={mandayChartData}
                  xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
                  series={[{ dataKey: 'value', label: 'Manday' }]}
                />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Cost Breakdown</Typography>
                <FormControl size="small" sx={{ width: 100 }}>
                  <InputLabel id="cost-group-label">Group By</InputLabel>
                  <Select
                    labelId="cost-group-label"
                    label="Group By"
                    value={costGroup}
                    onChange={e => setCostGroup(e.target.value)}
                  >
                    <MenuItem value="project">Project</MenuItem>
                    <MenuItem value="team">Team</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  Total Cost: {costData.total.toLocaleString()}
                </Typography>
                {Object.keys(costData.avgRate).map(role => (
                  <Typography key={role} variant="body2">
                    {role} Avg Rate: {costData.avgRate[role].toLocaleString()}
                  </Typography>
                ))}
                <PieChart height={150} series={[{ data: costChartData }]} />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Resource Activity</Typography>
                <FormControl size="small" sx={{ width: 100 }}>
                  <InputLabel id="activity-group-label">Group By</InputLabel>
                  <Select
                    labelId="activity-group-label"
                    label="Group By"
                    value={activityGroup}
                    onChange={e => setActivityGroup(e.target.value)}
                  >
                    <MenuItem value="project">Project</MenuItem>
                    <MenuItem value="team">Team</MenuItem>
                  </Select>
                </FormControl>
                <IconButton size="small" onClick={() => setActivityFullscreen(true)}>
                  <FullscreenIcon fontSize="inherit" />
                </IconButton>
              </Box>
              <Box sx={{ height: 300, mt: 1 }}>
                <DataGrid
                  rows={costData.resourceRows}
                  columns={activityColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  getRowId={row => row.id}
                  sx={{ width: '100%' }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Dialog fullScreen open={activityFullscreen} onClose={() => setActivityFullscreen(false)}>
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar variant="dense">
              <IconButton edge="start" color="inherit" onClick={() => setActivityFullscreen(false)} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Resource Activity
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ p: 2, flexGrow: 1 }}>
            <DataGrid
              rows={costData.resourceRows}
              columns={activityColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={row => row.id}
              sx={{ width: '100%', height: '100%' }}
            />
          </Box>
        </Dialog>
      </Container>
    </Layout>
  );
}

export default withAuth(DashboardDetail);
