import { Injectable } from '@nestjs/common';
import { BudgetsRepository, CreateBudgetInput } from './data/budgets.repository';

@Injectable()
export class BudgetsService {
  constructor(private readonly repo: BudgetsRepository) {}

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
}
