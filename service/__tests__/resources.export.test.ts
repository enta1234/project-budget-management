import { ResourcesService } from '../src/resources/resources.service';

class MockRepo {
  findAll() {
    return Promise.resolve([
      {
        name: 'Test',
        email: 'test@example.com',
        position: 'dev',
        startDate: new Date('2020-01-01'),
      },
    ]);
  }
}

class MockPositionsService {
  getPositions() {
    return Promise.resolve([{ value: 'dev_junior', label: 'Dev - junior' }]);
  }
}

describe('ResourcesService exportExcel', () => {
  it('should return a buffer', async () => {
    const service = new ResourcesService(
      new MockRepo() as any,
      new MockPositionsService() as any,
    );
    const buf = await service.exportExcel();
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.byteLength).toBeGreaterThan(0);
  });
});
