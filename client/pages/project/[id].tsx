// @ts-nocheck
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, PieChart } from '@mui/x-charts';
import api from '../../api';
import { Layout, Popup, ProjectForm } from '../../components';
import { withAuth } from '../../context/AuthContext';
import { differenceInDays, addDays, format } from 'date-fns';

function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (id) {
      Promise.all([
        api.get(`/api/v1/projects/${id}`),
        api.get('/api/v1/resources'),
      ]).then(([p, u]) => {
        setProject(p.data);
        setUsers(u.data);
      });
    }
  }, [id]);

  const members = users.filter(u => project?.members?.includes(u.id));
  const leadResource = users.find(u => u.id === project?.lead?._id);
  const resourceCount = members.length + (leadResource ? 1 : 0);
  const days = project?.start
    ? differenceInDays(new Date(), new Date(project.start)) + 1
    : 0;
  const dailyData = Array.from({ length: days }, (_, i) => {
    const date = addDays(new Date(project.start), i);
    const manday = resourceCount;
    return {
      day: format(date, 'MM-dd'),
      manday,
      money: manday * 100,
    };
  });
  const roleMap = {} as Record<string, number>;
  [...(leadResource ? [leadResource] : []), ...members].forEach(m => {
    const key = m.position.replace('_', ' ');
    roleMap[key] = (roleMap[key] || 0) + 1;
  });
  const roleData = Object.entries(roleMap).map(([label, value]) => ({
    label,
    value,
  }));

  const memberColumns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'position', headerName: 'Position', flex: 1 },
  ];

  const handleSave = async data => {
    const payload = {
      ...data,
      resources: (data.members?.length || 0) + (data.lead ? 1 : 0),
    };
    await api.patch(`/api/v1/projects/${id}`, payload);
    const res = await api.get(`/api/v1/projects/${id}`);
    setProject(res.data);
    setOpen(false);
  };

  if (!project) {
    return (
      <Layout>
        <Container maxWidth={false} sx={{ mt: 4, width: '90%' }}>
          <Typography>Loading...</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4, width: '90%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton size="small" onClick={() => router.back()} sx={{ mr: 1 }}>
            <ArrowBackIosNew fontSize="small" />
          </IconButton>
          <Typography variant="h5" gutterBottom>
            {project.name}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="outlined" onClick={() => setOpen(true)}>
            Edit
          </Button>
        </Box>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => router.push('/project-management')}
            sx={{ cursor: 'pointer' }}
          >
            Project Management
          </Link>
          <Typography color="text.primary">{project.name}</Typography>
        </Breadcrumbs>
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
            <BarChart
              height={300}
              dataset={dailyData}
              xAxis={[{ dataKey: 'day', scaleType: 'band' }]}
              series={[
                { dataKey: 'manday', label: 'Manday' },
                { dataKey: 'money', label: 'Money' },
              ]}
            />
          </Paper>
        )}
        {roleData.length > 0 && (
          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Manday By Role & Level
            </Typography>
            <PieChart
              height={200}
              series={[{
                data: roleData.map(r => ({ id: r.label, value: r.value, label: r.label }))
              }]}
            />
          </Paper>
        )}
        {members.length > 0 && (
          <Paper sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Members
            </Typography>
            <DataGrid
              rows={[...(leadResource ? [leadResource] : []), ...members]}
              columns={memberColumns}
              autoHeight
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={row => row.id}
            />
          </Paper>
        )}
        <Popup open={open} onClose={() => setOpen(false)} title="Edit Project">
          {project && (
            <ProjectForm
              users={users}
              onSubmit={handleSave}
              initial={{
                name: project.name,
                description: project.description,
                start: project.start ? new Date(project.start) : null,
                lead: leadResource || null,
                members,
                manday: project.manday ?? ''
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
