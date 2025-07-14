import React, { useState } from 'react';
import Layout from './Layout';
import TaskTable from './TaskTable';
import RoadmapGantt from './RoadmapGantt';

const views = [
  { key: 'table', label: 'Table' },
  { key: 'board', label: 'Board' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'iterations', label: 'Iterations' },
  { key: 'capacity', label: 'Team Capacity' },
];

export default function ProjectPage() {
  const [view, setView] = useState('table');

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-semibold">Roadmap</h1>
        <div className="flex space-x-2">
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
        </div>
        <div>
          {view === 'timeline' ? <RoadmapGantt /> : <TaskTable />}
        </div>
      </div>
    </Layout>
  );
}
