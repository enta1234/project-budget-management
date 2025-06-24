// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PieChart, LineChart, BarChart } from '@mui/x-charts';
import { Layout } from '../../components';
import { withAuth } from '../../context/AuthContext';
import { fetchBudgetOverview } from '../../models/budgetModel';
import api from '../../api';

function DashboardOverview() {
  const [overview, setOverview] = useState([]);
  const [resources, setResources] = useState([]);
  const [projects, setProjects] = useState([]);
  const [unassigned, setUnassigned] = useState(0);

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

  const totalResources = resources.length;
  const totalManday = projects.reduce((s, p) => s + (p.manday || 0), 0);

  const barData = Object.keys(roleCounts).map(role => ({
    role,
    count: roleCounts[role],
  }));

  const roleRateAvg: Record<string, number> = {};
  Object.keys(roleRates).forEach(r => {
    roleRateAvg[r] = Math.round(roleRates[r].sum / roleRates[r].cnt);
  });

  const cards = [
    { label: 'Total Resources', value: totalResources },
    { label: 'Total Manday', value: totalManday },
    ...Object.keys(roleCounts).map(role => ({
      label: `${role} Resources`,
      value: roleCounts[role],
    })),
    ...Object.keys(roleRateAvg).map(role => ({
      label: `${role} Rate`,
      value: roleRateAvg[role],
    })),
  ];

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Dashboard Overview
        </Typography>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Resources
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={12} container spacing={2}>
              {cards.map(card => (
                <Grid key={card.label} xs={6} md={2}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body1">{card.label}</Typography>
                    <Typography variant="h6">{card.value}</Typography>
                  </Paper>
                </Grid>
              ))}
              <Grid xs={6} md={2}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body1">Unassigned</Typography>
                  <Typography variant="h6">{unassigned}</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Grid xs={12} container spacing={2} sx={{ mt: 1 }}>
              <Grid xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Resource Distribution
                  </Typography>
                  <PieChart height={200} series={[{ data: pieData }]} />
                </Paper>
              </Grid>
              <Grid xs={12} md={4}>
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
              <Grid xs={12} md={4}>
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
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  );
}

export default withAuth(DashboardOverview);
