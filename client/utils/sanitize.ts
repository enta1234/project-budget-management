export function sanitizeList<T extends Record<string, unknown>>(items: T[]): T[] {
  return items.map(item => {
    if (item && typeof item.onClick !== 'undefined') {
      const { onClick, ...rest } = item;
      return rest as T;
    }
    return item;
  });
}
