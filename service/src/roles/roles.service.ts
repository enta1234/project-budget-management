import { Injectable } from '@nestjs/common';
import {
  RolesRepository,
  CreateRoleInput,
} from './data/roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly repo: RolesRepository) {}

  createRole(data: CreateRoleInput) {
    return this.repo.createRole(data);
  }

  addLevel(roleId: string, level: string) {
    return this.repo.addLevel(roleId, level);
  }

  removeLevel(roleId: string, level: string) {
    return this.repo.removeLevel(roleId, level);
  }

  getRoles() {
    return this.repo.findAll();
  }
}
