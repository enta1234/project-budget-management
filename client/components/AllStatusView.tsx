import { Task } from './sampleData';

interface Props {
  tasks: Task[];
}

export default function AllStatusView({ tasks }: Props) {
  const groups = tasks.reduce<Record<string, Task[]>>((acc, t) => {
    acc[t.status] = acc[t.status] || [];
    acc[t.status].push(t);
    return acc;
  }, {});
  return (
    <div className="space-y-4">
      {Object.keys(groups).map(status => (
        <div key={status} className="bg-white border rounded">
          <div className="border-b px-2 py-1 font-semibold text-sm capitalize">
            {status.replace('_', ' ')}
          </div>
          <ul className="p-2 text-sm list-disc ml-4">
            {groups[status].map(t => (
              <li key={t.id}>{t.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
