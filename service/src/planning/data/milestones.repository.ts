import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Milestone } from './milestone.schema';
import { BaseRepository } from './base.repository';
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
export class MilestonesRepository extends BaseRepository<Milestone> {
  constructor(@InjectModel(Milestone.name) model: Model<Milestone>) {
    super(model);
  }

  findByProject(project: string): Promise<Milestone[]> {
    return this.model.find({ project }).sort({ date: 1 }).exec();
  }

  create(data: CreateMilestoneInput): Promise<Milestone> {
    return super.create(data);
  }

  update(id: string, data: UpdateMilestoneInput): Promise<Milestone | null> {
    return super.update(id, data);
  }

  remove(id: string): Promise<Milestone | null> {
    return super.remove(id);
  }
}
