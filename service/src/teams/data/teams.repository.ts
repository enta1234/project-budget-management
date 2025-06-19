import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from './team.schema';

export interface CreateTeamInput {
  name: string;
  lead?: string;
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
}
