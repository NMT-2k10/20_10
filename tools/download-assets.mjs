import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, sep } from 'node:path';
import { root } from '../src/paths.mjs';
import { origin, knownAssets } from '../src/reference.mjs';

const publicRoot = resolve(root,'public');
const observedPath = resolve(root,'tools/observed-assets.json');
const observed = existsSync(observedPath) ? JSON.parse(readFileSync(observedPath,'utf8')) : [];
const manifestPath=resolve(root,'tools/asset-manifest.json');
const manifest=existsSync(manifestPath)?JSON.parse(readFileSync(manifestPath,'utf8')):[];
const pending = [...new Set([...knownAssets,...observed,...manifest])];
const seen = new Set(pending);
const failed = [];
let count = 0;
for (let i=0;i<pending.length;i++) {
  const relative = pending[i];
  const target = resolve(publicRoot,'.'+relative);
  if (!target.startsWith(publicRoot+sep)) throw Error('Unsafe asset path');
  if (existsSync(target)) continue; // Never overwrite the user's photos or edits.
  try {
    const response = await fetch(origin+relative,{signal:AbortSignal.timeout(20000)});
    if (!response.ok) throw Error('HTTP '+response.status);
    const data = Buffer.from(await response.arrayBuffer());
    if (/text\/html/.test(response.headers.get('content-type')||'')) throw Error('Unexpected HTML response');
    mkdirSync(dirname(target),{recursive:true});writeFileSync(target,data);count++;
    console.log('OK',relative);
    if (/\.(js|css)$/.test(relative)) {
      const text = data.toString('utf8');
      for (const match of text.matchAll(/(?:\/)?(?:_next\/)?static\/(?:chunks|media)\/[a-zA-Z0-9_.-]+\.(?:js|css|woff2?|ttf|otf)/g)) {
        const path='/_next/'+match[0].replace(/^\/?(?:_next\/)?/,'');
        if (!seen.has(path)) {seen.add(path);pending.push(path);}
      }
    }
  } catch(error) {failed.push({path:relative,error:error.message});console.error('FAIL',relative,error.message);}
}
writeFileSync(resolve(root,'tools/download-report.json'),JSON.stringify({downloaded:count,failed},null,2));
console.log(`Downloaded: ${count}; failed: ${failed.length}. See tools/download-report.json.`);
if (failed.length) process.exitCode=1;
