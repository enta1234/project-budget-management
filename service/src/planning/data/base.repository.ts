import { Model } from 'mongoose';

export abstract class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  findByProject(project: string): Promise<T[]> {
    return this.model.find({ project }).exec();
  }

  create(data: any): Promise<T> {
    const doc = new this.model(data);
    return doc.save();
  }

  update(id: string, data: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
