const $=id=>document.getElementById(id);
const api=window.ominous;
let project,dirty=false,timer,revision=0,busy=false,booted=false,closing=false;
const limits={title:80,summary:240,caption:160};
function showError(e){$('error').textContent=e.message||String(e);$('error').hidden=false;}
function clearError(){$('error').hidden=true;}
function readForm(){return {...project,title:$('title').value,summary:$('summary').value,caption:$('caption').value,status:$('status').value,approval:Object.keys(limits).filter(k=>$('include-'+k).checked),notes:$('notes').value,reducedMotion:$('motion').checked};}
function fill(p){project=p;for(const k of Object.keys(limits)){$(k).value=p[k];$('include-'+k).checked=p.approval.includes(k);}$('status').value=p.status;$('notes').value=p.notes;$('motion').checked=p.reducedMotion;updateHints();}
function updateHints(){for(const [k,max] of Object.entries(limits)){$(k+'-count').textContent=[...$(k).value].length+' / '+max;$(k).setAttribute('aria-invalid',String([...$(k).value].length>max));}$('state-hint').hidden=$('status').value==='ready';}
async function refresh(){const token=++revision;try{const html=await api.preview(readForm());if(token===revision)$('preview').src=html;}catch(e){showError(e);}}
async function persist(){clearTimeout(timer);if(!dirty)return;const p=readForm();const token=revision;await api.update(p);if(token===revision){dirty=false;project=p;$('save-status').textContent='✓ Saved on this PC';}}
function changed(){if(!booted)return;dirty=true;clearError();updateHints();$('save-status').textContent='Saving…';refresh();clearTimeout(timer);timer=setTimeout(()=>persist().catch(e=>{$('save-status').textContent='Not saved — check the message below';showError(e);}),350);}
async function action(name){if(busy||closing||!booted)return;busy=true;clearError();try{
 if(name==='help'){$('guide').showModal();return;}
 if(name==='new'){$('new-dialog').showModal();return;}
 if(name==='save'){const result=await api.saveCopy(readForm());if(result){$('notice').textContent='Project copy saved. This includes your private notes.';$('notice').hidden=false;}}
 if(name==='save')return;
 if(name==='open')await persist();
 if(name==='open'){const p=await api.open();if(p){fill(p);dirty=false;await refresh();$('save-status').textContent='✓ Project opened and saved';}}
 if(name==='export'){const result=await api.export(readForm());if(result){$('export-result').hidden=false;$('export-path').textContent=result;}}
 if(name==='present')await api.present(readForm());
 if(name==='reveal')await api.reveal();
 if(name==='updates')await api.updates();
 }catch(e){showError(e);}finally{busy=false;}}
for(const id of ['title','summary','caption','notes'])$(id).addEventListener('input',changed);
for(const id of ['include-title','include-summary','include-caption','status','motion'])$(id).addEventListener('change',changed);
for(const id of ['new','open','save','export','present','reveal','help','updates'])$(id).addEventListener('click',()=>action(id));
$('close-guide').onclick=()=>$('guide').close();$('cancel-new').onclick=()=>$('new-dialog').close();
$('save-new').onclick=async()=>{try{const result=await api.saveCopy(readForm());if(result){$('new-dialog').close();$('notice').textContent='Copy saved. You can now start a new project.';$('notice').hidden=false;}}catch(e){$('new-dialog').close();showError(e);}};
$('confirm-new').onclick=async()=>{try{clearTimeout(timer);const p={...project,title:'',summary:'',caption:'',notes:'',status:'ready',approval:['title','summary','caption'],reducedMotion:project.reducedMotion};await api.update(p);fill(p);dirty=false;$('new-dialog').close();$('notice').hidden=true;$('export-result').hidden=true;await refresh();$('title').focus();}catch(e){$('new-dialog').close();showError(e);}};
api.onAction(action);
api.onFlush(async()=>{if(!booted||closing)return;closing=true;clearTimeout(timer);const controls=[...document.querySelectorAll('input,textarea,select,button')];for(const control of controls)control.disabled=true;$('save-status').textContent='Saving before closing…';try{await api.close(readForm());}catch(e){closing=false;for(const control of controls)control.disabled=false;showError(e);$('save-status').textContent='Not saved — use Save a copy to keep your work.';}});
setInterval(()=>{if(dirty&&!closing)persist().catch(showError);},30000);
(async()=>{try{const initial=await api.initial();fill(initial.project);$('version').textContent='Ominous '+initial.version+' · Desktop';booted=true;await refresh();$('save-status').textContent='✓ Ready · Draft saves automatically';if(initial.recovered){$('notice').textContent='Your previous draft could not be read. A recovery copy was preserved at '+initial.recoveryFile;$('notice').hidden=false;}if(initial.warning)showError(Error(initial.warning));}catch(e){showError(e);$('save-status').textContent='Workspace could not open';}})();

new ResizeObserver(entries=>{const width=entries[0].contentRect.width;$('preview').style.transform='scale('+(width/1100)+')';}).observe(document.querySelector('.preview-wrap'));
