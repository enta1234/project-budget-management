import { useState } from 'react';
import { Task } from './sampleData';

interface Props {
  tasks: Task[];
  setTasks: (t: Task[]) => void;
}

export default function TableView({ tasks, setTasks }: Props) {
  const [sortKey, setSortKey] = useState<keyof Task>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = [...tasks].sort((a, b) => {
    const aVal = a[sortKey] as any;
    const bVal = b[sortKey] as any;
    if (aVal === bVal) return 0;
    return (aVal > bVal ? 1 : -1) * (sortDir === 'asc' ? 1 : -1);
  });

  const handleSort = (key: keyof Task) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const addTask = () => {
    const nextId = (tasks.length + 1).toString();
    setTasks([
      ...tasks,
      {
        id: nextId,
        name: 'New Task',
        status: 'To Do',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        assignees: [],
        manday: 1,
        type: 'feature',
        iteration: 'Sprint 1',
      },
    ]);
  };

  return (
    <div className="overflow-x-auto bg-white rounded border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {['name','status','startDate','endDate','assignees','manday','blockedBy','type'].map(k => (
              <th
                key={k}
                className="px-2 py-1 cursor-pointer text-left"
                onClick={() => handleSort(k as keyof Task)}
              >
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(t => (
            <tr key={t.id} className="border-t">
              <td className="px-2 py-1">{t.name}</td>
              <td className="px-2 py-1">{t.status}</td>
              <td className="px-2 py-1">{t.startDate}</td>
              <td className="px-2 py-1">{t.endDate}</td>
              <td className="px-2 py-1">{t.assignees.join(', ')}</td>
              <td className="px-2 py-1">{t.manday}</td>
              <td className="px-2 py-1">{t.blockedBy || ''}</td>
              <td className="px-2 py-1">{t.type}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={8} className="px-2 py-2 text-blue-600 cursor-pointer" onClick={addTask}>+ Add item</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
