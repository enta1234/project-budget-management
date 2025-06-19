import { Injectable } from '@nestjs/common';
import { EventsRepository } from './data/events.repository';

@Injectable()
export class EventsService {
  constructor(private readonly repo: EventsRepository) {}

  getEvents() {
    return this.repo.findAll();
  }
}
