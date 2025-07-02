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
import { withAuth } from '../../context/AuthContext';

function PlanManagementOverview() {
  const [view, setView] = useState('calendar');
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const router = useRouter();

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
            <ProjectTimeline projects={projects} />
          )}
        </Paper>
      </Container>
    </Layout>
  );
}

export default withAuth(PlanManagementOverview);
