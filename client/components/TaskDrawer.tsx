import { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { Task } from './sampleData';

interface Props {
  task: Task | null;
  onClose: () => void;
  onSave: (t: Task) => void;
}

export default function TaskDrawer({ task, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [manday, setManday] = useState(1);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setManday(task.manday);
    }
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    onSave({ ...task, name, manday });
  };

  return (
    <Drawer anchor="right" open={!!task} onClose={onClose}>
      <div className="w-80 p-4 space-y-2">
        <div className="font-semibold text-lg">Task #{task.id}</div>
        <input
          className="border w-full px-2 py-1 rounded text-sm"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="number"
          className="border w-full px-2 py-1 rounded text-sm"
          value={manday}
          onChange={e => setManday(Number(e.target.value))}
        />
        <div className="text-right space-x-2">
          <button className="px-2 py-1 text-sm" onClick={onClose}>Cancel</button>
          <button
            className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </Drawer>
  );
}
