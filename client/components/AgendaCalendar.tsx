import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

function stringToColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h},70%,60%)`;
}

export default function AgendaCalendar({
  tasks = [],
  events = [],
  holidays = [],
  onEventDrop,
  onTaskClick,
}: any) {
  const taskEvents = useMemo(
    () =>
      tasks.map((t: any) => ({
        title: t.name,
        start: new Date(t.startDate),
        end: new Date(t.endDate || t.startDate),
        allDay: true,
        resource: { type: 'task', ...t },
      })),
    [tasks],
  );

  const calendarEvents = useMemo(
    () =>
      events.map((e: any) => ({
        title: e.title,
        start: new Date(e.date),
        end: new Date(e.date),
        allDay: true,
        resource: { type: 'event', ...e },
      })),
    [events],
  );

  const holidayEvents = useMemo(
    () =>
      holidays
        .filter((h: any) => h.name !== 'Weekend')
        .map((h: any) => ({
          title: h.name,
          start: new Date(h.date),
          end: new Date(h.date),
          allDay: true,
          resource: { type: 'holiday', ...h },
        })),
    [holidays],
  );

  const eventsAll = useMemo(
    () => [...taskEvents, ...calendarEvents, ...holidayEvents],
    [taskEvents, calendarEvents, holidayEvents],
  );

  const Event = ({ event }: any) => {
    const res = event.resource || {};
    if (res.type && res.type !== 'task') {
      return <Box sx={{ fontSize: 12 }}>{event.title}</Box>;
    }
    const owner = res.owner || '';
    const initials = owner
      .split(' ')
      .map((s: string) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ width: 18, height: 18, bgcolor: stringToColor(owner), mr: 0.5 }}>
          <Box component="span" sx={{ fontSize: 10 }}>
            {initials}
          </Box>
        </Avatar>
        <Box component="span" sx={{ fontSize: 12, mr: 0.5 }}>
          {event.title}
        </Box>
        {typeof res.progress === 'number' && (
          <Box component="span" sx={{ fontSize: 12, mr: 0.5 }}>
            {res.progress}%
          </Box>
        )}
        <Box
          component="span"
          sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stringToColor(res.status || 'none') }}
        />
      </Box>
    );
  };

  const statusColor = (status: string) =>
    (
      {
        planing: '#9e9e9e',
        'in progress': '#2196f3',
        break: '#ff9800',
        production: '#1976d2',
        'waiting payment': '#9c27b0',
        paid: '#4caf50',
        cancelled: '#f44336',
      } as any
    )[status] || '#9e9e9e';

  const eventPropGetter = (event: any) => {
    const res = event.resource || {};
    let backgroundColor = '#9e9e9e';
    if (res.type === 'holiday') backgroundColor = '#d32f2f';
    else if (res.type === 'event') backgroundColor = '#6a1b9a';
    else backgroundColor = statusColor(res.status || '');
    return { style: { backgroundColor, borderRadius: 4, border: 'none', color: '#fff' } };
  };

  const dayPropGetter = (date: Date) => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend) {
      return { style: { backgroundColor: '#f0f0f0' } };
    }
    return {};
  };

  const CalendarComponent: any = onEventDrop ? DnDCalendar : Calendar;

  return (
    <DndProvider backend={HTML5Backend}>
      <CalendarComponent
        localizer={localizer}
        events={eventsAll}
        defaultView="month"
        views={["month", "week", "day"]}
        popup
        style={{ height: 760 }}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        components={{ event: Event }}
        onSelectEvent={event =>
          onTaskClick && event.resource?.type === 'task' && onTaskClick(event.resource)
        }
        {...(onEventDrop
          ? {
              onEventDrop: ({ event, start, end }: any) =>
                onEventDrop && onEventDrop(event.resource, start, end),
              onEventResize: ({ event, start, end }: any) =>
                onEventDrop && onEventDrop(event.resource, start, end),
              resizable: true,
            }
          : {})}
      />
    </DndProvider>
  );
}
