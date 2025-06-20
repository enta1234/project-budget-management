import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamInput, UpdateTeamInput } from './data/teams.repository';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateTeamInput) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
