import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Milestone } from './milestone.schema';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMilestoneInput {
  @Type(() => String)
  @IsString()
  project!: Types.ObjectId;

  @IsString()
  name!: string;

  @Type(() => Date)
  @IsDate()
  date!: Date;

  @IsOptional()
  @IsString()
  detail?: string;
}

export class UpdateMilestoneInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  detail?: string;
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
