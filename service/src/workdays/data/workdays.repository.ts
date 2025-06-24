import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workday } from './workday.schema';

export interface CreateWorkdayInput {
  name: string;
  date: Date;
}

export interface UpdateWorkdayInput {
  name?: string;
  date?: Date;
}

@Injectable()
export class WorkdaysRepository {
  constructor(@InjectModel(Workday.name) private model: Model<Workday>) {}

  findByYear(year: number): Promise<Workday[]> {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    return this.model
      .find({ date: { $gte: start, $lt: end } })
      .sort({ date: 1 })
      .exec();
  }

  create(data: CreateWorkdayInput): Promise<Workday> {
    const w = new this.model(data);
    return w.save();
  }

  update(id: string, data: UpdateWorkdayInput): Promise<Workday | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string): Promise<Workday | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
