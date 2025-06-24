import { Body, Controller, Get, Post, Patch, Delete, Param, Query } from '@nestjs/common';
import { WorkdaysService } from './workdays.service';
import { CreateWorkdayInput, UpdateWorkdayInput } from './data/workdays.repository';

@Controller('workdays')
export class WorkdaysController {
  constructor(private readonly service: WorkdaysService) {}

  @Get()
  getWorkdays(@Query('year') year?: string) {
    const y = Number(year) || new Date().getFullYear();
    return this.service.getWorkdays(y);
  }

  @Post()
  create(@Body() body: CreateWorkdayInput) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateWorkdayInput) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
