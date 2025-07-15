import { useState } from 'react';
import Layout from './Layout';
import TaskTable from './TaskTable';
import BoardView from './BoardView';
import RoadmapGantt from './RoadmapGantt';
import IterationsView from './IterationsView';
import CapacityView from './CapacityView';
import AllStatusView from './AllStatusView';
import NewTaskModal from './NewTaskModal';
import { ViewProvider, useView } from '../context/ViewContext';
import { sampleTasks, Task } from './sampleData';

const views = [
  { key: 'table', label: 'Table' },
  { key: 'board', label: 'Board' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'iterations', label: 'Iterations' },
  { key: 'capacity', label: 'Team Capacity' },
  { key: 'status', label: 'All Status' },
];

function InnerPage() {
  const { view, setView } = useView();
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showNew, setShowNew] = useState(false);

  const filtered = tasks
    .filter(t =>
      [t.name, t.status, t.assignees.join(' '), t.iteration]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .filter(t => (statusFilter ? t.status === statusFilter : true));

  const addTask = (t: Omit<Task, 'id'>) => {
    const nextId = (tasks.length + 1).toString();
    setTasks([...tasks, { ...t, id: nextId }]);
  };

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
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            className="ml-2 border px-2 py-1 text-sm rounded"
          />
          <button
            className="ml-2 px-3 py-1 text-sm bg-blue-600 text-white rounded"
            onClick={() => setShowNew(true)}
          >
            + New
          </button>
        </div>
        <div>
          {view === 'table' && <TaskTable tasks={filtered} setTasks={setTasks} />}
          {view === 'board' && <BoardView tasks={filtered} setTasks={setTasks} />}
          {view === 'timeline' && <RoadmapGantt tasks={filtered} />}
          {view === 'iterations' && <IterationsView tasks={filtered} />}
          {view === 'capacity' && <CapacityView tasks={filtered} />}
          {view === 'status' && <AllStatusView tasks={filtered} />}
        </div>
        <NewTaskModal
          open={showNew}
          onClose={() => setShowNew(false)}
          onCreate={t => {
            addTask(t);
            setShowNew(false);
          }}
        />
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
