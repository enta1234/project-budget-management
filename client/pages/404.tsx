// @ts-nocheck
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import { Layout } from '../components';

export default function NotFoundPage() {
  const router = useRouter();
  const handleHome = () => {
    router.push('/');
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" gutterBottom>
          The page you are looking for does not exist.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleHome}>
            Go to Home
          </Button>
        </Box>
      </Container>
    </Layout>
  );
}
