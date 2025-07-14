import { Task, sampleIterations } from './sampleData';

interface Props {
  tasks: Task[];
}

export default function IterationsView({ tasks }: Props) {
  return (
    <div className="space-y-4">
      {sampleIterations.map(it => (
        <div key={it.name} className="bg-white rounded border p-2">
          <h3 className="font-semibold mb-1">
            {it.name} ({it.start} - {it.end})
          </h3>
          <ul className="list-disc ml-4 text-sm">
            {tasks
              .filter(t => t.iteration === it.name)
              .map(t => (
                <li key={t.id}>{t.name} - {t.status}</li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
