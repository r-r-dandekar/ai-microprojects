import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const env = readFileSync(resolve(root, '.env'), 'utf8');

const vars = {};
for (const line of env.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const value = trimmed.slice(eq + 1).trim();
  vars[key] = value;
}

const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
for (const key of required) {
  if (!vars[key]) {
    console.error(`Missing required .env variable: ${key}`);
    process.exit(1);
  }
}

const output = `// Auto-generated from .env — do not edit manually.
export const SUPABASE_URL = '${vars.SUPABASE_URL}';
export const SUPABASE_ANON_KEY = '${vars.SUPABASE_ANON_KEY}';
`;

writeFileSync(resolve(root, 'js', 'config.js'), output);
console.log('js/config.js generated from .env');
