import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './project.schema';

export interface CreateProjectInput {
  name: string;
  description?: string;
  resources: number;
  start: Date;
  end: Date;
  manday: number;
  priority: number;
  lead?: string;
  status?: string;
  members?: string[];
}

@Injectable()
export class ProjectsRepository {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  findAll(): Promise<Project[]> {
    return this.projectModel.find().sort({ start: 1 }).exec();
  }

  create(data: CreateProjectInput): Promise<Project> {
    const project = new this.projectModel(data);
    return project.save();
  }
}
