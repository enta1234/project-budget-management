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
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import api from '../../api';
import { Layout } from '../../components';
import { withAuth } from '../../context/AuthContext';

function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (id) {
      api.get(`/api/v1/projects/${id}`).then(res => setProject(res.data));
    }
  }, [id]);

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
      </Container>
    </Layout>
  );
}

export default withAuth(ProjectDetail);
