import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Milestone } from './milestone.schema';

export interface CreateMilestoneInput {
  project: Types.ObjectId;
  name: string;
  date: Date;
}

export interface UpdateMilestoneInput {
  name?: string;
  date?: Date;
}

@Injectable()
export class MilestonesRepository {
  constructor(@InjectModel(Milestone.name) private model: Model<Milestone>) {}

  findByProject(project: string): Promise<Milestone[]> {
    return this.model.find({ project }).sort({ date: 1 }).exec();
  }

  create(data: CreateMilestoneInput): Promise<Milestone> {
    const mile = new this.model(data);
    return mile.save();
  }

  update(id: string, data: UpdateMilestoneInput): Promise<Milestone | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string): Promise<Milestone | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
