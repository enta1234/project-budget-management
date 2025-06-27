import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}

export default function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
      {icon && <Box sx={{ mr: 2 }}>{icon}</Box>}
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h6">{value}</Typography>
      </Box>
    </Paper>
  );
}
