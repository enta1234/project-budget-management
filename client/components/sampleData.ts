import type { Task } from '../models/taskTypes';
export type { Task };

export const sampleUsers = ['Alice', 'Bob', 'Carol'];

export const sampleIterations = [
  { name: 'Sprint 1', start: '2025-06-01', end: '2025-06-14' },
  { name: 'Sprint 2', start: '2025-06-15', end: '2025-06-28' },
];

export const sampleTasks: Task[] = [
  {
    id: '1',
    name: 'Setup project repo',
    status: 'todo',
    startDate: '2025-06-01',
    endDate: '2025-06-03',
    assignees: ['Alice'],
    manday: 3,
    type: 'feature',
    iteration: 'Sprint 1',
  },
  {
    id: '2',
    name: 'Design database schema',
    status: 'in_progress',
    startDate: '2025-06-02',
    endDate: '2025-06-06',
    assignees: ['Bob'],
    manday: 5,
    blockedBy: '1',
    type: 'design',
    iteration: 'Sprint 1',
  },
  {
    id: '3',
    name: 'Implement auth module',
    status: 'todo',
    startDate: '2025-06-07',
    endDate: '2025-06-14',
    assignees: ['Carol'],
    manday: 7,
    type: 'feature',
    iteration: 'Sprint 2',
  },
  {
    id: '4',
    name: 'Deploy to staging',
    status: 'done',
    startDate: '2025-06-10',
    endDate: '2025-06-11',
    assignees: ['Alice'],
    manday: 2,
    type: 'chore',
    iteration: 'Sprint 2',
  },
];
