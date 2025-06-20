import { Injectable } from '@nestjs/common';
import {
  TeamsRepository,
  CreateTeamInput,
  UpdateTeamInput,
} from './data/teams.repository';

@Injectable()
export class TeamsService {
  constructor(private readonly repo: TeamsRepository) {}

  create(data: CreateTeamInput) {
    return this.repo.create(data);
  }

  getTeams() {
    return this.repo.findAll();
  }

  update(id: string, data: UpdateTeamInput) {
    return this.repo.update(id, data);
  }

  remove(id: string) {
    return this.repo.remove(id);
  }
}
