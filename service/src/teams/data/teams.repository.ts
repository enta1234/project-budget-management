import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from './team.schema';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateTeamInput {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  lead?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  members?: string[];
}

export class UpdateTeamInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  lead?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  members?: string[];
}

@Injectable()
export class TeamsRepository {
  constructor(@InjectModel(Team.name) private teamModel: Model<Team>) {}

  findAll(): Promise<Team[]> {
    return this.teamModel.find().sort({ createdAt: -1 }).exec();
  }

  create(data: CreateTeamInput): Promise<Team> {
    const team = new this.teamModel(data);
    return team.save();
  }

  update(id: string, data: UpdateTeamInput): Promise<Team | null> {
    return this.teamModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  remove(id: string): Promise<Team | null> {
    return this.teamModel.findByIdAndDelete(id).exec();
  }
}
