import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addYears,
  addMonths,
} from 'date-fns';
import {
  ResourcesRepository,
  CreateResourceInput,
  UpdateResourceInput,
} from './data/resources.repository';
import { PositionsService } from '../positions/positions.service';

@Injectable()
export class ResourcesService {
  constructor(
    private readonly repo: ResourcesRepository,
    private readonly positionsService: PositionsService,
  ) {}

  getResources() {
    return this.repo.findAll().then(resources =>
      resources.map(r => ({
        id: r._id.toString(),
        name: r.name,
        email: r.email,
        position: r.position,
        startDate: r.startDate,
      }))
    );
  }

  create(data: CreateResourceInput) {
    return this.repo.create(data);
  }

  update(id: string, data: UpdateResourceInput) {
    return this.repo.update(id, data);
  }

  remove(id: string) {
    return this.repo.remove(id);
  }

  async exportExcel() {
    const [resources, positions] = await Promise.all([
      this.repo.findAll(),
      this.positionsService.getPositions(),
    ]);

    const posMap: Record<string, { role: string; level: string }> = {};
    positions.forEach(p => {
      const [role, level] = p.label.split(' - ');
      posMap[p.value] = { role, level };
    });

    function getServiceDuration(date: Date) {
      const start = new Date(date);
      const now = new Date();
      const years = differenceInYears(now, start);
      const afterYears = addYears(start, years);
      const months = differenceInMonths(now, afterYears);
      const afterMonths = addMonths(afterYears, months);
      const days = differenceInDays(now, afterMonths);
      return `${years}y ${months}m ${days}d`;
    }

    function getServiceExp(date: Date) {
      const years = differenceInYears(new Date(), new Date(date));
      if (years <= 2) return 'junior';
      if (years <= 4) return 'intermediate';
      if (years <= 6) return 'senior';
      return 'advance';
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Resources');
    ws.columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Role', key: 'role', width: 20 },
      { header: 'Level', key: 'level', width: 10 },
      { header: 'Start Date', key: 'startDate', width: 15 },
      { header: 'Service Year', key: 'serviceYear', width: 15 },
      { header: 'Service Exp', key: 'serviceExp', width: 15 },
    ];

    resources.forEach((r, idx) => {
      const map = posMap[r.position] || { role: '', level: '' };
      const start = r.startDate ? new Date(r.startDate) : null;
      ws.addRow({
        no: idx + 1,
        name: r.name,
        email: r.email,
        role: map.role,
        level: map.level,
        startDate: start ? start.toISOString().split('T')[0] : '',
        serviceYear: start ? getServiceDuration(start) : '',
        serviceExp: start ? getServiceExp(start) : '',
      });
    });
    return wb.xlsx.writeBuffer();
  }
}
