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
import {
  MilestonesRepository,
  CreateMilestoneInput,
  UpdateMilestoneInput,
} from './data/milestones.repository';

@Injectable()
export class PlanningService {
  constructor(
    private readonly phases: PhasesRepository,
    private readonly tasks: TasksRepository,
    private readonly milestones: MilestonesRepository,
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

  createTask(data: CreateTaskInput) {
    return this.tasks.create(data);
  }

  updateTask(id: string, data: UpdateTaskInput) {
    return this.tasks.update(id, data);
  }

  removeTask(id: string) {
    return this.tasks.remove(id);
  }

  getMilestones(project: string) {
    return this.milestones.findByProject(project);
  }

  async createMilestone(data: CreateMilestoneInput) {
    const list = await this.milestones.findByProject(String(data.project));
    const target = new Date(data.date).toISOString().split('T')[0];
    if (list.some(m => new Date(m.date).toISOString().split('T')[0] === target)) {
      throw new BadRequestException('Milestone date overlaps existing one');
    }
    return this.milestones.create(data);
  }

  updateMilestone(id: string, data: UpdateMilestoneInput) {
    return this.milestones.update(id, data);
  }

  removeMilestone(id: string) {
    return this.milestones.remove(id);
  }
}
