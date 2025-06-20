// @ts-nocheck
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
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
        <Typography variant="h5" gutterBottom>
          {project.name}
        </Typography>
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
