import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkdaysController } from './workdays.controller';
import { WorkdaysService } from './workdays.service';
import { WorkdaysRepository } from './data/workdays.repository';
import { Workday, WorkdaySchema } from './data/workday.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Workday.name, schema: WorkdaySchema }])],
  controllers: [WorkdaysController],
  providers: [WorkdaysService, WorkdaysRepository],
})
export class WorkdaysModule {}
