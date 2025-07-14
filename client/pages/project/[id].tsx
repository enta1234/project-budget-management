// @ts-nocheck
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { PageBreadcrumbs } from '../../components';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart } from '@mui/x-charts';
import Chip from '@mui/material/Chip';
import api from '../../api';
import { Layout, Popup, ProjectForm, useToast, PageLoading } from '../../components';
import { withAuth } from '../../context/AuthContext';
import { differenceInDays, addDays, format, isAfter } from 'date-fns';
import { fetchWorkdays } from '../../models/workdayModel';
import { fetchSettings } from '../../models/settingsModel';

function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { showToast } = useToast();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [positions, setPositions] = useState([]);
  const [holidays, setHolidays] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    if (id) {
      Promise.all([
        api.get(`/api/v1/projects/${id}`),
        api.get('/api/v1/resources'),
        api.get('/api/v1/teams'),
        api.get('/api/v1/budgets/overview'),
        api.get('/api/v1/positions'),
      ]).then(([p, u, t, b, pos]) => {
        setProject(p.data);
        setUsers(u.data);
        setTeams(t.data);
        setBudgets(b.data);
        setPositions(pos.data);
        fetchSettings()
          .then(s => {
            if (s?.costMultiplier != null) {
              setMultiplier(Number(s.costMultiplier));
            }
          })
          .catch(() => {});
      });
    }
  }, [id]);

  useEffect(() => {
    async function loadWorkdays() {
      if (!project?.start) return;
      const startYear = new Date(project.start).getFullYear();
      const endYear = new Date().getFullYear();
      const years = [] as number[];
      for (let y = startYear; y <= endYear; y++) years.push(y);
      const data = await Promise.all(years.map(y => fetchWorkdays(y)));
      const map: Record<string, boolean> = {};
      data.flat().forEach(d => {
        const key = new Date(d.date).toISOString().split('T')[0];
        map[key] = true;
      });
      setHolidays(map);
    }
    loadWorkdays();
  }, [project?.start]);

  const members = users.filter(u => project?.members?.includes(u.id));
  const leadResource = users.find(u => u.id === project?.lead?._id);
  const memberList = [...(leadResource ? [leadResource] : []), ...members];
  const uniqueMembers = memberList.filter(
    (m, idx) => memberList.findIndex(u => u.id === m.id) === idx,
  );

  const posMap = useMemo(() => {
    const map: Record<string, { role: string; level: string }> = {};
    positions.forEach(p => {
      const [r, l] = p.label.split(' - ');
      map[p.value] = { role: r, level: l };
    });
    return map;
  }, [positions]);

  const levelOrder: Record<string, number> = {
    senior: 0,
    intermediate: 1,
    junior: 2,
  };

  const memberRows = uniqueMembers
    .map(m => ({
      ...m,
      isLead: m.id === project?.lead?._id,
      role: posMap[m.position]?.role || '',
      level: posMap[m.position]?.level || '',
    }))
    .sort((a, b) => {
      const aOrd = levelOrder[a.level?.toLowerCase()] ?? 99;
      const bOrd = levelOrder[b.level?.toLowerCase()] ?? 99;
      return aOrd - bOrd;
    });
  const resourceCount = uniqueMembers.length;
  const rateMap = budgets.reduce((m, b) => {
    m[b.id] = b.rate;
    return m;
  }, {} as Record<string, number>);
  const dailyCost =
    uniqueMembers.reduce((s, r) => s + (rateMap[r.position] || 0), 0) *
    multiplier;
  const workStart = project?.start ? new Date(project.start) : null;
  const workEnd = project?.end ? new Date(project.end) : new Date();
  const lastDay = workEnd && isAfter(workEnd, new Date()) ? new Date() : workEnd;
  const diff = workStart && lastDay ? differenceInDays(lastDay, workStart) + 1 : 0;
  const dailyData = [] as { day: string; manday: number; money: number }[];
  const roleCounts = {} as Record<string, number>;
  uniqueMembers.forEach(m => {
    roleCounts[m.position] = (roleCounts[m.position] || 0) + 1;
  });
  for (let i = 0; i < diff; i++) {
    const date = addDays(workStart as Date, i);
    const key = date.toISOString().split('T')[0];
    if (holidays[key]) continue;
    dailyData.push({
      day: format(date, 'MM-dd'),
      manday: resourceCount,
      money: dailyCost,
    });
  }
  const totalMandayUsed = dailyData.reduce((s, d) => s + d.manday, 0);
  const totalMoneyUsed = dailyData.reduce((s, d) => s + d.money, 0);
  const roleSlugs = Object.keys(roleCounts);
  const roleSeries = roleSlugs.map(s => ({ dataKey: s, label: s.replace('_', ' ') }));
  const roleDailyData = dailyData.map(d => {
    const entry: any = { day: d.day };
    roleSlugs.forEach(slug => {
      entry[slug] = roleCounts[slug];
    });
    return entry;
  });


  const memberColumns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: params => (
        <>
          {params.row.name}
          {params.row.isLead && <Chip label="Lead" size="small" sx={{ ml: 1 }} />}
        </>
      ),
    },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'level', headerName: 'Level', width: 120 },
  ];

  const currencyFormatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  });

  const handleSave = async data => {
    try {
      const payload = {
        ...data,
        resources: (data.members?.length || 0) + (data.lead ? 1 : 0),
      };
      await api.patch(`/api/v1/projects/${id}`, payload);
      const res = await api.get(`/api/v1/projects/${id}`);
      setProject(res.data);
      showToast('Project updated');
      setOpen(false);
    } catch (e) {
      showToast('Error updating project', { severity: 'error' });
    }
  };

  if (!project) {
    return (
      <Layout>
        <Container maxWidth={false} sx={{ mt: 4 }}>
          <PageLoading />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton size="small" onClick={() => router.back()} sx={{ mr: 1 }}>
            <ArrowBackIosNew fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h5" gutterBottom>
              {project.name}
            </Typography>
            {project.deleted && project.deletedAt && (
              <Typography variant="body2" color="error" sx={{ ml: 0.5 }}>
                {`This project will be deleted on ${new Date(project.deletedAt).toLocaleDateString()}`}
              </Typography>
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="outlined" onClick={() => setOpen(true)}>
            Edit
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 1 }}
            onClick={() =>
              router.push(
                `/plan-management/roadmap?project=${
                  project._id || project.id
                }`,
              )
            }
          >
            Manage Task
          </Button>
        </Box>
        <PageBreadcrumbs
          items={[
            { label: 'Project Management', href: '/project-management' },
            { label: project.name },
          ]}
        />
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'grid', rowGap: 1 }}>
            <Typography>
              <strong>Description:</strong> {project.description}
            </Typography>
            <Typography>
              <strong>Lead:</strong> {project.lead?.name || ''}
            </Typography>
            <Typography>
              <strong>Status:</strong> {project.status || ''}
            </Typography>
            <Typography>
              <strong>Manday:</strong> {project.manday ?? ''}
            </Typography>
            <Typography>
              <strong>Start:</strong>{' '}
              {project.start ? new Date(project.start).toLocaleDateString() : ''}
            </Typography>
          </Box>
        </Paper>
        {dailyData.length > 0 && (
          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Manday & Money Usage Per Day
            </Typography>
            <Typography variant="body2">
              Total Manday Used: {totalMandayUsed}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Total Cost Spent: {currencyFormatter.format(totalMoneyUsed)}
            </Typography>
            <BarChart
              height={300}
              dataset={dailyData}
              xAxis={[{ dataKey: 'day', scaleType: 'band' }]}
              series={[
                { dataKey: 'manday', label: 'Manday' },
                { dataKey: 'money', label: 'Cost' },
              ]}
            />
          </Paper>
        )}
        {roleSeries.length > 0 && (
          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Manday By Role & Level
            </Typography>
            <BarChart
              height={300}
              dataset={roleDailyData}
              xAxis={[{ dataKey: 'day', scaleType: 'band' }]}
              series={roleSeries}
            />
          </Paper>
        )}
        {memberRows.length > 0 && (
          <Paper sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Members
            </Typography>
          <DataGrid
            rows={memberRows}
            columns={memberColumns}
            autoHeight
            pageSize={25}
            rowsPerPageOptions={[25]}
            getRowId={row => row.id}
            sx={{ width: '100%' }}
          />
          </Paper>
        )}
        <Popup open={open} onClose={() => setOpen(false)} title="Edit Project">
          {project && (
            <ProjectForm
              open={open}
              users={users}
              teams={teams}
              budgets={budgets}
              onSubmit={handleSave}
              initial={{
                name: project.name,
                description: project.description,
                start: project.start ? new Date(project.start) : null,
                sprintStart: project.sprintStart ? new Date(project.sprintStart) : null,
                status: project.status || 'planing',
                lead: leadResource || null,
                members,
                manday: project.manday ?? '',
                sprintLength: project.sprintLength ? project.sprintLength / 7 : ''
              }}
              submitText="Save"
            />
          )}
        </Popup>
      </Container>
    </Layout>
  );
}

export default withAuth(ProjectDetail);
