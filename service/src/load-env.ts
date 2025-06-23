import * as path from 'path';
import { config } from 'dotenv';
import * as fs from 'fs';

const envName = `${process.env.NODE_ENV || 'local'}.env`;
const searchPaths = [
  path.join(__dirname, '..', '..', 'env', envName),
  path.join(__dirname, '..', 'env', envName),
];

for (const envFile of searchPaths) {
  if (fs.existsSync(envFile)) {
    config({ path: envFile });
    break;
  }
}
