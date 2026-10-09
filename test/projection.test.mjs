import test from 'node:test';
import assert from 'node:assert/strict';
let api = {};
try { api = await import('../src/public-view.mjs'); } catch (e) { if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e; }
const record = () => ({ title:'Ominous', summary:'Presentation demo ready.', caption:'Only approved display content appears here.', status:'ready', private:{code:'OMINOUS_PRIVATE_CODE_24', logs:['OMINOUS_PRIVATE_LOG_24'], path:'OMINOUS_PRIVATE_PATH_24'} });
const call = (...args) => { assert.equal(typeof api.projectPublic, 'function', 'projectPublic is implemented'); return api.projectPublic(...args); };
const empty = status => ({schema:'ominous-public-view/v1',title:'',summary:'',caption:'',status});
test('projects exact public keys and approved values only', () => {
 const r=record(), before=JSON.stringify(r); const v=call(r,['title','summary','caption']);
 assert.deepEqual(v,{schema:'ominous-public-view/v1',title:r.title,summary:r.summary,caption:r.caption,status:'ready'});
 assert.equal(JSON.stringify(r),before); assert(!JSON.stringify(v).includes('OMINOUS_PRIVATE_'));
});
for (const field of ['title','summary','caption']) test(`only ${field} approval reveals ${field}`,()=>{ const r=record(); assert.deepEqual(call(r,[field]),{...empty('ready'),[field]:r[field]}); });
for (const approval of [undefined,null,[]]) test(`no approval ${JSON.stringify(approval)} reveals no strings`,()=>assert.deepEqual(call(record(),approval),empty('ready')));
for (const approval of [['private'],['title','private'],'title',{},['title',3]]) test(`invalid approval fails closed ${JSON.stringify(approval)}`,()=>assert.deepEqual(call(record(),approval),empty('error')));
for (const status of ['idle','loading','blocked','error','cancelled']) test(`${status} suppresses results`,()=>assert.deepEqual(call({...record(),status},['title','summary','caption']),{...empty(status),title:'Ominous'}));
for (const status of [undefined,{},'success',17,null]) test(`invalid status ${JSON.stringify(status)} fails closed`,()=>assert.deepEqual(call({...record(),status},['title']),empty('error')));
for (const [field,max] of [['title',80],['summary',240],['caption',160]]) {
 test(`${field} bounds count Unicode code points`,()=>{const r=record();r[field]='😀'.repeat(max);assert.equal(call(r,[field])[field],r[field]);r[field]+='😀';assert.deepEqual(call(r,[field]),empty('error'));});
 for(const char of ['\n','\r','\0','\u007f','\u2028','\u2029']) test(`${field} rejects control ${char.codePointAt(0)}`,()=>{const r=record();r[field]='test'+char+'end';assert.deepEqual(call(r,[field]),empty('error'));});
 test(`${field} rejects non-text`,()=>assert.deepEqual(call({...record(),[field]:42},[field]),empty('error')));
}
test('HTML-like approved input remains data at projection',()=>{ const r={...record(),title:'<script>alert(1)</script>'}; assert.equal(call(r,['title']).title,r.title); });
test('unapproved fields are not accessed or recursively copied',()=>{const r=record();Object.defineProperty(r,'summary',{get(){throw Error('OMINOUS_PRIVATE_GETTER_24');}});Object.defineProperty(r,'private',{get(){throw Error('OMINOUS_PRIVATE_GETTER_24');}});assert.deepEqual(call(r,['title']),{...empty('ready'),title:'Ominous'});});
test('approved accessor fails closed without evaluating it',()=>{const r=record();let read=false;Object.defineProperty(r,'title',{get(){read=true;return 'OMINOUS_PRIVATE_GETTER_24';}});assert.deepEqual(call(r,['title']),empty('error'));assert.equal(read,false);});
test('inherited input status is not trusted',()=>assert.deepEqual(call(Object.create(record()),['title']),empty('error')));
test('invalid records fail closed',()=>{for(const r of [null,undefined,[],42,'raw'])assert.deepEqual(call(r,['title']),empty('error'));});
test('public validation rejects extra/inherited/accessor keys and stale state content',()=>{
 assert.equal(typeof api.isPublicView,'function');const good=call(record(),['title']);assert(api.isPublicView(good));
 for(const v of [{...good,private:'x'},{...good,status:'error',summary:'stale'},Object.create(good),null,[]])assert.equal(api.isPublicView(v),false);
 const getter={...good};Object.defineProperty(getter,'title',{get(){throw Error('private');}});assert.equal(api.isPublicView(getter),false);
});
test('approval iterators cannot substitute an unapproved field',()=>{const approval=['title'];approval[Symbol.iterator]=function*(){yield 'summary';};const r={...record(),summary:'OMINOUS_PRIVATE_ITERATOR_24'};assert.deepEqual(call(r,approval),empty('error'));});
test('overridden approval methods and unexpected keys fail closed',()=>{for(const key of ['some','extra']){const approval=['title'];approval[key]=()=>false;assert.deepEqual(call(record(),approval),empty('error'));}});
test('approval accessors are rejected without reading them',()=>{const approval=['title'];let reads=0;Object.defineProperty(approval,'0',{get(){reads++;return 'title';}});assert.deepEqual(call(record(),approval),empty('error'));assert.equal(reads,0);});
test('sparse and duplicate approval arrays fail closed',()=>{for(const approval of [new Array(1),['title','title']])assert.deepEqual(call(record(),approval),empty('error'));});
