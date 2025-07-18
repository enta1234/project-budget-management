import { useState } from 'react';
import { Task, sampleIterations } from './sampleData';

interface Props {
  tasks: Task[];
}

const zoomLevels = ['day', 'week', 'month'];

export default function TimelineView({ tasks }: Props) {
  const [zoom, setZoom] = useState<'day' | 'week' | 'month'>('month');

  const dates = tasks.map(t => [new Date(t.startDate), new Date(t.endDate)]).flat();
  const min = new Date(Math.min(...dates.map(d => d.getTime())));
  const max = new Date(Math.max(...dates.map(d => d.getTime())));
  const range = max.getTime() - min.getTime();

  const calcLeft = (d: Date) => ((d.getTime() - min.getTime()) / range) * 100;

  const cells = [] as { label: string; left: number }[];
  const cur = new Date(min);
  const MAX_CELLS = 365;
  let safety = 0;
  while (cur <= max && safety < MAX_CELLS) {
    const label = cur.toISOString().slice(0, 10);
    cells.push({ label, left: calcLeft(new Date(cur)) });
    if (zoom === 'month') cur.setMonth(cur.getMonth() + 1);
    else if (zoom === 'week') cur.setDate(cur.getDate() + 7);
    else cur.setDate(cur.getDate() + 1);
    safety++;
  }

  return (
    <div className="relative border rounded bg-white p-4 overflow-x-auto" style={{minHeight:200}}>
      <div className="mb-2 flex items-center space-x-2">
        <label className="text-sm">Zoom:</label>
        <select value={zoom} onChange={e => setZoom(e.target.value as any)} className="border px-1 text-sm">
          {zoomLevels.map(z => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>
      <div className="relative" style={{height:120}}>
        {cells.map(c => (
          <div key={c.label} className="absolute text-xs" style={{left:`${c.left}%`, top:0}}>{c.label}</div>
        ))}
        {sampleIterations.map(it => (
          <div key={it.name} className="absolute border-l border-blue-500" style={{left:`${calcLeft(new Date(it.start))}%`, top:20, bottom:0}} />
        ))}
        {tasks.map(t => {
          const left = calcLeft(new Date(t.startDate));
          const right = calcLeft(new Date(t.endDate));
          return (
            <div key={t.id} className="absolute bg-green-500 text-white text-xs px-1 rounded" style={{left:`${left}%`, width:`${right-left}%`, top:40}}>
              {t.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
