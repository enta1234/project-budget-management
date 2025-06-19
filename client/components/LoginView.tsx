// @ts-nocheck
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Input, LoadingButton } from '.';
import styles from '../styles/index.module.scss';

export default function LoginView({
  username,
  setUsername,
  password,
  setPassword,
  loading,
  handleLogin,
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
        </Paper>
      </Box>
    </Container>
  );
}
