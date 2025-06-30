import { PlanningService } from '../src/planning/planning.service';

class MockTasksRepo {
  list: any[] = [];
  findByProject(project: string) {
    return Promise.resolve(this.list.filter(t => t.project === project));
  }
  findById(id: string) {
    return Promise.resolve(this.list.find(t => t._id === id) || null);
  }
  create(data: any) {
    this.list.push({ _id: String(this.list.length + 1), ...data });
    return Promise.resolve(data);
  }
  update() { return Promise.resolve(null); }
  remove() { return Promise.resolve(null); }
}

describe('PlanningService milestone tasks', () => {
  it('should not allow overlapping milestone dates', async () => {
    const repo = new MockTasksRepo();
    const service = new PlanningService({} as any, repo as any);
    await service.createTask({ project: 'p1' as any, name: 'M1', startDate: new Date('2024-01-01'), type: 'milestone' });
    await expect(
      service.createTask({ project: 'p1' as any, name: 'M2', startDate: new Date('2024-01-01'), type: 'milestone' })
    ).rejects.toThrow('overlaps');
  });
});
