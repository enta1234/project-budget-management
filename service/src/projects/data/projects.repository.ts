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
  manday?: number;
  priority: number;
  lead?: string;
  status?: string;
  members?: string[];
  deleted?: boolean;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  resources?: number;
  start?: Date;
  end?: Date;
  manday?: number;
  priority?: number;
  lead?: string;
  status?: string;
  members?: string[];
  deleted?: boolean;
}

@Injectable()
export class ProjectsRepository {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  findAll(): Promise<Project[]> {
    return this.projectModel
      .find()
      .sort({ deleted: 1, start: 1 })
      .populate('lead', 'name')
      .exec();
  }

  findOne(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).populate('lead', 'name').exec();
  }

  create(data: CreateProjectInput): Promise<Project> {
    const project = new this.projectModel(data);
    return project.save();
  }

  update(id: string, data: UpdateProjectInput): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  remove(id: string): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(id, { deleted: true }, { new: true })
      .exec();
  }

  restore(id: string): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(id, { deleted: false }, { new: true })
      .exec();
  }
}
