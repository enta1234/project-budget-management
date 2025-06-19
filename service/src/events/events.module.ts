import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsRepository } from './data/events.repository';
import { Event, EventSchema } from './data/event.schema';
import { EventsInitializer } from './events.initializer';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository, EventsInitializer],
})
export class EventsModule {}
