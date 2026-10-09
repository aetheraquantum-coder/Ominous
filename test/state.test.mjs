import test from 'node:test';import assert from 'node:assert/strict';
let api={};try{api=await import('../src/state.mjs');}catch(e){if(e.code!=='ERR_MODULE_NOT_FOUND')throw e;}
const ready={schema:'ominous-public-view/v1',title:'Ominous',summary:'Demo ready',caption:'Safe caption',status:'ready'};
const call=(...a)=>{assert.equal(typeof api.transitionPublic,'function','transitionPublic is implemented');return api.transitionPublic(...a);};
for(const state of ['idle','loading','blocked','error','cancelled'])test(`ready to ${state} clears stale public results`,()=>{const before=JSON.stringify(ready);assert.deepEqual(call(ready,state),{...ready,status:state,summary:'',caption:''});assert.equal(JSON.stringify(ready),before);});
test('repeated transitions remain safe without resurrecting results',()=>{let v=call(ready,'error');v=call(v,'error');v=call(v,'ready');assert.deepEqual(v,{...ready,summary:'',caption:''});});
test('ready to ready retains approved results',()=>assert.deepEqual(call(ready,'ready'),ready));
for(const invalid of ['complete',null,{},undefined])test(`invalid transition ${JSON.stringify(invalid)} returns safe error`,()=>assert.deepEqual(call(ready,invalid),{schema:'ominous-public-view/v1',title:'',summary:'',caption:'',status:'error'}));
test('invalid source view returns safe error',()=>assert.deepEqual(call({...ready,logs:'OMINOUS_PRIVATE_LOG_24'},'ready'),{schema:'ominous-public-view/v1',title:'',summary:'',caption:'',status:'error'}));
