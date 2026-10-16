import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

// Keep local development at /; prefix static assets only for project Pages builds.
export function prefixPagesPaths(directory, base) {
  if (!base || base === '/') return;
  if (!/^\/[\w-]+\/$/.test(base)) throw new Error('Base must look like /20_10/');
  function visit(folder) {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (['.html', '.js', '.css', '.svg', '.json'].includes(extname(path))) {
        const original = readFileSync(path, 'utf8');
        const prefixed = original.replace(/(?<![\w/])\/(?:_next|gift|growing-garden|galaxy|music|image)\//g, match => base + match.slice(1))
          .replace(/(["'])\/(custom\.css|bootstrap\.js|gift-audio\.js)\1/g, (_, quote, file) => quote + base + file + quote)
          .replace("window.location.assign('/')", `window.location.assign('${base}')`);
        if (prefixed !== original) writeFileSync(path, prefixed);
      }
    }
  }
  visit(directory);
}
