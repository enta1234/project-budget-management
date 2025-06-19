import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { Layout, ResourceForm } from '../components';
import { withAuth } from '../context/AuthContext';

function TeamSetting() {
  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 2 }} elevation={3}>
          <ResourceForm />
        </Paper>
      </Container>
    </Layout>
  );
}

export default withAuth(TeamSetting);
