export const DAY_WIDTH = 48;
export const MAX_CELLS = 365;

export interface DayCell {
  label: string;
  month: string;
  left: number;
  first: boolean;
}

export interface MonthCell {
  label: string;
  left: number;
  width: number;
  days: number;
  start: number;
}

/** Add days to a date without mutating the original */
export function addDays(d: Date, n: number): Date {
  const res = new Date(d);
  res.setDate(res.getDate() + n);
  return res;
}

/** Difference in whole days between two dates (d1 - d2) */
export function daysDiff(d1: Date, d2: Date): number {
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.floor((utc1 - utc2) / 86400000);
}

/**
 * Generate day cell metadata between start and end dates.
 * The number of cells is capped at MAX_CELLS to avoid expensive loops.
 */
export function generateDayCells(
  rangeStart: Date,
  rangeEnd: Date,
  pxPerDay = DAY_WIDTH,
): DayCell[] {
  const cells: DayCell[] = [];
  const cursor = new Date(rangeStart);
  let count = 0;
  while (cursor <= rangeEnd && count < MAX_CELLS) {
    cells.push({
      label: String(cursor.getDate()),
      month: cursor.toLocaleString('default', { month: 'short' }),
      left: daysDiff(cursor, rangeStart) * pxPerDay,
      first: cursor.getDate() === 1,
    });
    cursor.setDate(cursor.getDate() + 1);
    count++;
  }
  return cells;
}

/**
 * Generate month cell metadata between start and end dates.
 * Capped at MAX_CELLS months for safety.
 */
export function generateMonthCells(
  rangeStart: Date,
  rangeEnd: Date,
  pxPerDay = DAY_WIDTH,
): MonthCell[] {
  const months: MonthCell[] = [];
  let curMonth = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
  let count = 0;
  while (curMonth <= rangeEnd && count < MAX_CELLS) {
    const nextMonth = new Date(curMonth.getFullYear(), curMonth.getMonth() + 1, 1);
    const left = daysDiff(curMonth, rangeStart) * pxPerDay;
    const days = daysDiff(nextMonth, curMonth);
    months.push({
      label: curMonth.toLocaleString('default', { month: 'short', year: 'numeric' }),
      left,
      width: days * pxPerDay,
      days,
      start: daysDiff(curMonth, rangeStart),
    });
    curMonth = nextMonth;
    count++;
  }
  return months;
}
