import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget } from './budget.schema';

export interface CreateBudgetInput {
  role: string;
  level: string;
  rate: number;
}

export interface UpdateBudgetInput {
  role?: string;
  level?: string;
  rate?: number;
}

@Injectable()
export class BudgetsRepository {
  constructor(@InjectModel(Budget.name) private budgetModel: Model<Budget>) {}

  findAll(): Promise<Budget[]> {
    return this.budgetModel.find().sort({ role: 1, level: 1 }).exec();
  }

  create(data: CreateBudgetInput): Promise<Budget> {
    const budget = new this.budgetModel(data);
    return budget.save();
  }

  update(id: string, data: UpdateBudgetInput): Promise<Budget | null> {
    return this.budgetModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }
}
