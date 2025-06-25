import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function PageLoading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress />
    </Box>
  );
}
