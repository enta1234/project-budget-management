import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Task {
  name: string;
  startDate?: string | Date;
  endDate?: string | Date;
  type?: string;
}

interface Project {
  _id?: string;
  id?: string;
  name: string;
  start?: string | Date;
  end?: string | Date;
  tasks?: Task[];
}

function stringToColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h},70%,60%)`;
}

export default function ProjectTimeline({ projects, year = new Date().getFullYear() }: { projects: Project[]; year?: number }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const startYear = new Date(year, 0, 1).getTime();
  const endYear = new Date(year, 11, 31).getTime();
  const range = endYear - startYear;

  const todayRatio = (Date.now() - startYear) / range;
  const showToday = todayRatio >= 0 && todayRatio <= 1;
  const todayLeft = Math.min(Math.max(todayRatio * 100, 0), 100);

  const renderTask = (t: Task, color: string, key: number) => {
    const s = new Date(t.startDate || t.endDate || Date.now()).getTime();
    const e = new Date(t.endDate || t.startDate || t.endDate || Date.now()).getTime();
    if (isNaN(s)) return null;
    const start = Math.max(s, startYear);
    const end = Math.max(start, Math.min(e || s, endYear));
    const left = ((start - startYear) / range) * 100;
    const width = ((end - start) / range) * 100 || 0.5;
    const isMilestone = t.type === 'milestone' || width < 1;
    return (
      <Box key={key} sx={{ position: 'absolute', left: `${left}%`, width: isMilestone ? 8 : `${width}%`, minWidth: isMilestone ? 8 : 'auto', height: 14, bgcolor: color, borderRadius: 2 }}>
        {isMilestone && (
          <Box sx={{ position: 'absolute', top: -3, left: '50%', width: 8, height: 8, bgcolor: color, borderRadius: '50%', transform: 'translateX(-50%)' }} />
        )}
        {!isMilestone && (
          <Typography sx={{ fontSize: 10, color: '#fff', pl: 0.5, whiteSpace: 'nowrap', overflow: 'hidden' }}>{t.name}</Typography>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ position: 'relative' }}>
        {showToday && (
          <Box
            sx={{
              position: 'absolute',
              left: `${todayLeft}%`,
              top: 0,
              bottom: 0,
              width: 2,
              bgcolor: 'red',
              pointerEvents: 'none',
            }}
          />
        )}
        <Box sx={{ display: 'flex', ml: 16 }}>
          {months.map(m => (
            <Box key={m} sx={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>
              {m}
            </Box>
          ))}
        </Box>
        {projects.map((p, idx) => {
          const color = stringToColor(p.name + idx);
          return (
            <Box key={p._id || p.id || idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ width: 160, pr: 1 }}>
                <Typography variant="body2" noWrap>
                  {p.name}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, position: 'relative', height: 20, borderBottom: '1px solid #ddd' }}>
                {p.tasks?.map((t, i) => renderTask(t, color, i))}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Use this view to monitor project schedules and milestones throughout the year.
      </Typography>
    </Box>
  );
}
