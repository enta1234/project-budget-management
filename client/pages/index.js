import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Input, LoadingButton } from '../components';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import styles from '../styles/index.module.scss';

export default function Home() {
  const { token, login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const { data } = await axios.post('/api/v1/auth/login', {
      username,
      password,
    });
    login(data.accessToken);
    router.push('/workspace');
    setLoading(false);
  }

  async function getProfile() {
    const { data } = await axios.get('/api/v1/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(data);
  }

  return (
    <Container maxWidth="sm">
      <Box className={styles.wrapper}>
        <Paper className={styles.paper} elevation={3}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <LoadingButton loading={loading} variant="contained" type="submit" fullWidth>
              Login
            </LoadingButton>
          </Box>
          {token && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button variant="outlined" onClick={getProfile}>Get Profile</Button>
            </Box>
          )}
          {profile && <pre className={styles.profilePre}>{JSON.stringify(profile, null, 2)}</pre>}
        </Paper>
      </Box>
    </Container>
  );
}
