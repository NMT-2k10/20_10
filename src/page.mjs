import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root } from './paths.mjs';
import { css,chunks } from './reference.mjs';
export function renderPage() {
  const gift=JSON.parse(readFileSync(resolve(root,'gift.json'),'utf8'));
  const config=JSON.stringify(gift).replace(/</g,'\\u003c');
  const scripts=[...chunks.filter(n=>!n.startsWith('turbopack-')),'19wg2q9r2_sev.js'];
  return `<!doctype html><html lang="vi" class="h-full antialiased SGRosq_variable XvZF9a_variable _8_aF4G_variable"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#2c1520">
<title>Quà 20/10 · Gửi người phụ nữ đặc biệt 💐</title><meta name="author" content="lovegift.online">
<link rel="stylesheet" href="${css}"><link rel="stylesheet" href="/custom.css">
<style>html,body,#app{margin:0;min-height:100%;background:#2c1520}</style></head><body class="min-h-full"><div id="app"></div>
<script>window.GIFT_CONFIG=${config};</script>
<script src="/gift-audio.js"></script>
${scripts.map(f=>`<script src="/_next/static/chunks/${f}"></script>`).join('')}
<script src="/bootstrap.js"></script>
<script>(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push({otherChunks:[],runtimeModuleIds:[900001]});</script>
<script src="/_next/static/chunks/turbopack-3-ry682tkyiqk.js"></script>
</body></html>`;
}
