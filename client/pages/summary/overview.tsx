// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PieChart, LineChart, BarChart } from '@mui/x-charts';
import ReactECharts from 'echarts-for-react';
import { differenceInDays, addDays } from 'date-fns';
import {
  Layout,
  PageBreadcrumbs,
  RoleCard,
  MetricCard,
} from '../../components';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { withAuth } from '../../context/AuthContext';
import { fetchBudgetOverview } from '../../models/budgetModel';
import api from '../../api';

interface LevelSummary {
  headcount: number;
  manday: number;
  available: number;
  avgRate: number;
}

interface RoleSummary {
  role: string;
  headcount: number;
  manday: number;
  available: number;
  rateSum: number;
  levels: Record<string, LevelSummary>;
}

function DashboardOverview() {
  const [overview, setOverview] = useState([]);
  const [resources, setResources] = useState([]);
  const [projects, setProjects] = useState([]);
  const [unassigned, setUnassigned] = useState(0);
  const [dailyManday, setDailyManday] = useState([]);
  const [dailyCost, setDailyCost] = useState([]);
  const [utilData, setUtilData] = useState([]);

  const totalProjects = projects.length;
  const totalResources = resources.length;

  async function loadData() {
    const [ov, res, pro] = await Promise.all([
      fetchBudgetOverview(),
      api.get('/api/v1/resources'),
      api.get('/api/v1/projects'),
    ]);
    setOverview(ov);
    setResources(res.data);
    setProjects(pro.data);

    const assigned = new Set();
    pro.data.forEach(p => {
      if (p.lead?._id) assigned.add(p.lead._id);
      if (Array.isArray(p.members)) p.members.forEach(id => assigned.add(id));
    });
    setUnassigned(res.data.filter(r => !assigned.has(r.id)).length);

    // ---------- Manday Tracking per Day ----------
    if (pro.data.length > 0) {
      const start = new Date(
        Math.min(...pro.data.map(p => new Date(p.start).getTime())),
      );
      const end = new Date(
        Math.max(...pro.data.map(p => new Date(p.end).getTime())),
      );
      const days = differenceInDays(end, start) + 1;
      const daily: any[] = [];
      for (let i = 0; i < days; i++) {
        const d = addDays(start, i);
        const dateStr = d.toISOString().split('T')[0];
        let est = 0;
        let act = 0;
        pro.data.forEach(p => {
          const ps = new Date(p.start);
          const pe = new Date(p.end);
          if (d >= ps && d <= pe) {
            const dur = differenceInDays(pe, ps) + 1;
            est += (p.manday || 0) / dur;
            act += p.resources || 0;
          }
        });
        daily.push({ date: dateStr, estimate: Number(est.toFixed(2)), actual: act });
      }
      setDailyManday(daily);
    } else {
      setDailyManday([]);
    }

    // ---------- Daily Cost Summary ----------
    if (res.data.length > 0 && ov.length > 0) {
      const rateMap: Record<string, number> = {};
      const roleMap: Record<string, string> = {};
      ov.forEach(o => {
        const slug = `${o.role} ${o.level}`.toLowerCase().replace(/\s+/g, '_');
        rateMap[slug] = o.rate;
        roleMap[slug] = o.role;
      });

      const start = new Date(
        Math.min(...res.data.map(r => new Date(r.startDate || Date.now()).getTime())),
      );
      const end = new Date();
      const days = Math.min(30, differenceInDays(end, start) + 1);
      const cost: any[] = [];
      for (let i = 0; i < days; i++) {
        const d = addDays(end, -i);
        const dateStr = d.toISOString().split('T')[0];
        const byRole: Record<string, number> = {};
        res.data.forEach(r => {
          const rs = new Date(r.startDate || Date.now());
          if (d >= rs) {
            const role = roleMap[r.position] || 'Other';
            byRole[role] = (byRole[role] || 0) + (rateMap[r.position] || 0);
          }
        });
        cost.unshift({ date: dateStr, ...byRole });
      }
      setDailyCost(cost);
    } else {
      setDailyCost([]);
    }

    // ---------- Resource Utilization ----------
    if (res.data.length > 0) {
      const today = new Date();
      const util = res.data.map(r => {
        const days = differenceInDays(today, new Date(r.startDate || today)) + 1;
        const manday = days;
        const workload = Math.min(100, Math.round((manday / 220) * 100));
        return { name: r.name, manday, workload };
      });
      setUtilData(util);
    } else {
      setUtilData([]);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const totalCost = overview.reduce((sum, o) => sum + o.count * o.rate, 0);
  const costData = Array.from({ length: 6 }, (_, i) => ({
    month: `M${i + 1}`,
    cost: Math.round(totalCost * Math.pow(0.9, i)),
  }));

  const pieData = overview
    .filter(o => o.count > 0)
    .map(o => ({ id: o.id, value: o.count, label: `${o.role} - ${o.level}` }));

  const roleCounts = {} as Record<string, number>;
  const roleRates: Record<string, { sum: number; cnt: number }> = {};
  overview.forEach(o => {
    roleCounts[o.role] = (roleCounts[o.role] || 0) + o.count;
    roleRates[o.role] = {
      sum: (roleRates[o.role]?.sum || 0) + o.rate,
      cnt: (roleRates[o.role]?.cnt || 0) + 1,
    };
  });

  const positionMap: Record<string, { role: string; level: string; rate: number; count: number }> = {};
  overview.forEach(o => {
    const slug = `${o.role} ${o.level}`.toLowerCase().replace(/\s+/g, '_');
    positionMap[slug] = { role: o.role, level: o.level, rate: o.rate, count: o.count };
  });

  const rolesSummary: Record<string, RoleSummary> = {} as Record<
    string,
    RoleSummary
  >;
  Object.values(positionMap).forEach(p => {
    if (!rolesSummary[p.role]) {
      rolesSummary[p.role] = {
        role: p.role,
        headcount: 0,
        manday: 0,
        available: 0,
        rateSum: 0,
        levels: {} as Record<string, LevelSummary>,
      };
    }
    rolesSummary[p.role].headcount += p.count;
    rolesSummary[p.role].rateSum += p.rate * p.count;
    rolesSummary[p.role].levels[p.level] = {
      headcount: p.count,
      manday: 0,
      available: 0,
      avgRate: p.rate,
    };
  });

  const today = new Date();
  resources.forEach(r => {
    const pos = positionMap[r.position];
    if (!pos) return;
    const days = differenceInDays(today, new Date(r.startDate || today)) + 1;
    const roleData = rolesSummary[pos.role];
    const levelData = roleData.levels[pos.level];
    roleData.manday += days;
    roleData.available += 220;
    levelData.manday += days;
    levelData.available = (levelData.available || 0) + 220;
  });

  const roleCards = Object.values(rolesSummary).map(r => ({
    role: r.role,
    headcount: r.headcount,
    manday: r.manday,
    avgRate: r.headcount ? Math.round(r.rateSum / r.headcount) : 0,
    utilization: r.available ? Math.round((r.manday / r.available) * 100) : 0,
    levels: Object.keys(r.levels).map(lvl => {
      const lv = r.levels[lvl];
      return {
        level: lvl,
        headcount: lv.headcount,
        manday: lv.manday,
        avgRate: lv.avgRate,
        utilization: lv.available ? Math.round((lv.manday / lv.available) * 100) : 0,
      };
    }),
  }));


  const barData = Object.keys(roleCounts).map(role => ({
    role,
    count: roleCounts[role],
  }));

  const roleRateAvg: Record<string, number> = {};
  Object.keys(roleRates).forEach(r => {
    roleRateAvg[r] = Math.round(roleRates[r].sum / roleRates[r].cnt);
  });

  const mandayBarData = Object.keys(rolesSummary).map(role => ({
    role,
    manday: rolesSummary[role].manday,
  }));

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Dashboard Overview
        </Typography>
        <PageBreadcrumbs items={[{ label: 'Dashboard Overview' }]} />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <MetricCard
              label="Projects"
              value={totalProjects}
              icon={<WorkOutlineIcon />}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <MetricCard
              label="Resources"
              value={totalResources}
              icon={<PeopleAltIcon />}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <MetricCard
              label="Unassigned"
              value={unassigned}
              icon={<PersonOffIcon />}
            />
          </Grid>
        </Grid>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Resources
          </Typography>
          <Grid container spacing={2}>
            <Grid size={12} container spacing={2}>
              {roleCards.map(card => (
                <Grid key={card.role} size={{ xs: 12, md: 6 }}>
                  <RoleCard data={card} />
                </Grid>
              ))}
            </Grid>

            <Grid size={12} container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Resource Distribution
                  </Typography>
                  <PieChart height={200} series={[{ data: pieData }]} />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Resources by Role
                  </Typography>
                  <BarChart
                    height={200}
                    dataset={barData}
                    xAxis={[{ dataKey: 'role', scaleType: 'band' }]}
                    series={[{ dataKey: 'count', label: 'Resources' }]}
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Monthly Cost Target (10% Reduction)
                  </Typography>
                  <LineChart
                    height={200}
                    dataset={costData}
                    xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                    series={[{ dataKey: 'cost', label: 'Cost' }]}
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Mandays by Role
                  </Typography>
                  <BarChart
                    height={200}
                    dataset={mandayBarData}
                    xAxis={[{ dataKey: 'role', scaleType: 'band' }]}
                    series={[{ dataKey: 'manday', label: 'Mandays' }]}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Manday Tracking & Cost Summary
              </Typography>
              <Box sx={{ height: 250 }}>
                <ReactECharts
                  style={{ height: '100%' }}
                  option={{
                    tooltip: { trigger: 'axis' },
                    legend: { data: ['Estimate', 'Actual', 'Diff'] },
                    xAxis: { type: 'category', data: dailyManday.map(d => d.date) },
                    yAxis: { type: 'value' },
                    series: [
                      { name: 'Estimate', type: 'line', data: dailyManday.map(d => d.estimate) },
                      { name: 'Actual', type: 'line', data: dailyManday.map(d => d.actual) },
                      { name: 'Diff', type: 'line', areaStyle: {}, data: dailyManday.map(d => d.actual - d.estimate) },
                    ],
                  }}
                />
              </Box>
              <Box sx={{ height: 250, mt: 3 }}>
                <ReactECharts
                  style={{ height: '100%' }}
                  option={{
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                    legend: {},
                    xAxis: { type: 'category', data: dailyCost.map(d => d.date) },
                    yAxis: { type: 'value' },
                    series: (function() {
                      const roles = Object.keys(dailyCost[0] || {}).filter(k => k !== 'date');
                      return roles.map(role => ({
                        name: role,
                        type: 'bar',
                        stack: 'total',
                        data: dailyCost.map(d => d[role] || 0),
                      }));
                    })(),
                  }}
                />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Resource Utilization
              </Typography>
              <ReactECharts
                style={{ height: 500 }}
                option={{
                  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                  grid: { left: 80, right: 20, bottom: 20, top: 20 },
                  xAxis: { type: 'value' },
                  yAxis: {
                    type: 'category',
                    data: utilData.map(u => u.name),
                    inverse: true,
                  },
                  series: [
                    {
                      type: 'bar',
                      data: utilData.map(u => u.manday),
                      label: {
                        show: true,
                        position: 'right',
                        formatter: (params: any) =>
                          `${utilData[params.dataIndex]?.workload ?? 0}%`,
                      },
                    },
                  ],
                }}
              />
            </Paper>
          </Grid>
        </Grid>

      </Container>
    </Layout>
  );
}

export default withAuth(DashboardOverview);
