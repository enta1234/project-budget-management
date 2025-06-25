import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource } from './resource.schema';
import { IsString, IsEmail, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateResourceInput {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  position!: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;
}

export class UpdateResourceInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;
}

@Injectable()
export class ResourcesRepository {
  constructor(@InjectModel(Resource.name) private resourceModel: Model<Resource>) {}

  findAll(): Promise<Resource[]> {
    return this.resourceModel.find().sort({ startDate: 1 }).exec();
  }

  create(data: CreateResourceInput): Promise<Resource> {
    const res = new this.resourceModel(data);
    return res.save();
  }

  update(id: string, data: UpdateResourceInput): Promise<Resource | null> {
    return this.resourceModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  remove(id: string): Promise<Resource | null> {
    return this.resourceModel.findByIdAndDelete(id).exec();
  }
}
