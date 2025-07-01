import { Injectable, BadRequestException } from '@nestjs/common';
import {
  PhasesRepository,
  CreatePhaseInput,
  UpdatePhaseInput,
} from './data/phases.repository';
import {
  TasksRepository,
  CreateTaskInput,
  UpdateTaskInput,
} from './data/tasks.repository';

@Injectable()
export class PlanningService {
  constructor(
    private readonly phases: PhasesRepository,
    private readonly tasks: TasksRepository,
  ) {}

  getPhases(project: string) {
    return this.phases.findByProject(project);
  }

  createPhase(data: CreatePhaseInput) {
    return this.phases.create(data);
  }

  updatePhase(id: string, data: UpdatePhaseInput) {
    return this.phases.update(id, data);
  }

  removePhase(id: string) {
    return this.phases.remove(id);
  }

  getTasks(project: string) {
    return this.tasks.findByProject(project);
  }

  async createTask(data: CreateTaskInput) {
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      throw new BadRequestException('End date must be after start date');
    }
    if (data.type === 'milestone' && data.startDate) {
      const list = await this.tasks.findByProject(String(data.project));
      const target = new Date(data.startDate).toISOString().split('T')[0];
      if (
        list.some(
          t =>
            t.type === 'milestone' &&
            t.startDate &&
            new Date(t.startDate).toISOString().split('T')[0] === target,
        )
      ) {
        throw new BadRequestException('Milestone date overlaps existing one');
      }
      return this.tasks.create(data);
    }
    return this.tasks.create(data);
  }

  async updateTask(id: string, data: UpdateTaskInput) {
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      throw new BadRequestException('End date must be after start date');
    }
    if (data.type === 'milestone' && data.startDate) {
      const existing = await this.tasks.findById(id);
      const project = existing?.project ? String(existing.project) : undefined;
      if (project) {
        const list = await this.tasks.findByProject(project);
        const target = new Date(data.startDate!).toISOString().split('T')[0];
        if (
          list.some(
            t =>
              t.type === 'milestone' &&
              String(t._id) !== id &&
              t.startDate &&
              new Date(t.startDate).toISOString().split('T')[0] === target,
          )
        ) {
          throw new BadRequestException('Milestone date overlaps existing one');
        }
      }
      return this.tasks.update(id, data);
    }
    return this.tasks.update(id, data);
  }

  removeTask(id: string) {
    return this.tasks.remove(id);
  }

}
