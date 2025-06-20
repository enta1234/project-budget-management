// @ts-nocheck
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Layout } from '../../components';
import { withAuth } from '../../context/AuthContext';

function PlanManagementSetting() {
  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4, width: '90%' }}>
        <Typography variant="h5" gutterBottom>
          Planing Setting
        </Typography>
        <Typography variant="body2">Content coming soon.</Typography>
      </Container>
    </Layout>
  );
}

export default withAuth(PlanManagementSetting);
