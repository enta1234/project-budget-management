// @ts-nocheck
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Input, LoadingButton } from '.';
import styles from '../styles/index.module.scss';

export default function LoginView({
  username,
  setUsername,
  password,
  setPassword,
  profile,
  loading,
  token,
  handleLogin,
  getProfile,
}) {
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
