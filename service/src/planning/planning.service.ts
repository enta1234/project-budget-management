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
      const existing = await this.tasks.findByProject(String(data.project));
      const clash = existing.find(
        t => t.type === 'milestone' && t.startDate && new Date(t.startDate).getTime() === new Date(data.startDate as Date).getTime(),
      );
      if (clash) {
        throw new BadRequestException('milestone date overlaps');
      }
    }
    return this.tasks.create(data);
  }

  async updateTask(id: string, data: UpdateTaskInput) {
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      throw new BadRequestException('End date must be after start date');
    }
    if (data.type === 'milestone' && data.startDate) {
      const current = await this.tasks.findById(id);
      const projectId = current?.project.toString();
      if (projectId) {
        const existing = await this.tasks.findByProject(projectId);
        const clash = existing.find(
          t => String(t._id) !== id && t.type === 'milestone' && t.startDate && new Date(t.startDate).getTime() === new Date(data.startDate as Date).getTime(),
        );
        if (clash) {
          throw new BadRequestException('milestone date overlaps');
        }
      }
    }
    return this.tasks.update(id, data);
  }

  removeTask(id: string) {
    return this.tasks.remove(id);
  }

}
