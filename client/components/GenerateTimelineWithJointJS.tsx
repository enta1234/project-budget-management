import { useEffect, useRef, useState } from 'react';
import * as joint from 'jointjs';
import api from '../api';
import Loading from './Loading';

interface Project {
  _id: string;
  name: string;
}

interface Milestone {
  year: number;
  title: string;
  description?: string;
}

export default function GenerateTimelineWithJointJS() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState('');
  const [timeline, setTimeline] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<joint.dia.Graph | null>(null);
  const paperRef = useRef<joint.dia.Paper | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data } = await api.get('/api/v1/projects');
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadProjects();
  }, []);

  useEffect(() => {
    if (!graphRef.current) {
      graphRef.current = new joint.dia.Graph();
    }
    if (containerRef.current && !paperRef.current) {
      paperRef.current = new joint.dia.Paper({
        el: containerRef.current,
        model: graphRef.current,
        interactive: false,
        width: 100,
        height: 100,
        gridSize: 1,
        async: true,
      });
    }
  }, []);

  useEffect(() => {
    if (!selected) {
      graphRef.current?.clear();
      setTimeline([]);
      return;
    }
    setLoading(true);
    api
      .get('/api/v1/planning/tasks', { params: { project: selected } })
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : [];
        const converted = list
          .filter((t: any) => t.startDate || t.endDate)
          .map((t: any) => ({
            year: new Date(t.startDate || t.endDate).getFullYear(),
            title: t.name,
            description: t.detail,
          }));
        setTimeline(converted);
      })
      .catch(err => {
        console.error(err);
        setTimeline([]);
      })
      .finally(() => setLoading(false));
  }, [selected]);

  useEffect(() => {
    const graph = graphRef.current;
    const paper = paperRef.current;
    const container = containerRef.current;
    if (!graph || !paper || !container) return;

    graph.clear();
    if (timeline.length === 0) return;

    // group milestones by year
    const groups: Record<number, Milestone[]> = {};
    timeline.forEach(m => {
      groups[m.year] = groups[m.year] || [];
      groups[m.year].push(m);
    });
    const years = Object.keys(groups).map(y => parseInt(y, 10));
    const sortedYears = years.slice().sort((a, b) => a - b);
    const minYear = Math.min(...sortedYears);
    const maxYear = Math.max(...sortedYears);
    const spacing = 200;
    const margin = 100;

    const maxItems = Math.max(...Object.values(groups).map(g => g.length));
    const levels = Math.ceil(maxItems / 2);
    const verticalGap = 40;
    const lineY = levels * verticalGap + 40;
    const height = lineY + levels * verticalGap + 60;
    const width = Math.max(1, maxYear - minYear) * spacing + margin * 2;
    paper.setDimensions(width, height);

    const baseline = new joint.shapes.standard.Path();
    baseline.attr('body/d', `M ${margin} ${lineY} L ${width - margin} ${lineY}`);
    baseline.attr('body/stroke', '#9ca3af');
    baseline.attr('body/strokeWidth', 2);
    baseline.attr('body/fill', 'none');
    baseline.addTo(graph);

    sortedYears.forEach(year => {
      const x = margin + (year - minYear) * spacing;
      const items = groups[year];

      const yearLabel = new joint.shapes.standard.TextBlock();
      yearLabel.position(x - 30, lineY + 10);
      yearLabel.resize(60, 20);
      yearLabel.attr({
        body: { strokeWidth: 0, fill: 'transparent' },
        label: { text: String(year), fontSize: 12, fill: '#111827' },
      });
      yearLabel.addTo(graph);

      items.forEach((m, idx) => {
        const direction = idx % 2 === 0 ? -1 : 1;
        const row = Math.floor(idx / 2) + 1;
        const cy = lineY + direction * row * verticalGap;

        const connector = new joint.shapes.standard.Path();
        connector.attr('body/d', `M ${x} ${lineY} L ${x} ${cy}`);
        connector.attr('body/stroke', '#9ca3af');
        connector.attr('body/strokeWidth', 2);
        connector.attr('body/fill', 'none');
        connector.addTo(graph);

        const circle = new joint.shapes.standard.Circle();
        circle.position(x - 10, cy - 10);
        circle.resize(20, 20);
        circle.attr({
          body: { fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 },
        });
        circle.addTo(graph);

        const title = new joint.shapes.standard.TextBlock();
        title.position(x - 75, cy - 24);
        title.resize(150, 20);
        title.attr({
          body: { strokeWidth: 0, fill: 'transparent' },
          label: { text: m.title, fontSize: 12, fill: '#111827' },
        });
        title.addTo(graph);

        if (m.description) {
          const desc = new joint.shapes.standard.TextBlock();
          desc.position(x - 75, cy + 8);
          desc.resize(150, 20);
          desc.attr({
            body: { strokeWidth: 0, fill: 'transparent' },
            label: { text: m.description, fontSize: 10, fill: '#6b7280' },
          });
          desc.addTo(graph);
        }
      });
    });
  }, [timeline]);

  const handleDownload = () => {
    const svg = containerRef.current?.querySelector('svg');
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
    <div className="rounded border bg-white p-4">
      <div className="mb-4 flex items-center gap-2">
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="rounded border px-2 py-1"
        >
          <option value="">Select project</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleDownload}
          className="rounded bg-blue-600 px-3 py-1 text-white"
        >
          Download SVG
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center p-4">
          <Loading />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="overflow-x-auto rounded border bg-gray-50"
        />
      )}
    </div>
  );
}
