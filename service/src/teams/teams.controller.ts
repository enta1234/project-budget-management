import { Body, Controller, Get, Post } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamInput } from './data/teams.repository';

@Controller('teams')
export class TeamsController {
  constructor(private readonly service: TeamsService) {}

  @Post()
  create(@Body() body: CreateTeamInput) {
    return this.service.create(body);
  }

  @Get()
  getTeams() {
    return this.service.getTeams();
  }
}
