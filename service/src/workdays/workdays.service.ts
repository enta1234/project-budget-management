import { Injectable } from '@nestjs/common';
import {
  WorkdaysRepository,
  CreateWorkdayInput,
  UpdateWorkdayInput,
} from './data/workdays.repository';

interface WorkdayDto {
  id: string;
  name: string;
  date: Date;
  readonly: boolean;
}

@Injectable()
export class WorkdaysService {
  constructor(private readonly repo: WorkdaysRepository) {}

  async getWorkdays(year: number): Promise<WorkdayDto[]> {
    const custom = await this.repo.findByYear(year);
    const weekend = getWeekendDays(year).map(d => ({
      id: `weekend-${d.toISOString()}`,
      name: 'Weekend',
      date: d,
      readonly: true,
    }));
    const thai = getThaiHolidays(year).map(h => ({
      id: `thai-${h.date.toISOString()}`,
      name: h.name,
      date: h.date,
      readonly: true,
    }));
    const user = custom.map(c => ({
      id: c._id.toString(),
      name: c.name,
      date: c.date,
      readonly: false,
    }));
    return [...weekend, ...thai, ...user].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }

  create(data: CreateWorkdayInput) {
    return this.repo.create(data);
  }

  update(id: string, data: UpdateWorkdayInput) {
    return this.repo.update(id, data);
  }

  remove(id: string) {
    return this.repo.remove(id);
  }
}

function getWeekendDays(year: number): Date[] {
  const days: Date[] = [];
  const d = new Date(year, 0, 1);
  while (d.getFullYear() === year) {
    if (d.getDay() === 0 || d.getDay() === 6) {
      days.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function getThaiHolidays(year: number): { name: string; date: Date }[] {
  const toDate = (m: number, d: number) => new Date(year, m - 1, d);
  return [
    { name: "New Year's Day", date: toDate(1, 1) },
    { name: 'Chakri Memorial Day', date: toDate(4, 6) },
    { name: 'Songkran', date: toDate(4, 13) },
    { name: 'Songkran', date: toDate(4, 14) },
    { name: 'Songkran', date: toDate(4, 15) },
    { name: 'Labour Day', date: toDate(5, 1) },
    { name: 'Coronation Day', date: toDate(5, 4) },
    { name: "HM Queen's Birthday", date: toDate(6, 3) },
    { name: "HM King's Birthday", date: toDate(7, 28) },
    { name: 'HM Queen Mother Birthday', date: toDate(8, 12) },
    { name: 'King Bhumibol Memorial Day', date: toDate(10, 13) },
    { name: 'Chulalongkorn Day', date: toDate(10, 23) },
    { name: "Father's Day", date: toDate(12, 5) },
    { name: 'Constitution Day', date: toDate(12, 10) },
    { name: "New Year's Eve", date: toDate(12, 31) },
  ];
}
