import { Body, Controller, Get, Post, Patch, Param } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetInput, UpdateBudgetInput } from './data/budgets.repository';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly service: BudgetsService) {}

  @Get()
  getBudgets() {
    return this.service.getBudgets();
  }

  @Get('overview')
  getOverview() {
    return this.service.getOverview();
  }

  @Post()
  create(@Body() body: CreateBudgetInput) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateBudgetInput) {
    return this.service.update(id, body);
  }
}
