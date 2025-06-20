import { Injectable } from '@nestjs/common';
import positions from './data/positions';

@Injectable()
export class PositionsService {
  getPositions() {
    return positions;
  }
}
