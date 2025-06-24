import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ResourcesService } from './resources.service';
import {
  CreateResourceInput,
  UpdateResourceInput,
} from './data/resources.repository';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly service: ResourcesService) {}

  @Get()
  getResources() {
    return this.service.getResources();
  }

  @Get('export')
  async exportResources(@Res() res: Response) {
    const buffer = await this.service.exportExcel();
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=resources.xlsx',
    });
    res.send(buffer);
  }

  @Post()
  create(@Body() body: CreateResourceInput) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateResourceInput) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
