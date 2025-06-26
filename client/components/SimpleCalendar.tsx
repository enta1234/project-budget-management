// @ts-nocheck
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';
import {
  startOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
  format,
  differenceInCalendarDays
} from 'date-fns';

export default function SimpleCalendar({ events = [], tasks = [], holidays = [], onTaskClick }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const calendarStart = addDays(
    startOfWeek(monthStart, { weekStartsOn: 0 }),
    -7
  );

  const days = [];
  for (let i = 0; i < 49; i++) {
    days.push(addDays(calendarStart, i));
  }
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const statusColor = (status: string) =>
    (
      {
        planing: 'grey.400',
        'in progress': 'info.main',
        break: 'warning.main',
        production: 'primary.main',
        'waiting payment': 'secondary.main',
        paid: 'success.main',
        cancelled: 'error.main',
        done: 'success.main',
        'in-progress': 'info.main',
        'not-started': 'grey.400',
      } as any
    )[status] || 'grey.400';

  const taskStatus = (t: any) => {
    const now = new Date();
    const start = t.startDate ? new Date(t.startDate) : null;
    const end = t.endDate ? new Date(t.endDate) : start;
    if (end && end < now) return 'done';
    if (start && start > now) return 'not-started';
    if (start && end && start <= now && end >= now) return 'in-progress';
    return 'not-started';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
        <IconButton size="small" onClick={() => setCurrentDate(addMonths(currentDate, -1))}>
          <ArrowBackIosNew fontSize="small" />
        </IconButton>
        <Typography variant="h6">
          {format(monthStart, 'MMMM yyyy')}
        </Typography>
        <Box>
          <Button size="small" onClick={() => setCurrentDate(new Date())} sx={{ mr: 1 }}>
            Today
          </Button>
          <IconButton size="small" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, idx) => (
          <Typography
            key={d}
            variant="subtitle2"
            align="center"
            sx={idx === 0 || idx === 6 ? { bgcolor: 'grey.200' } : undefined}
          >
            {idx === 0 || idx === 6 ? '' : d}
          </Typography>
        ))}
      </Box>
      {weeks.map((week, widx) => {
        const weekStart = week[0];
        const weekEnd = week[6];
        const weekTasks = tasks.filter(t => {
          const start = t.startDate ? new Date(t.startDate) : null;
          const end = t.endDate ? new Date(t.endDate) : start;
          if (!start) return false;
          return start <= weekEnd && end >= weekStart;
        });
        return (
          <Box key={widx} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
            {week.map(day => {
              const inMonth = isSameMonth(day, monthStart);
              const dayEvents = events.filter(ev => isSameDay(new Date(ev.date), day));
              const dayHolidays = holidays.filter(h => isSameDay(new Date(h.date), day));
              const nonWeekendHolidays = dayHolidays.filter(h => h.name !== 'Weekend');
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              return (
                <Box
                  key={day.toString()}
                  sx={{
                    border: '1px solid #ccc',
                    height: 80,
                    bgcolor: isWeekend ? 'grey.200' : inMonth ? 'background.paper' : 'grey.100',
                    p: 0.5,
                    fontSize: 12,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Typography variant="caption" sx={{ position: 'absolute', top: 2, right: 2 }}>
                    {format(day, 'd')}
                  </Typography>
                  {dayEvents.map(ev => (
                    <Box key={ev._id || ev.id} sx={{ mt: 3, bgcolor: 'secondary.main', color: 'white', px: 0.5, borderRadius: 1, mb: 0.5 }}>
                      {ev.title}
                    </Box>
                  ))}
                  {nonWeekendHolidays.map(h => (
                    <Box
                      key={h.id || h._id}
                      sx={{ mt: 0.5, bgcolor: 'error.main', color: 'white', px: 0.5, borderRadius: 1, fontSize: 10 }}
                    >
                      {`${h.name} (${format(new Date(h.date), 'MM-dd')})`}
                    </Box>
                  ))}
                </Box>
              );
            })}
            {weekTasks.map(t => {
              const start = t.startDate ? new Date(t.startDate) : null;
              const end = t.endDate ? new Date(t.endDate) : start;
              if (!start) return null;
              const startIdx = Math.max(0, differenceInCalendarDays(start, weekStart));
              const endIdx = Math.min(6, differenceInCalendarDays(end || start, weekStart));
              return (
                <Box
                  key={`${t._id || t.id}-${widx}`}
                  onClick={() => onTaskClick && onTaskClick(t)}
                  sx={{
                    gridColumn: `${startIdx + 1} / ${endIdx + 2}`,
                    mt: 0.5,
                    bgcolor: statusColor(t.status || taskStatus(t)),
                    color: 'white',
                    px: 0.5,
                    borderRadius: 1,
                    fontSize: 10,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: onTaskClick ? 'pointer' : 'default'
                  }}
                >
                  {t.name}
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
}
