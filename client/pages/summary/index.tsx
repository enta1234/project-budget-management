// @ts-nocheck
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { fetchEvents } from '../../models/eventsModel';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { withAuth } from '../../context/AuthContext';
import { Layout, SimpleCalendar } from '../../components';

function Summary() {
  const [view, setView] = useState('calendar');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4, width: '90%' }}>
        <Paper sx={{ p: 2 }} elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Summary</Typography>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, v) => v && setView(v)}
            size="small"
          >
            <ToggleButton value="calendar">Calendar</ToggleButton>
            <ToggleButton value="timeline">Timeline</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {view === 'calendar' ? (
          <SimpleCalendar events={events} />
        ) : (
          <Timeline>
            {events.map((ev, idx) => (
              <TimelineItem key={idx}>
                <TimelineSeparator>
                  <TimelineDot />
                  {idx < events.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  {ev.title} - {new Date(ev.date).toLocaleDateString()}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Paper>
    </Container>
    </Layout>
  );
}

export default withAuth(Summary);
