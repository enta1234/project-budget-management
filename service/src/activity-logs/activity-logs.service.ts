import { Injectable } from '@nestjs/common';
import { ActivityLogsRepository } from './data/activity-logs.repository';

@Injectable()
export class ActivityLogsService {
  constructor(private readonly repo: ActivityLogsRepository) {}

  getLogs() {
    return this.repo.findAll();
  }

  create(data: { method: string; url: string; body: any; statusCode: number; processTime: number }) {
    return this.repo.create({ ...data, timestamp: new Date() });
  }
}
