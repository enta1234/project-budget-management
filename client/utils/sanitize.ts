export function sanitizeList<T extends Record<string, any>>(items: T[]): T[] {
  return items.map(item => {
    if (item && typeof item.onClick !== 'undefined') {
      const { onClick, ...rest } = item;
      return rest as T;
    }
    return item;
  });
}
