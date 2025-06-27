import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Phase } from './phase.schema';
import { BaseRepository } from './base.repository';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePhaseInput {
  @Type(() => String)
  @IsString()
  project!: Types.ObjectId;

  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdatePhaseInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

@Injectable()
export class PhasesRepository extends BaseRepository<Phase> {
  constructor(@InjectModel(Phase.name) model: Model<Phase>) {
    super(model);
  }

  findByProject(project: string): Promise<Phase[]> {
    return this.model.find({ project }).sort({ order: 1 }).exec();
  }

  create(data: CreatePhaseInput): Promise<Phase> {
    return super.create(data);
  }

  update(id: string, data: UpdatePhaseInput): Promise<Phase | null> {
    return super.update(id, data);
  }

  remove(id: string): Promise<Phase | null> {
    return super.remove(id);
  }
}
