import { PlanningService } from '../src/planning/planning.service';

class MockMilestonesRepo {
  list: any[] = [];
  findByProject(project: string) {
    return Promise.resolve(this.list.filter(m => m.project === project));
  }
  create(data: any) {
    this.list.push(data);
    return Promise.resolve(data);
  }
  update() { return Promise.resolve(null); }
  remove() { return Promise.resolve(null); }
}

describe('PlanningService milestones', () => {
  it('should not allow overlapping milestone dates', async () => {
    const repo = new MockMilestonesRepo();
    const service = new PlanningService({} as any, {} as any, repo as any);
    await service.createMilestone({ project: 'p1' as any, name: 'M1', date: new Date('2024-01-01') });
    await expect(
      service.createMilestone({ project: 'p1' as any, name: 'M2', date: new Date('2024-01-01') })
    ).rejects.toThrow('overlaps');
  });
});
