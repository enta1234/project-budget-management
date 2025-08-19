export interface Task extends Record<string, unknown> {
  id: string;
  name: string;
  status: 'todo' | 'in_progress' | 'done';
  startDate: string;
  endDate: string;
  assignees: string[];
  manday: number;
  blockedBy?: string;
  type: string;
  iteration: string;
}
