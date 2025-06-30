import { Body, Controller, Get, Post, Patch, Delete, Param, Query } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { CreatePhaseInput, UpdatePhaseInput } from './data/phases.repository';
import { CreateTaskInput, UpdateTaskInput } from './data/tasks.repository';

@Controller('planning')
export class PlanningController {
  constructor(private readonly service: PlanningService) {}

  @Get('phases')
  getPhases(@Query('project') project: string) {
    return this.service.getPhases(project);
  }

  @Post('phases')
  createPhase(@Body() body: CreatePhaseInput) {
    return this.service.createPhase(body);
  }

  @Patch('phases/:id')
  updatePhase(@Param('id') id: string, @Body() body: UpdatePhaseInput) {
    return this.service.updatePhase(id, body);
  }

  @Delete('phases/:id')
  removePhase(@Param('id') id: string) {
    return this.service.removePhase(id);
  }

  @Get('tasks')
  getTasks(@Query('project') project: string) {
    return this.service.getTasks(project);
  }

  @Post('tasks')
  createTask(@Body() body: CreateTaskInput) {
    return this.service.createTask(body);
  }

  @Patch('tasks/:id')
  updateTask(@Param('id') id: string, @Body() body: UpdateTaskInput) {
    return this.service.updateTask(id, body);
  }

  @Delete('tasks/:id')
  removeTask(@Param('id') id: string) {
    return this.service.removeTask(id);
  }

}
