import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { Layout } from '../components';
import { withAuth } from '../context/AuthContext';

function ProjectInstallation() {
  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 2 }} elevation={3}>
          <Typography variant="h5">Project Installation</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Settings and new project creation will go here.
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
}

export default withAuth(ProjectInstallation);
