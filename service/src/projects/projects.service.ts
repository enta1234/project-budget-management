import { Injectable } from '@nestjs/common';
import { ProjectsRepository, CreateProjectInput } from './data/projects.repository';

@Injectable()
export class ProjectsService {
  constructor(private readonly repo: ProjectsRepository) {}

  create(data: CreateProjectInput) {
    return this.repo.create(data);
  }

  getProjects() {
    return this.repo.findAll();
  }

  getProject(id: string) {
    return this.repo.findOne(id);
  }
}
