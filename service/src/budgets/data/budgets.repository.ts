import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget } from './budget.schema';

export interface CreateBudgetInput {
  position: string;
  rate: number;
}

@Injectable()
export class BudgetsRepository {
  constructor(@InjectModel(Budget.name) private budgetModel: Model<Budget>) {}

  findAll(): Promise<Budget[]> {
    return this.budgetModel.find().sort({ position: 1 }).exec();
  }

  create(data: CreateBudgetInput): Promise<Budget> {
    const budget = new this.budgetModel(data);
    return budget.save();
  }
}
