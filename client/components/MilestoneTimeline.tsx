import { useRef } from 'react';

interface Milestone {
  title: string;
  year: number;
  description?: string;
}

const sampleData: Milestone[] = [
  { year: 2023, title: 'Phase 1.0', description: 'Start architecture' },
  { year: 2024, title: 'Phase 1.1', description: 'Initial release' },
  { year: 2025, title: 'Phase 2.0', description: 'UAT' },
  { year: 2025, title: 'Phase 2.0', description: 'Launch' },
  { year: 2026, title: 'Phase 3.0', description: 'Stabilization' },
];

export default function MilestoneTimeline() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // group milestones by year to handle stacking
  const groups = sampleData.reduce<Record<number, Milestone[]>>((acc, m) => {
    acc[m.year] = acc[m.year] || [];
    acc[m.year].push(m);
    return acc;
  }, {});

  const years = Object.keys(groups).map(y => parseInt(y, 10));
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const spacing = 200; // equal horizontal spacing per year
  const margin = 100;

  const maxItems = Math.max(...Object.values(groups).map(g => g.length));
  const levels = Math.ceil(maxItems / 2);
  const verticalGap = 40;
  const lineY = levels * verticalGap + 40;
  const height = lineY + levels * verticalGap + 60;

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
            y1={lineY}
            x2={width - margin}
            y2={lineY}
            stroke="#9ca3af"
            strokeWidth={2}
          />
          {years.sort().map(year => {
            const x = margin + (year - minYear) * spacing;
            const items = groups[year];
            return (
              <g key={year} transform={`translate(${x},0)`}>
                <text
                  y={lineY + 20}
                  textAnchor="middle"
                  className="fill-gray-800 text-sm"
                >
                  {year}
                </text>
                {items.map((m, idx) => {
                  const direction = idx % 2 === 0 ? -1 : 1;
                  const row = Math.floor(idx / 2) + 1;
                  const cy = lineY + direction * row * verticalGap;
                  return (
                    <g key={idx}>
                      <line
                        x1={0}
                        x2={0}
                        y1={lineY}
                        y2={cy}
                        stroke="#9ca3af"
                        strokeWidth={2}
                      />
                      <circle
                        cx={0}
                        cy={cy}
                        r={10}
                        className="fill-blue-500 stroke-white stroke-2"
                      >
                        <title>{`${m.title}: ${m.description ?? ''}`}</title>
                      </circle>
                      <text
                        y={cy - 12}
                        textAnchor="middle"
                        className="fill-gray-800 text-sm"
                      >
                        {m.title}
                      </text>
                      {m.description && (
                        <text
                          y={cy + 16}
                          textAnchor="middle"
                          className="fill-gray-500 text-xs"
                        >
                          {m.description}
                        </text>
                      )}
                    </g>
                  );
                })}
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
