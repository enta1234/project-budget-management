import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './event.schema';

@Injectable()
export class EventsRepository {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  findAll(): Promise<Event[]> {
    return this.eventModel.find().sort({ date: 1 }).exec();
  }

  create(title: string, date: Date): Promise<Event> {
    const event = new this.eventModel({ title, date });
    return event.save();
  }
}
