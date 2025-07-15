import { useRef } from 'react';

interface Milestone {
  title: string;
  year: number;
  description?: string;
}

const sampleData: Milestone[] = [
  { title: 'Phase 1.0', year: 2023, description: 'Start architecture' },
  { title: 'Phase 1.1', year: 2024, description: 'Initial release' },
  { title: 'Phase 2.0', year: 2025, description: 'UAT + Launch' },
  { title: 'Phase 2.1', year: 2025, description: 'QA hardening' },
  { title: 'Phase 3.0', year: 2026, description: 'Scale Up' },
  { title: 'Phase 3.1', year: 2026, description: 'Optimization' },
];

export default function MilestoneTimeline() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const minYear = Math.min(...sampleData.map(m => m.year));
  const maxYear = Math.max(...sampleData.map(m => m.year));
  const spacing = 160;
  const margin = 80;
  const height = 140;
  const width = (maxYear - minYear) * spacing + margin * 2;

  const handleDownload = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    const blob = new Blob([clone.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timeline.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="overflow-x-auto border rounded bg-gray-50 p-4">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="font-sans text-gray-700"
        >
          <line
            x1={margin}
            y1={70}
            x2={width - margin}
            y2={70}
            stroke="#9ca3af"
            strokeWidth={2}
          />
          {sampleData.map((m, idx) => {
            const x = margin + (m.year - minYear) * spacing;
            return (
              <g key={idx} transform={`translate(${x},0)`}>
                <line y1={20} y2={70} stroke="#9ca3af" strokeWidth={2} />
                <text
                  y={15}
                  textAnchor="middle"
                  className="fill-gray-800 text-sm"
                >
                  {m.year}
                </text>
                <circle
                  cy={70}
                  r={10}
                  className="fill-blue-500 stroke-white stroke-2"
                />
                <text
                  y={90}
                  textAnchor="middle"
                  className="fill-gray-800 text-sm"
                >
                  {m.title}
                </text>
                {m.description && (
                  <text
                    y={105}
                    textAnchor="middle"
                    className="fill-gray-500 text-xs"
                  >
                    {m.description}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <button
        onClick={handleDownload}
        className="mt-2 rounded bg-blue-600 px-4 py-1 text-white"
      >
        Download SVG
      </button>
    </div>
  );
}
