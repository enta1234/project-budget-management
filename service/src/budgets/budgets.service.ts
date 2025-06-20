import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BudgetsRepository, CreateBudgetInput } from './data/budgets.repository';
import { Resource } from '../resources/data/resource.schema';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class BudgetsService {
  constructor(
    private readonly repo: BudgetsRepository,
    @InjectModel(Resource.name) private readonly resourceModel: Model<Resource>,
    private readonly rolesService: RolesService,
  ) {}

  getBudgets() {
    return this.repo.findAll().then(budgets =>
      budgets.map(b => ({
        id: b._id.toString(),
        role: b.role,
        level: b.level,
        rate: b.rate,
      })),
    );
  }

  create(data: CreateBudgetInput) {
    return this.repo.create(data);
  }

  async getOverview() {
    const [resources, budgets, roles] = await Promise.all([
      this.resourceModel.find().exec(),
      this.repo.findAll(),
      this.rolesService.getRoles(),
    ]);

    const counts: Record<string, number> = {};
    resources.forEach(r => {
      counts[r.position] = (counts[r.position] || 0) + 1;
    });

    const rateMap: Record<string, number> = {};
    budgets.forEach(b => {
      const slug = `${b.role} ${b.level}`.toLowerCase().replace(/\s+/g, '_');
      rateMap[slug] = b.rate;
    });

    const positions: any[] = [];
    roles.forEach(role => {
      role.levels.forEach((level: string) => {
        const slug = `${role.name} ${level}`.toLowerCase().replace(/\s+/g, '_');
        positions.push({ slug, role: role.name, level });
      });
    });

    return positions.map(p => ({
      id: p.slug,
      role: p.role,
      level: p.level,
      count: counts[p.slug] || 0,
      rate: rateMap[p.slug] || 0,
    }));
  }
}
