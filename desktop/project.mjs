import {mkdir,writeFile,readFile,rename,mkdtemp,rm} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {projectPublic,STATES} from '../src/public-view.mjs';
import {exportPublic} from '../src/export.mjs';
import {readInputFile} from '../src/read-input.mjs';
const SCHEMA='ominous-desktop-project/v1';
const limits={title:80,summary:240,caption:160};
export function createProject(){return {schema:SCHEMA,title:'Your next idea starts here.',summary:'A quiet place to shape your message, preview it and share only what you choose.',caption:'Created with Ominous · Onyx Cores Foundation',status:'ready',approval:['title','summary','caption'],notes:'',reducedMotion:false};}
export function validateProject(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.schema!==SCHEMA)throw Error('Choose an Ominous project file (.ominous.json).');
 const p={schema:SCHEMA};
 for(const [key,max] of Object.entries(limits)){
  const s=value[key];if(typeof s!=='string'||[...s].length>max||/[\u0000-\u001f\u007f\u2028\u2029]/u.test(s))throw Error(`${key[0].toUpperCase()+key.slice(1)} must be one line, up to ${max} characters.`);p[key]=s;
 }
 if(!STATES.includes(value.status))throw Error('Choose one of the available display states.');p.status=value.status;
 if(!Array.isArray(value.approval)||value.approval.length>3||new Set(value.approval).size!==value.approval.length||value.approval.some(v=>!Object.hasOwn(limits,v)))throw Error('Invalid included fields.');p.approval=[...value.approval];
 if(typeof value.notes!=='string'||[...value.notes].length>12000)throw Error('Private notes must be under 12,001 characters.');p.notes=value.notes;
 if(typeof value.reducedMotion!=='boolean')throw Error('Invalid motion setting.');p.reducedMotion=value.reducedMotion;
 return p;
}
export async function readProject(file){return validateProject(JSON.parse((await readInputFile(file)).toString('utf8')));}
export async function writeProject(file,value){
 const data=JSON.stringify(validateProject(value),null,2)+'\n';
 // Notes can contain escaped control characters. Enforce the same byte ceiling used on reads.
 if(Buffer.byteLength(data)>65536)throw Error('Project is too large. Shorten the private notes and try again.');
 const temp=file+'.'+randomUUID()+'.tmp';
 try{await writeFile(temp,data,{encoding:'utf8',mode:0o600,flag:'wx'});await rename(temp,file);}catch(e){await rm(temp,{force:true}).catch(()=>{});throw e;}
}
export async function saveDraft(dir,value){await mkdir(dir,{recursive:true});await writeProject(path.join(dir,'draft.json'),value);}
export async function loadDraft(dir){
 const file=path.join(dir,'draft.json');
 try{return {project:await readProject(file),recovered:false};}
 catch(e){
  if(e.code==='ENOENT')return {project:createProject(),recovered:false};
  if(e.code && !['INPUT_LIMIT','UNSUPPORTED_INPUT'].includes(e.code))throw e;
  await mkdir(dir,{recursive:true});const recoveryFile=path.join(dir,`draft-recovery-${Date.now()}-${randomUUID().slice(0,8)}.json`);
  await rename(file,recoveryFile);
  return {project:createProject(),recovered:true,recoveryFile};
 }
}
export function publicPreview(value){const p=validateProject(value);return exportPublic(projectPublic(p,p.approval),{reducedMotion:p.reducedMotion}).html;}
export async function exportPresentation(parent,value){
 const p=validateProject(value);const data=exportPublic(projectPublic(p,p.approval),{reducedMotion:p.reducedMotion});
 const dir=await mkdtemp(path.join(parent,'Ominous-Presentation-'));
 try{await Promise.all([writeFile(path.join(dir,'index.html'),data.html),writeFile(path.join(dir,'view.json'),data.json),writeFile(path.join(dir,'captions.srt'),data.srt)]);return dir;}
 catch(e){await rm(dir,{recursive:true,force:true});throw e;}
}
/** A failed startup read locks the original draft against all subsequent writes. */
export async function openWorkspace(dir,{load=loadDraft}={}){
 let initial,blocked=false;
 try{initial=await load(dir);}catch{blocked=true;initial={project:createProject(),recovered:false,warning:'Your original draft could not be safely loaded. It has not been changed. Use Save a copy to keep new work, then restart Ominous after fixing the folder access.'};}
 return {initial,save:async value=>{if(blocked)throw Error('Your original draft is protected because it could not be loaded. Use Save a copy to save elsewhere.');await saveDraft(dir,value);}};
}
