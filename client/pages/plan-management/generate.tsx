import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Layout, PageBreadcrumbs } from '../../components';
import MilestoneTimeline from '../../components/MilestoneTimeline';
import { withAuth } from '../../context/AuthContext';

function GenerateTimeline() {
  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <PageBreadcrumbs
          items={[{ label: 'Plan Management', href: '/plan-management' }, { label: 'Generate Timeline' }]}
        />
        <Paper sx={{ p: 2 }} elevation={3}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Generate Timeline
          </Typography>
          <MilestoneTimeline />
        </Paper>
      </Container>
    </Layout>
  );
}

export default withAuth(GenerateTimeline);
