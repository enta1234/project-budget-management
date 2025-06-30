import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanningController } from './planning.controller';
import { PlanningService } from './planning.service';
import { Phase, PhaseSchema } from './data/phase.schema';
import { PhasesRepository } from './data/phases.repository';
import { Task, TaskSchema } from './data/task.schema';
import { TasksRepository } from './data/tasks.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Phase.name, schema: PhaseSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [PlanningController],
  providers: [
    PlanningService,
    PhasesRepository,
    TasksRepository,
  ],
})
export class PlanningModule {}
