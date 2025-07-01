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
  if (entry) {
    return { name: entry.name, detail: entry.detail };
  }

  const base = url.split('?')[0];
  const match = base.match(/^\/api\/v1\/([^/]+)/);
  if (!match) return {};

  const resource = match[1].replace(/s$/, '');
  let action = '';

  switch (method) {
    case 'POST':
      action = 'Create';
      break;
    case 'PATCH':
    case 'PUT':
      action = 'Update';
      break;
    case 'DELETE':
      action = 'Delete';
      break;
    default:
      return {};
  }

  const name = `${action} ${resource}`;
  return { name, detail: name };
}
