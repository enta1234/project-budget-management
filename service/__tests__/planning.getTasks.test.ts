import { PlanningService } from '../src/planning/planning.service';

describe('PlanningService getTasks', () => {
  it('returns tasks from repository', async () => {
    const sample = [{ _id: '1', name: 'T1' }];
    const tasksRepo = {
      findByProject: jest.fn().mockResolvedValue(sample),
    } as any;
    const service = new PlanningService({} as any, tasksRepo);
    const result = await service.getTasks('p1');
    expect(result).toEqual(sample);
    expect(tasksRepo.findByProject).toHaveBeenCalledWith('p1');
  });
});
