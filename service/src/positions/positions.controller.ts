import { Controller, Get } from '@nestjs/common';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly service: PositionsService) {}

  @Get()
  getPositions() {
    return this.service.getPositions();
  }
}
