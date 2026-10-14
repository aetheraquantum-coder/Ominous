import {app,BrowserWindow,Menu,dialog,ipcMain,protocol,net,shell,session} from 'electron';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createProject,validateProject,readProject,writeProject,openWorkspace,exportPresentation,publicPreview} from './project.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const ORIGIN='ominous://app';
protocol.registerSchemesAsPrivileged([{scheme:'ominous',privileges:{standard:true,secure:true,supportFetchAPI:true}}]);
app.setName('Ominous');
const dataOverride=process.argv.find(v=>v.startsWith('--ominous-data='));
if(dataOverride)app.setPath('userData',path.resolve(dataOverride.slice(15)));
let window,current=createProject(),queue=Promise.resolve(),closing=false,lastExport=null,previewHTML='';
const dataDir=()=>app.getPath('userData');
function enqueue(fn){const next=queue.then(fn);queue=next.catch(()=>{});return next;}
function requireEditor(event){if(event.sender!==window?.webContents||event.senderFrame!==window.webContents.mainFrame||event.senderFrame.url!==`${ORIGIN}/index.html`)throw Error('This action is available only from the Ominous editor.');}
function handle(name,fn){ipcMain.handle('ominous:'+name,async(event,...args)=>{try{requireEditor(event);return {ok:true,value:await fn(...args)};}catch(e){return {ok:false,error:message(e)};}});}
function message(e){if(e.code==='EACCES'||e.code==='EPERM')return 'Windows could not write here. Choose a folder you own, such as Documents, and try again.';if(e.code==='ENOSPC')return 'Your drive is full. Free some space, then save again.';if(e.code==='ENOENT')return 'That file or folder is no longer available. Choose it again.';return e.message||'The action could not be completed. Your current draft is still open.';}
function protect(win){win.webContents.setWindowOpenHandler(()=>({action:'deny'}));win.webContents.on('will-navigate',e=>e.preventDefault());win.webContents.on('will-attach-webview',e=>e.preventDefault());}
function createWindow(){
 window=new BrowserWindow({title:'Ominous',width:1400,height:900,minWidth:1000,minHeight:720,backgroundColor:'#0b0e15',show:false,icon:path.join(here,'ui/icon.png'),webPreferences:{preload:path.join(here,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,webviewTag:false}});
 protect(window);window.once('ready-to-show',()=>window.show());window.loadURL(`${ORIGIN}/index.html`);
 window.on('close',event=>{if(closing)return;event.preventDefault();window.webContents.send('ominous:flush');});
 window.on('closed',()=>{window=null;for(const other of BrowserWindow.getAllWindows())other.close();app.quit();});
}
if(!app.requestSingleInstanceLock()){app.quit();}else{
 app.on('second-instance',()=>{if(window){if(window.isMinimized())window.restore();window.show();window.focus();}});
 app.whenReady().then(async()=>{
  protocol.handle('ominous',request=>{const url=new URL(request.url);if(url.host==='preview'&&url.pathname==='/current')return new Response(previewHTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});const allowed=new Set(['/index.html','/app.js','/style.css','/icon.png']);if(url.host!=='app'||!allowed.has(url.pathname))return new Response('Not found',{status:404});return net.fetch(pathToFileURL(path.join(here,'ui',url.pathname.slice(1))).href);});
  session.defaultSession.setPermissionRequestHandler((wc,permission,callback)=>callback(false));
  session.defaultSession.setPermissionCheckHandler(()=>false);
  session.defaultSession.webRequest.onBeforeRequest({urls:['http://*/*','https://*/*','ws://*/*','wss://*/*']},(details,callback)=>callback({cancel:true}));
  const workspace=await openWorkspace(dataDir());const initial=workspace.initial;current=initial.project;
  handle('initial',()=>({...initial,version:app.getVersion(),project:current}));
  handle('preview',p=>{previewHTML=publicPreview(p);return 'ominous://preview/current?revision='+Date.now();});
  handle('update',p=>{const valid=validateProject(p);return enqueue(async()=>{await workspace.save(valid);current=valid;return true;});});
  handle('open',async()=>{const result=await dialog.showOpenDialog(window,{title:'Open an Ominous project',properties:['openFile'],filters:[{name:'Ominous project',extensions:['json']}]});if(result.canceled)return null;const p=await readProject(result.filePaths[0]);await enqueue(async()=>{await workspace.save(p);current=p;});return p;});
  handle('saveCopy',async p=>{const valid=validateProject(p);const result=await dialog.showSaveDialog(window,{title:'Save project copy',defaultPath:path.join(app.getPath('documents'),'My-Ominous-Project.ominous.json'),filters:[{name:'Ominous project',extensions:['ominous.json']}]});if(result.canceled)return null;await writeProject(result.filePath,valid);return result.filePath;});
  handle('export',async p=>{const valid=validateProject(p);const result=await dialog.showOpenDialog(window,{title:'Choose where to export your presentation',defaultPath:app.getPath('documents'),properties:['openDirectory','createDirectory']});if(result.canceled)return null;lastExport=await exportPresentation(result.filePaths[0],valid);return lastExport;});
  handle('reveal',async()=>{if(lastExport){const error=await shell.openPath(lastExport);if(error)throw Error(error);}return true;});
  handle('updates',()=>shell.openExternal('https://github.com/aetheraquantum-coder/Ominous/releases'));
  handle('present',p=>{const html=publicPreview(p);const display=new BrowserWindow({title:'Ominous · Presentation',width:1280,height:800,backgroundColor:'#080f1a',autoHideMenuBar:true,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true,webviewTag:false}});protect(display);display.loadURL('data:text/html;charset=utf-8,'+encodeURIComponent(html));return true;});
  handle('close',p=>enqueue(async()=>{
   try{const valid=validateProject(p);await workspace.save(valid);current=valid;}
   catch(e){
    const choice=await dialog.showMessageBox(window,{type:'warning',title:'Keep your work',message:'Your draft could not be saved.',detail:message(e),buttons:['Keep editing','Save a copy and close','Close without saving'],defaultId:0,cancelId:0,noLink:true});
    if(choice.response===0)throw e;
    if(choice.response===1){const result=await dialog.showSaveDialog(window,{title:'Save your project before closing',defaultPath:path.join(app.getPath('documents'),'Recovered-Ominous-Project.ominous.json')});if(result.canceled)throw e;await writeProject(result.filePath,p);}
   }
   closing=true;window.close();
  }));
  const action=name=>()=>window?.webContents.send('ominous:action',name);
  Menu.setApplicationMenu(Menu.buildFromTemplate([
   {label:'File',submenu:[{label:'New project',accelerator:'CmdOrCtrl+N',click:action('new')},{label:'Open project…',accelerator:'CmdOrCtrl+O',click:action('open')},{label:'Save a copy…',accelerator:'CmdOrCtrl+Shift+S',click:action('save')},{type:'separator'},{label:'Export presentation…',accelerator:'CmdOrCtrl+E',click:action('export')},{type:'separator'},{role:'quit'}]},
   {label:'Edit',submenu:[{role:'undo'},{role:'redo'},{type:'separator'},{role:'cut'},{role:'copy'},{role:'paste'},{role:'selectAll'}]},
   {label:'View',submenu:[{label:'Open presentation window',accelerator:'CmdOrCtrl+Enter',click:action('present')},{role:'resetZoom'},{role:'zoomIn'},{role:'zoomOut'},{role:'togglefullscreen'}]},
   {label:'Help',submenu:[{label:'Getting started',click:action('help')},{label:'Ominous releases',click:()=>shell.openExternal('https://github.com/aetheraquantum-coder/Ominous/releases')},{label:'About Ominous',click:()=>dialog.showMessageBox(window,{type:'info',title:'Ominous',message:`Ominous ${app.getVersion()}`,detail:'Onyx Cores Foundation · Core 24\nCasper coordinates. Ominous presents.\n\nAn offline presentation studio based on the Ominous repository. No AI model or other cores are bundled.'})}]}
  ]));
  createWindow();
 }).catch(e=>{dialog.showErrorBox('Ominous could not start',message(e));app.quit();});
 app.on('window-all-closed',()=>app.quit());
}
