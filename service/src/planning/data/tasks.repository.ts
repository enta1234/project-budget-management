import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './task.schema';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskInput {
  @Type(() => String)
  @IsString()
  project!: Types.ObjectId;

  @IsOptional()
  @Type(() => String)
  @IsString()
  phase?: Types.ObjectId;

  @IsString()
  name!: string;

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
  @IsString()
  owner?: string;

  @IsOptional()
  @IsNumber()
  manday?: number;

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
  @IsString()
  owner?: string;

  @IsOptional()
  @IsNumber()
  manday?: number;

  @IsOptional()
  @Type(() => String)
  @IsString()
  blockedBy?: Types.ObjectId;
}

@Injectable()
export class TasksRepository {
  constructor(@InjectModel(Task.name) private model: Model<Task>) {}

  findByProject(project: string): Promise<Task[]> {
    return this.model.find({ project }).sort({ createdAt: 1 }).exec();
  }

  create(data: CreateTaskInput): Promise<Task> {
    const task = new this.model(data);
    return task.save();
  }

  update(id: string, data: UpdateTaskInput): Promise<Task | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string): Promise<Task | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
