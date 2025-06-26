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

export default function AgendaCalendar({ tasks = [], onEventDrop }: any) {
  const events = useMemo(
    () =>
      tasks.map((t: any) => ({
        title: t.name,
        start: new Date(t.startDate),
        end: new Date(t.endDate || t.startDate),
        allDay: true,
        resource: t,
      })),
    [tasks],
  );

  const Event = ({ event }: any) => {
    const t = event.resource;
    const owner = t.owner || '';
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
        <Box
          component="span"
          sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stringToColor(t.status || 'none') }}
        />
      </Box>
    );
  };

  const eventPropGetter = (event: any) => {
    const color = stringToColor(event.resource.status || 'none');
    return { style: { backgroundColor: color, borderRadius: 4, border: 'none' } };
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DnDCalendar
        localizer={localizer}
        events={events}
        defaultView="month"
        views={["month", "week", "day"]}
        style={{ height: 600 }}
        eventPropGetter={eventPropGetter}
        components={{ event: Event }}
        onEventDrop={({ event, start, end }) => onEventDrop && onEventDrop(event.resource, start, end)}
        resizable
        onEventResize={({ event, start, end }) => onEventDrop && onEventDrop(event.resource, start, end)}
      />
    </DndProvider>
  );
}
