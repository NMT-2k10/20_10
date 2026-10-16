import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, sep, extname } from 'node:path';
import { root } from './src/paths.mjs';
import { renderPage } from './src/page.mjs';
import { editable } from './src/editable.mjs';

const port = Number(process.env.PORT || 5178);
const assetsRoot = resolve(root,'public');
const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf','.otf':'font/otf','.m4a':'audio/mp4','.mp3':'audio/mpeg'};
const server = http.createServer((req,res) => {
  try {
    const url = new URL(req.url,'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (pathname === '/' || pathname === '/index.html') {
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
      res.end(renderPage()); return;
    }
    if (pathname === '/health') {res.writeHead(200,{'Content-Type':'text/plain'});res.end('ok');return;}
    if (pathname === '/favicon.ico') {res.writeHead(204);res.end();return;}
    const source = Object.hasOwn(editable,pathname) ? editable[pathname] : null;
    let path = source ? resolve(root,source) : pathname === '/custom.css' ? resolve(root,'custom.css') : resolve(assetsRoot,'.'+pathname);
    if (!source && pathname !== '/custom.css' && !path.startsWith(assetsRoot + sep)) {res.writeHead(403);res.end();return;}
    if (existsSync(path) && statSync(path).isFile()) {
      const content = readFileSync(path);
      res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Content-Length':content.length,'Cache-Control':'no-store'});
      res.end(content);return;
    }
    console.error('Missing local file:',pathname);
    res.writeHead(404);res.end('File not found: '+pathname);
  } catch(error) {res.writeHead(500,{'Content-Type':'text/plain; charset=utf-8'});res.end(error.message);}
});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/?isPreview=true&autoplay=0&muted=1`));
