import { Task, sampleUsers, sampleIterations } from './sampleData';

interface Props {
  tasks: Task[];
}

export default function CapacityView({ tasks }: Props) {
  const totals: Record<string, Record<string, number>> = {};
  sampleUsers.forEach(u => {
    totals[u] = {};
    sampleIterations.forEach(it => {
      totals[u][it.name] = tasks
        .filter(t => t.assignees.includes(u) && t.iteration === it.name)
        .reduce((s, t) => s + t.manday, 0);
    });
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm bg-white rounded border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1">Member</th>
            {sampleIterations.map(it => (
              <th key={it.name} className="px-2 py-1">{it.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sampleUsers.map(u => (
            <tr key={u} className="border-t">
              <td className="px-2 py-1 font-medium">{u}</td>
              {sampleIterations.map(it => (
                <td key={it.name} className="px-2 py-1 text-center">{totals[u][it.name]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
