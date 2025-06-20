import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { BudgetsRepository } from './data/budgets.repository';
import { Budget, BudgetSchema } from './data/budget.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }])],
  controllers: [BudgetsController],
  providers: [BudgetsService, BudgetsRepository],
})
export class BudgetsModule {}
