import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget } from './budget.schema';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateBudgetInput {
  @IsString()
  role!: string;

  @IsString()
  level!: string;

  @IsNumber()
  rate!: number;
}

export class UpdateBudgetInput {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsNumber()
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

  findById(id: string): Promise<Budget | null> {
    return this.budgetModel.findById(id).exec();
  }

  delete(id: string): Promise<Budget | null> {
    return this.budgetModel.findByIdAndDelete(id).exec();
  }
}
