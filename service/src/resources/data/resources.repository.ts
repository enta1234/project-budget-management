import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource } from './resource.schema';

export interface CreateResourceInput {
  name: string;
  email: string;
  position: string;
  startDate?: Date;
}

@Injectable()
export class ResourcesRepository {
  constructor(@InjectModel(Resource.name) private resourceModel: Model<Resource>) {}

  findAll(): Promise<Resource[]> {
    return this.resourceModel.find().sort({ name: 1 }).exec();
  }

  create(data: CreateResourceInput): Promise<Resource> {
    const res = new this.resourceModel(data);
    return res.save();
  }
}
