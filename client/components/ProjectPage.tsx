import { useState } from 'react';
import Layout from './Layout';
import TaskTable from './TaskTable';
import BoardView from './BoardView';
import TimelineView from './TimelineView';
import IterationsView from './IterationsView';
import CapacityView from './CapacityView';
import { ViewProvider, useView } from '../context/ViewContext';
import { sampleTasks, Task } from './sampleData';

const views = [
  { key: 'table', label: 'Table' },
  { key: 'board', label: 'Board' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'iterations', label: 'Iterations' },
  { key: 'capacity', label: 'Team Capacity' },
];

function InnerPage() {
  const { view, setView } = useView();
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = tasks
    .filter(t =>
      [t.name, t.status, t.assignees.join(' '), t.iteration]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .filter(t => (statusFilter ? t.status === statusFilter : true));

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-semibold">Roadmap</h1>
        <div className="flex space-x-2 items-center">
          {views.map(v => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`px-3 py-1 rounded border text-sm ${
                view === v.key ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {v.label}
            </button>
          ))}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="ml-auto border px-2 py-1 text-sm rounded"
          >
            <option value="">All Status</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            className="ml-2 border px-2 py-1 text-sm rounded"
          />
        </div>
        <div>
          {view === 'table' && <TaskTable tasks={filtered} setTasks={setTasks} />}
          {view === 'board' && <BoardView tasks={filtered} setTasks={setTasks} />}
          {view === 'timeline' && <TimelineView tasks={filtered} />}
          {view === 'iterations' && <IterationsView tasks={filtered} />}
          {view === 'capacity' && <CapacityView tasks={filtered} />}
        </div>
      </div>
    </Layout>
  );
}

export default function ProjectPage() {
  return (
    <ViewProvider>
      <InnerPage />
    </ViewProvider>
  );
}
