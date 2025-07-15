import React, { useEffect, useState } from 'react';

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
const rowOffset = ROW_HEIGHT;

const zoomOptions = {
  day: { pxPerDay: 48 },
  week: { pxPerDay: 24 },
  month: { pxPerDay: 12 },
};

export default function RoadmapGantt({ tasks = sampleTasks }: Props) {
  const [items, setItems] = useState<Task[]>(tasks);
  const [zoom, setZoom] = useState<'day' | 'week' | 'month'>('month');
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
  startRange.setDate(startRange.getDate() - 7);
  const endRange = new Date(maxDate);
  endRange.setDate(endRange.getDate() + 7);

  const daysDiff = (d1: Date, d2: Date) =>
    Math.floor((d1.getTime() - d2.getTime()) / 86400000);
  const { pxPerDay } = zoomOptions[zoom];
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
      <div className="flex space-x-2 items-center text-sm">
        <label>Zoom:</label>
        <select
          value={zoom}
          onChange={e => setZoom(e.target.value as any)}
          className="border px-1 rounded"
        >
          {Object.keys(zoomOptions).map(z => (
            <option key={z}>{z}</option>
          ))}
        </select>
        <label className="ml-4">Start:</label>
        <select
          value={startField}
          onChange={e => setStartField(e.target.value as any)}
          className="border px-1 rounded"
        >
          <option value="startDate">startDate</option>
          <option value="iterationStart">iterationStart</option>
        </select>
        <label className="ml-2">End:</label>
        <select
          value={endField}
          onChange={e => setEndField(e.target.value as any)}
          className="border px-1 rounded"
        >
          <option value="endDate">endDate</option>
          <option value="iterationEnd">iterationEnd</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="ml-4 border px-1 rounded"
        >
          <option value="">All</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
          className="ml-2 border px-1 rounded"
        />
        <div className="ml-auto space-x-2">
          <button
            className="px-2 py-1 text-sm border rounded bg-gray-100"
            onClick={() => setShowAdd(true)}
          >
            + Add item
          </button>
          <button className="px-2 py-1 text-sm border rounded bg-green-100">
            Save
          </button>
          <button className="px-2 py-1 text-sm border rounded bg-gray-100">
            Discard
          </button>
        </div>
      </div>

      <div
        className="overflow-x-auto border rounded"
        style={{ height: (filtered.length + 1) * ROW_HEIGHT + 80 }}
      >
        <div className="relative" style={{ width }}>
          {/* header */}
          {dayCells.map((d, idx) => (
            <div
              key={idx}
              className={`absolute top-0 text-[10px] text-center ${d.first ? 'font-semibold' : ''}`}
              style={{ left: d.left, width: pxPerDay }}
            >
              {d.label}
              {d.first && <div className="text-[9px]">{d.month}</div>}
            </div>
          ))}
          {/* grid lines */}
          {grids.map((g, idx) => (
            <div
              key={idx}
              className={`absolute top-4 bottom-0 border-l ${g.first ? 'border-gray-400' : 'border-gray-200'}`}
              style={{ left: g.left, borderLeftWidth: g.first ? 2 : 1 }}
            />
          ))}
          {/* today marker */}
          {(() => {
            const today = new Date();
            if (today >= startRange && today <= endRange) {
              const left = daysDiff(today, startRange) * pxPerDay;
              return (
                <div
                  className="absolute top-4 bottom-0 border-l border-red-500"
                  style={{ left }}
                />
              );
            }
            return null;
          })()}
          {/* add row */}
          <div
            className="absolute text-sm text-blue-600 cursor-pointer"
            style={{ top: 20 }}
            onClick={() => setShowAdd(true)}
          >
            + Add item
          </div>
          {/* tasks */}
          {filtered.map((t, idx) => {
            const start = fieldStartDate(t);
            const end = fieldEndDate(t);
            const left = daysDiff(start, startRange) * pxPerDay;
            const widthBar = (daysDiff(end, start) + 1) * pxPerDay;
            const colorClasses: Record<string, string> = {
              todo: 'border-gray-400 bg-gray-50',
              in_progress: 'border-blue-500 bg-blue-50',
              done: 'border-green-500 bg-green-50',
            };
            const color = colorClasses[t.status] || 'border-gray-300 bg-gray-50';
            return (
              <div
                key={t.id}
                className="absolute"
                style={{ top: 20 + rowOffset + idx * ROW_HEIGHT, left }}
              >
                <div
                  className={`h-6 text-xs flex items-center px-2 rounded border ${color} cursor-pointer group`}
                  style={{ width: widthBar }}
                  onClick={() => {
                    setEditing(t);
                    setEditName(t.name);
                  }}
                >
                  <span className="mr-1">
                    {t.status === 'done' ? (
                      <svg className="w-3 h-3 text-green-600" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 10.3L3.7 8l-1.4 1.4L6 13 14 5l-1.4-1.4z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="8" cy="8" r="3" />
                      </svg>
                    )}
                  </span>
                  <span className="truncate">
                    {t.name} #{t.id}
                  </span>
                  {/* tooltip */}
                  <div className="absolute left-0 -top-8 hidden group-hover:block bg-white border text-xs p-1 rounded shadow">
                    <div>
                      {start.toISOString().slice(0, 10)} - {end.toISOString().slice(0, 10)}
                    </div>
                    {t.iteration && <div>Iteration: {t.iteration}</div>}
                    {t.assignees.length > 0 && <div>Assignee: {t.assignees.join(', ')}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-4 rounded space-y-2 w-64">
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
          <div className="bg-white p-4 rounded space-y-2 w-64">
            <div className="font-semibold">Edit Task</div>
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

