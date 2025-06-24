// @ts-nocheck
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PieChart, LineChart } from '@mui/x-charts';
import { Layout } from '../../components';
import { withAuth } from '../../context/AuthContext';
import { fetchBudgetOverview } from '../../models/budgetModel';
import api from '../../api';

function DashboardOverview() {
  const [overview, setOverview] = useState([]);
  const [unassigned, setUnassigned] = useState(0);

  async function loadData() {
    const [ov, res, pro] = await Promise.all([
      fetchBudgetOverview(),
      api.get('/api/v1/resources'),
      api.get('/api/v1/projects'),
    ]);
    setOverview(ov);

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

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Dashboard Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Unassigned Resources</Typography>
              <Typography variant="h4">{unassigned}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Resource Distribution
              </Typography>
              <PieChart height={200} series={[{ data: pieData }]} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Cost Target (10% Reduction)
              </Typography>
              <LineChart
                height={300}
                dataset={costData}
                xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                series={[{ dataKey: 'cost', label: 'Cost' }]}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default withAuth(DashboardOverview);
