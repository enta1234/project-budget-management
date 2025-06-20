import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get()
  getRoles() {
    return this.service.getRoles();
  }

  @Post()
  createRole(@Body() body: { name: string }) {
    return this.service.createRole({ name: body.name });
  }

  @Post(':id/levels')
  addLevel(@Param('id') id: string, @Body() body: { name: string }) {
    return this.service.addLevel(id, body.name);
  }

  @Delete(':id/levels/:name')
  removeLevel(@Param('id') id: string, @Param('name') name: string) {
    return this.service.removeLevel(id, name);
  }
}
