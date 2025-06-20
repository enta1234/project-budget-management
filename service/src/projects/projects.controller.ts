import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectInput } from './data/projects.repository';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Post()
  create(@Body() body: CreateProjectInput) {
    return this.service.create(body);
  }

  @Get()
  getProjects() {
    return this.service.getProjects();
  }

  @Get(':id')
  getProject(@Param('id') id: string) {
    return this.service.getProject(id);
  }
}
