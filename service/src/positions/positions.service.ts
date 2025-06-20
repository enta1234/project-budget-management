import { Injectable } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class PositionsService {
  constructor(private readonly rolesService: RolesService) {}

  async getPositions() {
    const roles = await this.rolesService.getRoles();
    const pos = [] as any[];
    roles.forEach(r => {
      r.levels.forEach(l => {
        const slug = `${r.name} ${l}`
          .toLowerCase()
          .replace(/\s+/g, '_');
        pos.push({ value: slug, label: `${r.name} - ${l}` });
      });
    });
    return pos;
  }
}
