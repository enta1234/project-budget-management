import React, { useState } from 'react';

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
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // extend range a bit
  const startRange = new Date(minDate);
  const endRange = new Date(maxDate);

  const daysDiff = (d1: Date, d2: Date) =>
    Math.floor((d1.getTime() - d2.getTime()) / 86400000);
  const pxPerDay = DAY_WIDTH;
  const totalDays = daysDiff(endRange, startRange) + 1;
  const width = totalDays * pxPerDay;

  const dayCells: { label: string; month: string; left: number; first: boolean }[] = [];
  const cursor = new Date(startRange);
  while (cursor <= endRange) {
    dayCells.push({
      label: String(cursor.getDate()),
      month: cursor.toLocaleString('default', { month: 'short' }),
      left: daysDiff(cursor, startRange) * pxPerDay,
      first: cursor.getDate() === 1,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  const monthCells: { label: string; left: number; width: number }[] = [];
  {
    let curMonth = new Date(startRange.getFullYear(), startRange.getMonth(), 1);
    while (curMonth <= endRange) {
      const nextMonth = new Date(curMonth.getFullYear(), curMonth.getMonth() + 1, 1);
      const left = daysDiff(curMonth, startRange) * pxPerDay;
      const width = daysDiff(nextMonth, curMonth) * pxPerDay;
      monthCells.push({
        label: curMonth.toLocaleString('default', { month: 'short', year: 'numeric' }),
        left,
        width,
      });
      curMonth = nextMonth;
    }
  }

  const grids = dayCells.map(c => ({ left: c.left, first: c.first }));

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
          onClick={() => {
            const today = new Date().toISOString().slice(0, 10);
            setSearch(today);
          }}
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

      <div className="border rounded overflow-x-auto">
        <div className="relative" style={{ width: width + 240 }}>
          {/* header */}
          <div className="flex sticky top-0 z-20">
            <div className="sticky left-0 z-30 flex h-8 w-60 items-center border-r border-b bg-white px-2 text-xs font-semibold">
              Task
            </div>
            <div className="flex-1" style={{ width }}>
              <div className="relative bg-white">
                <div className="relative h-6 border-b">
                  {monthCells.map(m => (
                    <div
                      key={m.label}
                      className="absolute text-center text-xs font-semibold"
                      style={{ left: m.left, width: m.width }}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>
                <div
                  className="grid h-6 border-b text-[10px]"
                  style={{ gridTemplateColumns: `repeat(${totalDays}, ${pxPerDay}px)` }}
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
          {dayCells.map((d, idx) => (
            <div
              key={idx}
              className="absolute top-0 bottom-0 border-l border-gray-200"
              style={{ left: 240 + d.left }}
            />
          ))}
          {(() => {
            const today = new Date();
            if (today >= startRange && today <= endRange) {
              const left = daysDiff(today, startRange) * pxPerDay;
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
            const left = daysDiff(start, startRange) * pxPerDay;
            const widthBar = Math.max((daysDiff(end, start) + 1) * pxPerDay, 8);
            const color = statusColors[t.status] || 'bg-gray-400';
            return (
              <div key={t.id} className="flex" style={{ height: ROW_HEIGHT }}>
                <div
                  className={`sticky left-0 z-10 flex w-60 items-center gap-2 border-r px-2 text-sm ${
                    idx % 2 ? 'bg-gray-50' : 'bg-white'
                  }`}
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
                    className={`absolute flex h-5 items-center gap-1 rounded-full px-2 text-xs text-white ${color} transition-all cursor-pointer`}
                    style={{ left, width: widthBar }}
                    onClick={() => {
                      setEditing(t);
                      setEditName(t.name);
                    }}
                  >
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

