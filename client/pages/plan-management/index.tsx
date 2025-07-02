// @ts-nocheck
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { fetchEvents } from '../../models/eventsModel';
import { fetchProjects } from '../../models/projectsModel';
import { fetchTasks } from '../../models/tasksModel';
import { fetchWorkdays } from '../../models/workdayModel';
import { Layout, AgendaCalendar, PageBreadcrumbs, ProjectTimeline } from '../../components';
import { differenceInCalendarDays } from 'date-fns';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { withAuth } from '../../context/AuthContext';
import LinearProgress from '@mui/material/LinearProgress';

function PlanManagementOverview() {
  const [view, setView] = useState('calendar');
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const router = useRouter();

  const calcProgress = (p: any) => {
    try {
      const start = p.start ? new Date(p.start) : null;
      const end = p.end ? new Date(p.end) : null;
      if (!start || !end) return 0;
      if (end.getTime() <= start.getTime()) return 0;
      const now = new Date();
      if (now.getTime() <= start.getTime()) return 0;
      if (now.getTime() >= end.getTime()) return 100;
      const total = differenceInCalendarDays(end, start);
      const done = differenceInCalendarDays(now, start);
      return Math.round((done / total) * 100);
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    const year = new Date().getFullYear();
    Promise.all([fetchEvents(), fetchProjects(), fetchWorkdays(year)])
      .then(async ([ev, pro, hol]) => {
        setEvents(ev);
        const list = pro.filter(p => !p.deleted);
        const withTasks = await Promise.all(
          list.map(async p => {
            try {
              const tasks = await fetchTasks(p._id || p.id);
              const projectEnd = p.end ? new Date(p.end) : null;
              const maxEnd = tasks.reduce((acc, t) => {
                const end = t.endDate || t.startDate;
                return end && new Date(end) > acc ? new Date(end) : acc;
              }, projectEnd || new Date(0));
              const finalEnd = projectEnd && maxEnd > projectEnd ? maxEnd : projectEnd || maxEnd;
              return { ...p, end: finalEnd, tasks };
            } catch {
              return { ...p, tasks: [] };
            }
          })
        );
        setProjects(withTasks);
        setHolidays(hol);
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
            <AgendaCalendar
              tasks={projects.map(p => ({
                ...p,
                name: p.name,
                startDate: p.start,
                endDate: p.end,
                owner: p.lead?.name || '',
                status: p.status,
                progress: calcProgress(p),
              }))}
              events={events}
              holidays={holidays}
              onTaskClick={proj =>
                router.push(
                  `/plan-management/planning-setting?project=${
                    proj._id || proj.id
                  }`,
                )}
            />
          ) : (
            <>
              <ProjectTimeline projects={projects} />
              <Timeline>
                {projects.map((p, idx) => (
                <TimelineItem key={p._id || idx}>
                  <TimelineSeparator>
                    <TimelineDot />
                    {idx < projects.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent
                    onClick={() => router.push(`/project/${p._id || p.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Box>
                      <Typography variant="body1">
                        {p.name} ({new Date(p.start).toLocaleDateString()} - {new Date(p.end).toLocaleDateString()})
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <LinearProgress
                          variant="determinate"
                          value={calcProgress(p)}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 5, mr: 1 }}
                        />
                        <Typography variant="caption">{calcProgress(p)}%</Typography>
                      </Box>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
                ))}
              </Timeline>
            </>
          )}
        </Paper>
      </Container>
    </Layout>
  );
}

export default withAuth(PlanManagementOverview);
