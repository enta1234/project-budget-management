import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { BudgetsRepository } from './data/budgets.repository';
import { Budget, BudgetSchema } from './data/budget.schema';
import { Resource, ResourceSchema } from '../resources/data/resource.schema';
import { ResourcesModule } from '../resources/resources.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Budget.name, schema: BudgetSchema },
      { name: Resource.name, schema: ResourceSchema },
    ]),
    ResourcesModule,
    RolesModule,
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService, BudgetsRepository],
})
export class BudgetsModule {}
