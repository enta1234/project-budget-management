import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './task.schema';
import { BaseRepository } from './base.repository';
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskInput {
  @Type(() => String)
  @IsString()
  project!: Types.ObjectId;

  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBoolean()
  isFeature?: boolean;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  assignees?: Types.ObjectId[];



  @IsOptional()
  @IsNumber()
  manday?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @Type(() => String)
  @IsString()
  blockedBy?: Types.ObjectId;
}

export class UpdateTaskInput {
  @IsOptional()
  @Type(() => String)
  @IsString()
  phase?: Types.ObjectId;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBoolean()
  isFeature?: boolean;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  assignees?: Types.ObjectId[];


  @IsOptional()
  @IsNumber()
  manday?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @Type(() => String)
  @IsString()
  blockedBy?: Types.ObjectId;
}

@Injectable()
export class TasksRepository extends BaseRepository<Task> {
  constructor(@InjectModel(Task.name) model: Model<Task>) {
    super(model);
  }

  findByProject(project: string): Promise<Task[]> {
    return this.model.find({ project }).sort({ createdAt: 1 }).exec();
  }

  create(data: CreateTaskInput): Promise<Task> {
    const payload = {
      ...data,
      ...(data.type ? { isFeature: data.type === 'feature' } : {}),
    };
    return super.create(payload);
  }

  update(id: string, data: UpdateTaskInput): Promise<Task | null> {
    const payload = {
      ...data,
      ...(data.type ? { isFeature: data.type === 'feature' } : {}),
    };
    return super.update(id, payload);
  }

  remove(id: string): Promise<Task | null> {
    return super.remove(id);
  }
}
