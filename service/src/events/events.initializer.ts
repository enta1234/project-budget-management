import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventsRepository } from './data/events.repository';

@Injectable()
export class EventsInitializer implements OnModuleInit {
  constructor(private readonly repo: EventsRepository) {}

  async onModuleInit() {
    const existing = await this.repo.findAll();
    if (existing.length === 0) {
      await this.repo.create('Initial Planning', new Date('2023-01-01'));
      await this.repo.create('Development', new Date('2023-03-01'));
      await this.repo.create('Release', new Date('2023-06-01'));
    }
  }
}
