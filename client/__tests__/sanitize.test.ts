import { sanitizeList } from '../utils/sanitize';
import type { Task } from '../models/taskTypes';

describe('sanitizeList', () => {
  it('removes onClick property from items', () => {
    const items: (Task & { onClick?: () => void })[] = [
      {
        id: '1',
        name: 'T',
        status: 'todo',
        startDate: '2020-01-01',
        endDate: '2020-01-02',
        assignees: [],
        manday: 1,
        type: 'feature',
        iteration: 'Sprint 1',
        onClick: () => {}
      }
    ];
    const sanitized = sanitizeList(items);
    expect(sanitized[0]).not.toHaveProperty('onClick');
  });
});
