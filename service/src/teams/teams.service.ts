import { Injectable } from '@nestjs/common';
import { TeamsRepository, CreateTeamInput } from './data/teams.repository';

@Injectable()
export class TeamsService {
  constructor(private readonly repo: TeamsRepository) {}

  create(data: CreateTeamInput) {
    return this.repo.create(data);
  }

  getTeams() {
    return this.repo.findAll();
  }
}
