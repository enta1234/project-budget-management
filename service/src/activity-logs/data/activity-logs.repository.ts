import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog } from './activity-log.schema';

@Injectable()
export class ActivityLogsRepository {
  constructor(@InjectModel(ActivityLog.name) private readonly model: Model<ActivityLog>) {}

  findAll(): Promise<ActivityLog[]> {
    return this.model.find().sort({ timestamp: -1 }).exec();
  }

  create(data: Partial<ActivityLog>): Promise<ActivityLog> {
    const log = new this.model(data);
    return log.save();
  }
}
