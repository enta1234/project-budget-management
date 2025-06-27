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
import { differenceInDays } from 'date-fns';
import { Layout, PageBreadcrumbs } from '../../components';
import { withAuth } from '../../context/AuthContext';
import { fetchProjects } from '../../models/projectsModel';
import { fetchTeams } from '../../models/teamModel';
import { fetchResources } from '../../models/resourceModel';
import { fetchBudgets } from '../../models/budgetModel';

function DashboardDetail() {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [resources, setResources] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const [projectFilter, setProjectFilter] = useState([]);
  const [teamFilter, setTeamFilter] = useState([]);
  const [resourceFilter, setResourceFilter] = useState([]);

  const [mandayGroup, setMandayGroup] = useState('project');
  const [costGroup, setCostGroup] = useState('project');
  const [activityGroup, setActivityGroup] = useState('project');

  useEffect(() => {
    Promise.all([
      fetchProjects(),
      fetchTeams(),
      fetchResources(),
      fetchBudgets(),
    ])
      .then(([p, t, r, b]) => {
        setProjects(p);
        setTeams(t);
        setResources(r);
        setBudgets(b);
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
      const cost = days * rate;
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
  }, [filteredResources, rateMap]);

  const activityColumns = [
    { field: 'name', headerName: 'Resource', flex: 1 },
    { field: 'manday', headerName: 'Manday Used', width: 130, type: 'number' },
    { field: 'tasks', headerName: 'Tasks', width: 100, type: 'number' },
    {
      field: 'cost',
      headerName: 'Cost',
      width: 120,
      type: 'number',
      valueFormatter: params => params.value.toLocaleString(),
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
            <Grid item xs={12} md={4}>
              <Autocomplete
                multiple
                options={projects}
                getOptionLabel={o => o.name}
                value={projectFilter}
                onChange={(_, v) => setProjectFilter(v)}
                renderInput={params => <TextField {...params} label="Project" />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                multiple
                options={teams}
                getOptionLabel={o => o.name}
                value={teamFilter}
                onChange={(_, v) => setTeamFilter(v)}
                renderInput={params => <TextField {...params} label="Team" />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
                <Typography variant="body2">Diff: {mandaySummary.diff}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
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
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
      </Container>
    </Layout>
  );
}

export default withAuth(DashboardDetail);
