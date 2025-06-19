import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceInput } from './data/resources.repository';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly service: ResourcesService) {}

  @Get()
  getResources() {
    return this.service.getResources();
  }

  @Post()
  create(@Body() body: CreateResourceInput) {
    return this.service.create(body);
  }
}
