import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './project.schema';
import { IsString, IsOptional, IsNumber, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectInput {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  resources!: number;

  @Type(() => Date)
  @IsDate()
  start!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sprintStart?: Date;

  @Type(() => Date)
  @IsDate()
  end!: Date;

  @IsOptional()
  @IsNumber()
  manday?: number;

  @IsOptional()
  @IsNumber()
  sprintLength?: number;

  @IsNumber()
  priority!: number;

  @IsOptional()
  @IsString()
  lead?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  members?: string[];

  @IsOptional()
  deleted?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deletedAt?: Date;
}

export class UpdateProjectInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  resources?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  start?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sprintStart?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end?: Date;

  @IsOptional()
  @IsNumber()
  manday?: number;

  @IsOptional()
  @IsNumber()
  sprintLength?: number;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsString()
  lead?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  members?: string[];

  @IsOptional()
  deleted?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deletedAt?: Date;
}

@Injectable()
export class ProjectsRepository {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  findAll(): Promise<Project[]> {
    return this.projectModel
      .find()
      .sort({ deleted: 1, start: 1 })
      .populate('lead', 'name')
      .exec();
  }

  findOne(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).populate('lead', 'name').exec();
  }

  create(data: CreateProjectInput): Promise<Project> {
    const project = new this.projectModel(data);
    return project.save();
  }

  update(id: string, data: UpdateProjectInput): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  remove(id: string): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(
        id,
        { deleted: true, deletedAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
        { new: true },
      )
      .exec();
  }

  restore(id: string): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(id, { deleted: false, deletedAt: null }, { new: true })
      .exec();
  }
}
