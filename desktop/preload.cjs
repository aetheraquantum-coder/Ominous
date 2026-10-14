const {contextBridge,ipcRenderer}=require('electron');
const invoke=(name,...args)=>ipcRenderer.invoke('ominous:'+name,...args).then(r=>{if(!r.ok)throw new Error(r.error);return r.value;});
contextBridge.exposeInMainWorld('ominous',Object.freeze({
 initial:()=>invoke('initial'),preview:p=>invoke('preview',p),update:p=>invoke('update',p),
 open:()=>invoke('open'),saveCopy:p=>invoke('saveCopy',p),export:p=>invoke('export',p),
 present:p=>invoke('present',p),reveal:()=>invoke('reveal'),updates:()=>invoke('updates'),close:p=>invoke('close',p),
 onFlush:callback=>ipcRenderer.on('ominous:flush',()=>callback()),
 onAction:callback=>ipcRenderer.on('ominous:action',(_event,name)=>callback(name))
}));
