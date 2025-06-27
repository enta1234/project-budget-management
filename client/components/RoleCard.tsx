import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';

export interface LevelInfo {
  level: string;
  headcount: number;
  manday: number;
  avgRate: number;
  utilization: number;
}

export interface RoleInfo {
  role: string;
  headcount: number;
  manday: number;
  avgRate: number;
  utilization: number;
  levels: LevelInfo[];
}

export default function RoleCard({ data }: { data: RoleInfo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} sx={{ width: '100%' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle1" gutterBottom>
            {data.role}
          </Typography>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6}>
              <Typography variant="body2">👤 {data.headcount}</Typography>
              <Typography variant="body2">📅 {data.manday}</Typography>
              <Typography variant="body2">💰 {data.avgRate}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  ⚙
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={data.utilization}
                  sx={{ flexGrow: 1, height: 8, borderRadius: 5 }}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {data.utilization}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1}>
          {data.levels.map(level => (
            <Grid key={level.level} item xs={12}>
              <Paper variant="outlined" sx={{ p: 1 }}>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography variant="body2">{level.level}</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="caption" component="div">
                      👤 {level.headcount} | 📅 {level.manday} | 💰 {level.avgRate} | ⚙ {level.utilization}%
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
