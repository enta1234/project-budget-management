import { PlanningService } from '../src/planning/planning.service';

class MockTasksRepo {
  create(data: any) { return Promise.resolve(data); }
  update() { return Promise.resolve(null); }
  findByProject() { return Promise.resolve([]); }
  remove() { return Promise.resolve(null); }
}

describe('PlanningService tasks', () => {
  it('should not allow endDate before startDate', async () => {
    const service = new PlanningService({} as any, new MockTasksRepo() as any, {} as any);
    try {
      await service.createTask({
        project: 'p1' as any,
        name: 'T',
        startDate: new Date('2024-01-02'),
        endDate: new Date('2024-01-01'),
      });
      throw new Error('should have thrown');
    } catch (e: any) {
      expect(e.message).toMatch('End date must be after start date');
    }
  });
});
