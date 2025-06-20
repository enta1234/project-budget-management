import { Injectable, OnModuleInit } from '@nestjs/common';
import { RolesRepository } from './data/roles.repository';

@Injectable()
export class RolesInitializer implements OnModuleInit {
  constructor(private readonly repo: RolesRepository) {}

  async onModuleInit() {
    const existing = await this.repo.findAll();
    if (existing.length === 0) {
      const roleMap: Record<string, string[]> = {
        'Project Manager': ['Senior', 'Intermediate', 'Junior'],
        'System Analyst': ['Senior', 'Intermediate', 'Junior'],
        PA: ['Senior', 'Intermediate', 'Junior'],
        QA: ['Senior', 'Intermediate', 'Junior'],
      };
      for (const [role, levels] of Object.entries(roleMap)) {
        const r = await this.repo.createRole({ name: role });
        for (const lv of levels) {
          await this.repo.addLevel(r._id.toString(), lv);
        }
      }
    }
  }
}
