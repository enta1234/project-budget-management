import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsRepository } from './data/events.repository';
import { Event, EventSchema } from './data/event.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
})
export class EventsModule {}
