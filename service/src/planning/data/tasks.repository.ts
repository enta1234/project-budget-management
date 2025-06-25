import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './task.schema';

export interface CreateTaskInput {
  project: Types.ObjectId;
  phase?: Types.ObjectId;
  name: string;
  isFeature?: boolean;
}

export interface UpdateTaskInput {
  phase?: Types.ObjectId;
  name?: string;
  isFeature?: boolean;
}

@Injectable()
export class TasksRepository {
  constructor(@InjectModel(Task.name) private model: Model<Task>) {}

  findByProject(project: string): Promise<Task[]> {
    return this.model.find({ project }).sort({ createdAt: 1 }).exec();
  }

  create(data: CreateTaskInput): Promise<Task> {
    const task = new this.model(data);
    return task.save();
  }

  update(id: string, data: UpdateTaskInput): Promise<Task | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string): Promise<Task | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
