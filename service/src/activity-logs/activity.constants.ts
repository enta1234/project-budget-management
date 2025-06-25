export interface ActivityDescription {
  pattern: RegExp;
  name: string;
  detail: string;
}

export const ACTIVITY_DESCRIPTIONS: ActivityDescription[] = [
  {
    pattern: /^POST \/api\/v1\/projects$/, 
    name: 'Create project',
    detail: 'Create a new project',
  },
  {
    pattern: /^PATCH \/api\/v1\/projects\//, 
    name: 'Update project',
    detail: 'Modify an existing project',
  },
  {
    pattern: /^DELETE \/api\/v1\/projects\//, 
    name: 'Delete project',
    detail: 'Remove a project',
  },
  {
    pattern: /^POST \/api\/v1\/budgets$/, 
    name: 'Create budget',
    detail: 'Create a new budget record',
  },
  {
    pattern: /^PATCH \/api\/v1\/budgets\//,
    name: 'Update budget',
    detail: 'Modify an existing budget',
  },
];

export function getActivityDescription(
  method: string,
  url: string,
): { name?: string; detail?: string } {
  const key = `${method} ${url}`;
  const entry = ACTIVITY_DESCRIPTIONS.find(d => d.pattern.test(key));
  return entry ? { name: entry.name, detail: entry.detail } : {};
}
