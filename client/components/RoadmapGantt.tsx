import React, { useState } from 'react';

import { sampleTasks, sampleIterations, Task } from './sampleData';

interface Props {
  tasks?: Task[];
}

const statusColors: Record<string, string> = {
  'To Do': 'bg-gray-400',
  'In Progress': 'bg-blue-500',
  'Done': 'bg-green-500',
};

const zoomOptions = {
  day: { pxPerDay: 20, gridStep: 1 },
  week: { pxPerDay: 5, gridStep: 7 },
  month: { pxPerDay: 2, gridStep: 30 },
};

export default function RoadmapGantt({ tasks = sampleTasks }: Props) {
  const [zoom, setZoom] = useState<'day' | 'week' | 'month'>('month');
  const [startField, setStartField] = useState<'startDate' | 'iterationStart'>('startDate');
  const [endField, setEndField] = useState<'endDate' | 'iterationEnd'>('endDate');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

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

  const filtered = tasks
    .filter(t => (statusFilter ? t.status === statusFilter : true))
    .filter(t => {
      const text = [t.name, t.status, t.type, t.iteration].join(' ').toLowerCase();
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

  const daysDiff = (d1: Date, d2: Date) => Math.floor((d1.getTime() - d2.getTime()) / 86400000);
  const { pxPerDay, gridStep } = zoomOptions[zoom];
  const totalDays = daysDiff(endRange, startRange) + 1;
  const width = totalDays * pxPerDay;

  const months: { label: string; left: number }[] = [];
  const m = new Date(startRange.getFullYear(), startRange.getMonth(), 1);
  while (m <= endRange) {
    const label = m.toLocaleString('default', { month: 'long', year: 'numeric' });
    const left = daysDiff(m, startRange) * pxPerDay;
    months.push({ label, left });
    m.setMonth(m.getMonth() + 1);
  }

  const grids: number[] = [];
  const g = new Date(startRange);
  while (g <= endRange) {
    grids.push(daysDiff(g, startRange) * pxPerDay);
    g.setDate(g.getDate() + gridStep);
  }

  const handleAdd = () => {
    if (!newName.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    tasks.push({
      id: Date.now().toString(),
      name: newName,
      status: 'To Do',
      startDate: today,
      endDate: today,
      assignees: [],
      manday: 1,
      type: 'feature',
      iteration: sampleIterations[0].name,
    });
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
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
          className="ml-2 border px-1 rounded"
        />
        <button
          onClick={() => setShowAdd(true)}
          className="ml-auto px-2 py-1 text-sm border rounded bg-gray-100"
        >
          + Add item
        </button>
      </div>

      <div className="overflow-x-auto border rounded" style={{ height: filtered.length * 28 + 80 }}>
        <div className="relative" style={{ width }}>
          {/* month header */}
          {months.map(m => (
            <div key={m.label} className="absolute top-0 text-xs" style={{ left: m.left }}>
              {m.label}
            </div>
          ))}
          {/* grid lines */}
          {grids.map((l, idx) => (
            <div
              key={idx}
              className="absolute top-4 bottom-0 border-l border-gray-200"
              style={{ left: l }}
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
          {/* tasks */}
          {filtered.map((t, idx) => {
            const start = fieldStartDate(t);
            const end = fieldEndDate(t);
            const left = daysDiff(start, startRange) * pxPerDay;
            const widthBar = (daysDiff(end, start) + 1) * pxPerDay;
            const color = statusColors[t.status] || 'bg-gray-500';
            return (
              <div key={t.id} className="absolute" style={{ top: 20 + idx * 28, left }}>
                <div className={`h-5 text-xs text-white px-1 rounded ${color}`} style={{ width: widthBar }}>
                  {t.name}
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
    </div>
  );
}

