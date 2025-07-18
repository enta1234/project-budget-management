import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import { updateTask } from '../models/planningModel';

import { sampleTasks, sampleIterations, Task } from './sampleData';

interface Props {
  tasks?: Task[];
}

const statusColors: Record<string, string> = {
  todo: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  done: 'bg-green-500',
};

const ROW_HEIGHT = 28;
const DAY_WIDTH = 48;

export default function RoadmapGantt({ tasks = sampleTasks }: Props) {
  const [items, setItems] = useState<Task[]>(tasks);
  const [startField, setStartField] = useState<'startDate' | 'iterationStart'>('startDate');
  const [endField, setEndField] = useState<'endDate' | 'iterationEnd'>('endDate');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editing, setEditing] = useState<Task | null>(null);
  const [editName, setEditName] = useState('');
  const [dragging, setDragging] = useState<{
    id: string;
    startX: number;
    origStart: Date;
    origEnd: Date;
  } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const MIN_DAYS = 30;
  const visibleDays = Math.max(
    MIN_DAYS,
    Math.round(containerWidth / DAY_WIDTH) || MIN_DAYS,
  );
  const EXTEND_DAYS = Math.max(14, Math.round(visibleDays / 2));
  const WINDOW_DAYS = visibleDays + EXTEND_DAYS * 2;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth - 240);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fieldStartDate = (t: Task): Date => {
    if (startField === 'startDate') return new Date(t.startDate);
    const it = sampleIterations.find(i => i.name === t.iteration);
    return it ? new Date(it.start) : new Date(t.startDate);
  };

  const fieldEndDate = (t: Task): Date => {
    if (endField === 'endDate') return new Date(t.endDate);
    const it = sampleIterations.find(i => i.name === t.iteration);
    return it ? new Date(it.end) : new Date(t.endDate);
  };

  const filtered = items
    .filter(t => (statusFilter ? t.status === statusFilter : true))
    .filter(t => {
      const text = [t.id, t.name, t.status, t.type, t.iteration]
        .join(' ')
        .toLowerCase();
      return text.includes(search.toLowerCase());
    });

  const dates = filtered.flatMap(t => [fieldStartDate(t), fieldEndDate(t)]);
  const timestamps = dates.map(d => d.getTime());
  const minDate = timestamps.length ? new Date(Math.min(...timestamps)) : new Date();
  const maxDate = timestamps.length ? new Date(Math.max(...timestamps)) : new Date();

  const addDays = (d: Date, n: number) => {
    const res = new Date(d);
    res.setDate(res.getDate() + n);
    return res;
  };

  const initialStart = addDays(minDate, -14);
  const initialEnd = addDays(initialStart, WINDOW_DAYS - 1);
  function daysDiff(d1: Date, d2: Date) {
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
    return Math.floor((utc1 - utc2) / 86400000);
  }

  const span = daysDiff(initialEnd, initialStart) + 1;
  const [rangeStart, setRangeStart] = useState<Date>(initialStart);
  const [rangeEnd, setRangeEnd] = useState<Date>(
    span > WINDOW_DAYS ? addDays(initialStart, WINDOW_DAYS - 1) : initialEnd,
  );

  useEffect(() => {
    const newStart = addDays(minDate, -14);
    setRangeStart(newStart);
    setRangeEnd(addDays(newStart, WINDOW_DAYS - 1));
  }, [minDate.getTime(), maxDate.getTime(), WINDOW_DAYS]);

  const centerOnDate = useCallback(
    (d: Date) => {
      const el = scrollRef.current;
      if (!el) return;
      let start = rangeStartRef.current;
      let end = rangeEndRef.current;
      if (d < start || d > end) {
        start = addDays(d, -Math.floor(visibleDays / 2));
        end = addDays(start, WINDOW_DAYS - 1);
        setRangeStart(start);
        setRangeEnd(end);
        rangeStartRef.current = start;
        rangeEndRef.current = end;
      }
      requestAnimationFrame(() => {
        const offset = daysDiff(d, start) * DAY_WIDTH - el.clientWidth / 2 + DAY_WIDTH / 2;
        el.scrollLeft = Math.max(0, offset);
      });
    },
    [visibleDays],
  );

  useEffect(() => {
    if (!containerWidth) return;
    centerOnDate(new Date());
  }, [containerWidth, centerOnDate]);

  useEffect(() => {
    setRangeEnd(addDays(rangeStart, WINDOW_DAYS - 1));
  }, [WINDOW_DAYS, rangeStart]);



  const pxPerDay = DAY_WIDTH;
  const totalDays = daysDiff(rangeEnd, rangeStart) + 1;
  const width = Math.max(totalDays * pxPerDay, containerWidth);

  const dayCells: { label: string; month: string; left: number; first: boolean }[] = [];
  const cursor = new Date(rangeStart);
  while (cursor <= rangeEnd) {
    dayCells.push({
      label: String(cursor.getDate()),
      month: cursor.toLocaleString('default', { month: 'short' }),
      left: daysDiff(cursor, rangeStart) * pxPerDay,
      first: cursor.getDate() === 1,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  const monthCells: { label: string; left: number; width: number; days: number }[] = [];
  {
    let curMonth = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
    while (curMonth <= rangeEnd) {
      const nextMonth = new Date(curMonth.getFullYear(), curMonth.getMonth() + 1, 1);
      const left = daysDiff(curMonth, rangeStart) * pxPerDay;
      const days = daysDiff(nextMonth, curMonth);
      const width = days * pxPerDay;
      monthCells.push({
        label: curMonth.toLocaleString('default', { month: 'short', year: 'numeric' }),
        left,
        width,
        days,
      });
      curMonth = nextMonth;
    }
  }

  const grids = dayCells.map(c => ({ left: c.left, first: c.first }));

  const scrollRef = useRef<HTMLDivElement>(null);
  const [renderStart, setRenderStart] = useState(0);
  const [renderEnd, setRenderEnd] = useState(totalDays);
  const visibleGrids = grids.slice(renderStart, renderEnd);

  const BUFFER_DAYS = 7;

  const rangeStartRef = useRef(rangeStart);
  const rangeEndRef = useRef(rangeEnd);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setRenderEnd(daysDiff(rangeEnd, rangeStart) + 1);
  }, [rangeStart, rangeEnd]);

  useEffect(() => {
    rangeStartRef.current = rangeStart;
  }, [rangeStart]);

  useEffect(() => {
    rangeEndRef.current = rangeEnd;
  }, [rangeEnd]);

  const processScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const currentTotal = WINDOW_DAYS;
    const startIdx = Math.floor(el.scrollLeft / DAY_WIDTH);
    const endIdx = Math.ceil((el.scrollLeft + el.clientWidth) / DAY_WIDTH);
    const buf = EXTEND_DAYS;
    setRenderStart(Math.max(0, startIdx - buf));
    setRenderEnd(Math.min(currentTotal, endIdx + buf));

    if (startIdx < BUFFER_DAYS) {
      const newStart = addDays(rangeStartRef.current, -EXTEND_DAYS);
      const newEnd = addDays(newStart, WINDOW_DAYS - 1);
      if (newStart.getTime() !== rangeStartRef.current.getTime()) {
        setRangeStart(newStart);
        setRangeEnd(newEnd);
        rangeStartRef.current = newStart;
        rangeEndRef.current = newEnd;
        requestAnimationFrame(() => {
          if (scrollRef.current)
            scrollRef.current.scrollLeft += EXTEND_DAYS * DAY_WIDTH;
        });
      }
    }

    if (endIdx > currentTotal - BUFFER_DAYS) {
      const newStart = addDays(rangeStartRef.current, EXTEND_DAYS);
      const newEnd = addDays(newStart, WINDOW_DAYS - 1);
      if (newEnd.getTime() !== rangeEndRef.current.getTime()) {
        setRangeStart(newStart);
        setRangeEnd(newEnd);
        rangeStartRef.current = newStart;
        rangeEndRef.current = newEnd;
      }
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(processScroll, 200);
  }, [processScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    processScroll();
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, processScroll]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: newName,
        status: 'todo',
        startDate: today,
        endDate: today,
        assignees: [],
        manday: 1,
        type: 'feature',
        iteration: sampleIterations[0].name,
      },
    ]);
    setShowAdd(false);
    setNewName('');
    setNewDesc('');
  };

  const format = (d: Date) => d.toISOString().slice(0, 10);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      const delta = Math.round((e.clientX - dragging.startX) / DAY_WIDTH);
      const newStart = addDays(dragging.origStart, delta);
      const newEnd = addDays(dragging.origEnd, delta);
      setItems(itms =>
        itms.map(t =>
          t.id === dragging.id
            ? { ...t, startDate: format(newStart), endDate: format(newEnd) }
            : t,
        ),
      );

      if (delta < -BUFFER_DAYS) {
        const nextStart = addDays(rangeStartRef.current, -EXTEND_DAYS);
        const nextEnd = addDays(nextStart, WINDOW_DAYS - 1);
        if (nextStart.getTime() !== rangeStartRef.current.getTime()) {
          setRangeStart(nextStart);
          setRangeEnd(nextEnd);
          rangeStartRef.current = nextStart;
          rangeEndRef.current = nextEnd;
        }
      } else if (daysDiff(newEnd, rangeEndRef.current) > -BUFFER_DAYS) {
        const nextStart = addDays(rangeStartRef.current, EXTEND_DAYS);
        const nextEnd = addDays(nextStart, WINDOW_DAYS - 1);
        if (nextEnd.getTime() !== rangeEndRef.current.getTime()) {
          setRangeStart(nextStart);
          setRangeEnd(nextEnd);
          rangeStartRef.current = nextStart;
          rangeEndRef.current = nextEnd;
        }
      }
    },
    [dragging],
  );

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    const delta = Math.round((window.event as PointerEvent).clientX - dragging.startX) / DAY_WIDTH;
    const move = Math.round(delta);
    const newStart = addDays(dragging.origStart, move);
    const newEnd = addDays(dragging.origEnd, move);
    updateTask(dragging.id, {
      startDate: format(newStart),
      endDate: format(newEnd),
    });
    setDragging(null);
    document.removeEventListener('pointermove', handlePointerMove as any);
    document.removeEventListener('pointerup', handlePointerUp as any);
  }, [dragging, handlePointerMove]);

  const startDrag = (t: Task, e: React.PointerEvent) => {
    e.preventDefault();
    setActiveId(t.id);
    setDragging({
      id: t.id,
      startX: e.clientX,
      origStart: fieldStartDate(t),
      origEnd: fieldEndDate(t),
    });
    document.addEventListener('pointermove', handlePointerMove as any);
    document.addEventListener('pointerup', handlePointerUp as any);
  };

  return (
    <div className="space-y-2">
      {/* toolbar */}
      <div className="flex items-center gap-2 text-sm">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter by keyword or by field"
          className="flex-1 rounded border px-2 py-1"
        />
        <button className="px-2 py-1 rounded border">Markers</button>
        <button className="px-2 py-1 rounded border">Sort</button>
        <select
          value={startField}
          onChange={e => setStartField(e.target.value as any)}
          className="rounded border px-1"
        >
          <option value="startDate">Start</option>
          <option value="iterationStart">Iteration start</option>
        </select>
        <select
          value={endField}
          onChange={e => setEndField(e.target.value as any)}
          className="rounded border px-1"
        >
          <option value="endDate">End</option>
          <option value="iterationEnd">Iteration end</option>
        </select>
        <button className="px-2 py-1 rounded border">Month</button>
        <button
          className="px-2 py-1 rounded border"
          onClick={() => centerOnDate(new Date())}
        >
          Today
        </button>
        <button
          className="ml-auto rounded bg-blue-600 px-3 py-1 text-white"
          onClick={() => setShowAdd(true)}
        >
          + New
        </button>
      </div>

      <div
        className="border rounded overflow-x-auto"
        ref={el => {
          scrollRef.current = el;
          containerRef.current = el;
        }}
      >
        <div className="relative" style={{ width: width + 240 }}>
          {/* header */}
          <div className="flex sticky top-0 z-20">
            <div className="sticky left-0 z-30 flex h-8 w-60 items-center border-r border-b bg-white px-2 text-xs font-semibold">
              Task
            </div>
            <div className="flex-1" style={{ width }}>
              <div className="bg-white" style={{ width }}>
                <div
                  className="border-b grid"
                  style={{ gridTemplateColumns: `repeat(${totalDays}, ${DAY_WIDTH}px)` }}
                >
                  {monthCells.map(m => (
                    <div
                      key={m.label}
                      className="text-center text-xs font-semibold"
                      style={{ gridColumn: `span ${m.days}` }}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>
                <div
                  className="border-b grid text-[10px]"
                  style={{ gridTemplateColumns: `repeat(${totalDays}, ${DAY_WIDTH}px)` }}
                >
                  {dayCells.map((d, idx) => (
                    <div key={idx} className="text-center">
                      {d.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* grid lines */}
          {visibleGrids.map((d, idx) => (
            <div
              key={idx}
              className={`absolute top-0 bottom-0 border-l ${d.first ? 'border-gray-400 border-l-2' : 'border-gray-200'}`}
              style={{ left: 240 + d.left }}
            />
          ))}
          {(() => {
            const today = new Date();
            if (today >= rangeStart && today <= rangeEnd) {
              const left = daysDiff(today, rangeStart) * pxPerDay;
              return (
                <div
                  className="absolute top-0 bottom-0 border-l border-red-500"
                  style={{ left: 240 + left }}
                />
              );
            }
            return null;
          })()}

          {/* rows */}
          {filtered.map((t, idx) => {
            const start = fieldStartDate(t);
            const end = fieldEndDate(t);
            const left = daysDiff(start, rangeStart) * pxPerDay;
            const widthBar = Math.max((daysDiff(end, start) + 1) * pxPerDay, 8);
            const color = statusColors[t.status] || 'bg-gray-400';
            return (
              <div key={t.id} className="flex" style={{ height: ROW_HEIGHT }}>
                <div
                  className={`sticky left-0 z-10 flex w-60 items-center gap-2 border-r px-2 text-sm ${
                    idx % 2 ? 'bg-gray-50' : 'bg-white'
                  } ${activeId === t.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                  onClick={() => setActiveId(t.id)}
                >
                  <div className="w-4 text-right text-xs text-gray-500">{idx + 1}</div>
                  <div className="w-4">
                    {t.status === 'done' ? (
                      <svg className="h-3 w-3 text-green-600" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 10.3L3.7 8l-1.4 1.4L6 13 14 5l-1.4-1.4z" />
                      </svg>
                    ) : (
                      <svg className="h-3 w-3 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="8" cy="8" r="3" />
                      </svg>
                    )}
                  </div>
                  <div className="truncate">
                    {t.name} <span className="text-gray-400">#{t.id}</span>
                  </div>
                </div>
                <div className="relative" style={{ width }}>
                  <div
                    tabIndex={0}
                    className={`absolute flex h-5 items-center gap-1 rounded-full px-2 text-xs text-white ${color} transition-all cursor-pointer hover:shadow-md ${activeId === t.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''} ${dragging?.id === t.id ? 'shadow-lg opacity-70' : ''}`}
                    style={{ left, width: widthBar }}
                    onPointerDown={e => startDrag(t, e)}
                    onClick={() => setActiveId(t.id)}
                    onFocus={() => setActiveId(t.id)}
                    onDoubleClick={() => {
                      setEditing(t);
                      setEditName(t.name);
                    }}
                  >
                    {dragging?.id === t.id && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-1 text-[10px] text-white">
                        {t.startDate} - {t.endDate}
                      </div>
                    )}
                    {t.status === 'done' ? (
                      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 10.3L3.7 8l-1.4 1.4L6 13 14 5l-1.4-1.4z" />
                      </svg>
                    ) : (
                      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="8" cy="8" r="3" />
                      </svg>
                    )}
                    <span className="truncate">{t.name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-4 rounded space-y-2 w-64 transform transition-all">
            <div className="font-semibold">Add Task</div>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Task name"
              className="border w-full px-2 py-1 rounded text-sm"
            />
            <textarea
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Description"
              className="border w-full px-2 py-1 rounded text-sm"
            />
            <div className="text-right space-x-2">
              <button className="px-2 py-1 text-sm" onClick={() => setShowAdd(false)}>Cancel</button>
              <button
                className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-4 rounded space-y-2 w-64 transform transition-all">
            <div className="font-semibold">Task Details</div>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="border w-full px-2 py-1 rounded text-sm"
            />
            <div className="text-right space-x-2">
              <button className="px-2 py-1 text-sm" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button
                className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
                onClick={() => {
                  setItems(items.map(it => (it.id === editing.id ? { ...it, name: editName } : it)));
                  setEditing(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

