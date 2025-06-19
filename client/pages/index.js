import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function Home() {
  const { token, login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    login(data.token);
    router.push('/workspace');
  }

  async function getProfile() {
    const res = await fetch('http://localhost:3000/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProfile(await res.json());
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Paper sx={{ p: 4, width: '100%', bgcolor: 'background.paper' }} elevation={3}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>
  <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button variant="contained" type="submit" fullWidth>
              Login
            </Button>
          </Box>
          {token && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button variant="outlined" onClick={getProfile}>Get Profile</Button>
            </Box>
          )}
          {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
        </Paper>
      </Box>
    </Container>
  );
}
