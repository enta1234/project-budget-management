import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from './setting.schema';

@Injectable()
export class SettingsRepository {
  constructor(@InjectModel(Setting.name) private readonly model: Model<Setting>) {}

  findByKey(key: string): Promise<Setting | null> {
    return this.model.findOne({ key }).exec();
  }

  async setValue(key: string, value: any): Promise<Setting> {
    return this.model
      .findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
      .exec();
  }
}
