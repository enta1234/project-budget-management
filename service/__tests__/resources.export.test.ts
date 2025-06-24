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

describe('ResourcesService exportExcel', () => {
  it('should return a buffer', async () => {
    const service = new ResourcesService(new MockRepo() as any);
    const buf = await service.exportExcel();
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.byteLength).toBeGreaterThan(0);
  });
});
