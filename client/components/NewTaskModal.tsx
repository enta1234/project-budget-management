import { useState } from 'react';
import { Task } from './sampleData';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (task: Omit<Task, 'id'>) => void;
}

export default function NewTaskModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'done'>('todo');

  const submit = () => {
    if (!name || !start) return;
    onCreate({
      name,
      startDate: start,
      endDate: end || start,
      status,
      assignees: [],
      manday: 1,
      type: 'feature',
      iteration: ''
    });
    setName('');
    setStart('');
    setEnd('');
    setStatus('todo');
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded p-4 w-72 space-y-2">
        <div className="font-semibold">New Task</div>
        <input
          className="border w-full px-2 py-1 rounded text-sm"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="date"
          className="border w-full px-2 py-1 rounded text-sm"
          value={start}
          onChange={e => setStart(e.target.value)}
        />
        <input
          type="date"
          className="border w-full px-2 py-1 rounded text-sm"
          value={end}
          onChange={e => setEnd(e.target.value)}
        />
        <select
          className="border w-full px-2 py-1 rounded text-sm"
          value={status}
          onChange={e => setStatus(e.target.value as any)}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <div className="text-right space-x-2">
          <button className="px-2 py-1 text-sm" onClick={onClose}>Cancel</button>
          <button className="px-2 py-1 text-sm bg-blue-600 text-white rounded" onClick={submit}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
