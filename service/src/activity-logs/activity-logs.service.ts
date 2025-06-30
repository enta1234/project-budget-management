import { Injectable } from '@nestjs/common';
import { ActivityLogsRepository } from './data/activity-logs.repository';

@Injectable()
export class ActivityLogsService {
  constructor(private readonly repo: ActivityLogsRepository) {}

  getLogs() {
    return this.repo.findAll();
  }

  create(data: {
    method: string;
    url: string;
    body: Record<string, unknown>;
    statusCode: number;
    processTime: number;
    name?: string;
    detail?: string;
  }) {
    return this.repo.create({ ...data, timestamp: new Date() });
  }
}
