import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addYears,
  addMonths,
} from 'date-fns';

export function getServiceDuration(date: string | Date): string {
  const start = new Date(date);
  const now = new Date();
  const years = differenceInYears(now, start);
  const afterYears = addYears(start, years);
  const months = differenceInMonths(now, afterYears);
  const afterMonths = addMonths(afterYears, months);
  const days = differenceInDays(now, afterMonths);
  return `${years}y ${months}m ${days}d`;
}

export function getServiceExp(date: string | Date): string {
  const years = differenceInYears(new Date(), new Date(date));
  if (years <= 2) return 'junior';
  if (years <= 4) return 'intermediate';
  if (years <= 6) return 'senior';
  return 'advance';
}
