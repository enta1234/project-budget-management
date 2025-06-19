// @ts-nocheck
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import {
  startOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
  format
} from 'date-fns';

export default function SimpleCalendar({ events = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });

  const days = [];
  for (let i = 0; i < 42; i++) {
    days.push(addDays(calendarStart, i));
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <IconButton size="small" onClick={() => setCurrentDate(addMonths(currentDate, -1))}>
          <ArrowBackIosNew fontSize="small" />
        </IconButton>
        <Typography variant="h6">
          {format(monthStart, 'MMMM yyyy')}
        </Typography>
        <IconButton size="small" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <Typography key={d} variant="subtitle2" align="center">
            {d}
          </Typography>
        ))}
        {days.map((day) => {
          const inMonth = isSameMonth(day, monthStart);
          const hasEvent = events.some((ev) =>
            isSameDay(new Date(ev.date), day)
          );
          return (
            <Box
              key={day.toString()}
              sx={{
                border: '1px solid #ccc',
                height: 80,
                bgcolor: inMonth ? 'background.paper' : 'grey.100',
                p: 0.5,
                fontSize: 12,
                position: 'relative'
              }}
            >
              <Typography variant="caption" sx={{ position: 'absolute', top: 2, right: 2 }}>
                {format(day, 'd')}
              </Typography>
              {hasEvent && (
                <Box sx={{ mt: 3, bgcolor: 'secondary.main', color: 'white', px: 0.5, borderRadius: 1 }}>
                  {events.find((ev) => isSameDay(new Date(ev.date), day)).title}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
