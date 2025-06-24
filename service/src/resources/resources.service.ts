import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import {
  ResourcesRepository,
  CreateResourceInput,
  UpdateResourceInput,
} from './data/resources.repository';

@Injectable()
export class ResourcesService {
  constructor(private readonly repo: ResourcesRepository) {}

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
    const resources = await this.repo.findAll();
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Resources');
    ws.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Position', key: 'position', width: 20 },
      { header: 'Start Date', key: 'startDate', width: 15 },
    ];
    resources.forEach(r => {
      ws.addRow({
        name: r.name,
        email: r.email,
        position: r.position,
        startDate: r.startDate
          ? new Date(r.startDate).toISOString().split('T')[0]
          : '',
      });
    });
    return wb.xlsx.writeBuffer();
  }
}
