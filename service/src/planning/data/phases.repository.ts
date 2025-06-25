import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Phase } from './phase.schema';

export interface CreatePhaseInput {
  project: Types.ObjectId;
  name: string;
  order?: number;
}

export interface UpdatePhaseInput {
  name?: string;
  order?: number;
}

@Injectable()
export class PhasesRepository {
  constructor(@InjectModel(Phase.name) private model: Model<Phase>) {}

  findByProject(project: string): Promise<Phase[]> {
    return this.model.find({ project }).sort({ order: 1 }).exec();
  }

  create(data: CreatePhaseInput): Promise<Phase> {
    const phase = new this.model(data);
    return phase.save();
  }

  update(id: string, data: UpdatePhaseInput): Promise<Phase | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string): Promise<Phase | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
