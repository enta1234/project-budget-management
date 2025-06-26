// @ts-nocheck
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { fetchEvents } from '../../models/eventsModel';
import { fetchProjects } from '../../models/projectsModel';
import { fetchTasks } from '../../models/tasksModel';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Layout, SimpleCalendar, PageBreadcrumbs } from '../../components';
import { withAuth } from '../../context/AuthContext';

function PlanManagementOverview() {
  const [view, setView] = useState('calendar');
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    Promise.all([fetchEvents(), fetchProjects()])
      .then(async ([ev, pro]) => {
        setEvents(ev);
        const list = pro.filter(p => !p.deleted);
        setProjects(list);
        const taskLists = await Promise.all(
          list.map(p => fetchTasks(p._id || p.id))
        );
        setTasks(taskLists.flat());
      })
      .catch(console.error);
  }, []);

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Paper sx={{ p: 2 }} elevation={3}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h5">Plan Management Overview</Typography>
            <PageBreadcrumbs items={[{ label: 'Plan Management' }]} />
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
            <SimpleCalendar events={events} tasks={tasks} />
          ) : (
            <Timeline>
              {projects.map((p, idx) => (
                <TimelineItem key={p._id || idx}>
                  <TimelineSeparator>
                    <TimelineDot />
                    {idx < projects.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    {p.name} ({new Date(p.start).toLocaleDateString()} - {new Date(p.end).toLocaleDateString()})
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

export default withAuth(PlanManagementOverview);
