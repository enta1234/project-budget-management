// @ts-nocheck
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Layout } from '../../components';
import { withAuth } from '../../context/AuthContext';

function TeamPage() {
  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 2 }} elevation={3}>
          <Typography variant="h6">Team Management</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Team management features will go here.
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
}

export default withAuth(TeamPage);
