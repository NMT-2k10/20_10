import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { root } from '../src/paths.mjs';
const port=Number(process.env.PORT || 5178);
const url=`http://127.0.0.1:${port}/?isPreview=true&autoplay=0&muted=1`;

function openBrowser(){
  if(process.platform==='win32'){
    const browser=spawn('rundll32.exe',['url.dll,FileProtocolHandler',url],{windowsHide:true,stdio:'ignore'});
    browser.on('error',()=>console.log('Mo trinh duyet tai: '+url));
    browser.unref();
  }else console.log('Open '+url);
}

async function gardenIsRunning(){
  try {
    const response=await fetch(url,{signal:AbortSignal.timeout(1500)});
    if(!response.ok) return false;
    const html=await response.text();
    return html.includes('window.GIFT_CONFIG=') && html.includes('src="/bootstrap.js"');
  }catch{return false;}
}

// Reopening the launcher should reuse the garden already running on this port.
if(await gardenIsRunning()){
  console.log('Web dang chay. Mo lai trang: '+url);
  openBrowser();
}else{
  // Open the browser only after the local server announces that it is ready.
  const child=spawn(process.execPath,[resolve(root,'server.mjs')],{cwd:root,stdio:['inherit','pipe','pipe']});
  let opened=false;
  let errors='';
  child.stdout.on('data',data=>{
    process.stdout.write(data);
    if(!opened&&data.toString().includes('Local:')){
      opened=true;
      openBrowser();
    }
  });
  child.stderr.on('data',data=>{errors+=data.toString();});
  child.on('error',error=>{console.error(error.message);process.exitCode=1;});
  process.on('SIGINT',()=>child.kill());
  child.on('exit',async code=>{
    // Two launcher windows may start at the same time.
    if(code && errors.includes('EADDRINUSE') && await gardenIsRunning()){
      console.log('Web da duoc mo trong cua so khac: '+url);
      if(!opened) openBrowser();
      return;
    }
    if(errors) process.stderr.write(errors);
    process.exitCode=code||0;
  });
}
