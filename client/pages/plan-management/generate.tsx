// @ts-nocheck
import { useEffect, useState, useRef } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Layout, PageBreadcrumbs } from '../../components';
import { withAuth } from '../../context/AuthContext';
import { fetchProjects } from '../../models/projectsModel';
import { fetchTasks } from '../../models/tasksModel';

function GenerateTimeline() {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const [paper, setPaper] = useState<any>(null);

  useEffect(() => {
    fetchProjects()
      .then(p => setProjects(p.filter(pr => !pr.deleted)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!project) {
      setTasks([]);
      return;
    }
    fetchTasks(project._id || project.id)
      .then(t => setTasks(t))
      .catch(() => setTasks([]));
  }, [project]);

  useEffect(() => {
    async function draw() {
      const el = paperRef.current;
      if (!el) return;
      el.innerHTML = '';
      if (!project || tasks.length === 0) return;
      const joint = await import('jointjs');
      const { dia, shapes } = joint;
      const graph = new dia.Graph();
      const width = tasks.length * 160 + 200;
      const p = new dia.Paper({
        el,
        model: graph,
        width,
        height: 160,
        gridSize: 1,
        interactive: false,
        background: { color: '#A2D5C6' },
      });
      setPaper(p);
      const cells = [] as any[];
      let x = 80;
      tasks.forEach((t, idx) => {
        const year = new Date(t.startDate || Date.now()).getFullYear();
        const circle = new shapes.standard.Circle({
          position: { x, y: 60 },
          size: { width: 40, height: 40 },
          attrs: {
            body: { fill: '#000000', stroke: '#CFFFE2' },
            label: { text: t.name, fill: '#F6F6F6', fontSize: 14, y: 55 },
          },
        });
        const yearText = new shapes.standard.Rectangle({
          position: { x, y: 20 },
          size: { width: 1, height: 1 },
          attrs: {
            label: { text: String(year), fill: '#F6F6F6', fontSize: 14, textAnchor: 'middle', x: 20 },
            body: { stroke: 'none', fill: 'none' },
          },
        });
        cells.push(circle, yearText);
        if (idx) {
          const link = new dia.Link({
            source: { id: cells[cells.length - 4].id },
            target: { id: circle.id },
            attrs: {
              line: { stroke: '#CFFFE2', targetMarker: { type: 'path', d: 'M 10 -5 0 0 10 5 Z' } },
            },
          });
          cells.push(link);
        }
        x += 160;
      });
      const end = new shapes.standard.Circle({
        position: { x, y: 60 },
        size: { width: 40, height: 40 },
        attrs: {
          body: { fill: '#000000', stroke: '#CFFFE2' },
          label: { text: 'present', fill: '#F6F6F6', fontSize: 14, y: 55 },
        },
      });
      cells.push(end);
      if (tasks.length) {
        const link = new dia.Link({
          source: { id: cells[cells.length - 3].id },
          target: { id: end.id },
          attrs: {
            line: { stroke: '#CFFFE2', targetMarker: { type: 'path', d: 'M 10 -5 0 0 10 5 Z' } },
          },
        });
        cells.push(link);
      }
      graph.resetCells(cells);
    }
    draw();
  }, [project, tasks]);

  const handleDownload = () => {
    if (!paper) return;
    const svg = paper.svg.cloneNode(true) as SVGSVGElement;
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timeline.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <PageBreadcrumbs
          items={[{ label: 'Plan Management', href: '/plan-management' }, { label: 'Generate Timeline' }]}
        />
        <Paper sx={{ p: 2 }} elevation={3}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Generate Timeline
          </Typography>
          <Autocomplete
            sx={{ maxWidth: 400, mb: 2 }}
            value={project}
            onChange={(_, p) => setProject(p)}
            options={projects}
            getOptionLabel={o => o.name || ''}
            renderInput={params => <TextField {...params} label="Select Project" />}
          />
          <Box ref={paperRef} sx={{ mb: 2, overflow: 'auto', border: '1px solid #CFFFE2', p: 1 }} />
          {paper && (
            <Button variant="contained" onClick={handleDownload}>
              Download SVG
            </Button>
          )}
        </Paper>
      </Container>
    </Layout>
  );
}

export default withAuth(GenerateTimeline);
