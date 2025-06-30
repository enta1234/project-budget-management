import { Model, Document } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  findByProject(project: string): Promise<T[]> {
    return this.model.find({ project }).exec();
  }

  create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    return doc.save();
  }

  update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
