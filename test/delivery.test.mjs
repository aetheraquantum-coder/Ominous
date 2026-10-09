import test from 'node:test';import assert from 'node:assert/strict';import {readFile,mkdtemp,readdir,writeFile,symlink} from 'node:fs/promises';import {tmpdir} from 'node:os';import path from 'node:path';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';
import disclosure from './support/disclosure.cjs';import {projectPublic} from '../src/public-view.mjs';import {exportPublic} from '../src/export.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');const cwd=new URL('..',import.meta.url);const run=(f,out)=>spawnSync(process.execPath,['bin/demo.mjs','--fixture',f,'--out',out],{cwd,encoding:'utf8'});
test('disclosure checker detects the deliberate synthetic marker',()=>assert.throws(()=>disclosure.assertNoPrivate('<p>OMINOUS_PRIVATE_INJECTION_24</p>'),/Private fixture marker/));
test('projection prevents malicious non-public fixture content in every export',async()=>{
 const f=JSON.parse(await readFile(new URL('../fixtures/leakage.json',import.meta.url),'utf8'));const exports=exportPublic(projectPublic(f.record,f.approval));
 for(let text of Object.values(exports)){if(process.env.OMINOUS_INJECT_TEST_LEAK==='1')text+='OMINOUS_PRIVATE_TEST_INJECTION_24';disclosure.assertNoPrivate(text);}
});
for(const name of ['approved','denied','malformed','leakage'])test(`${name} delivery is public-only and source-preserving`,async()=>{
 const fixture=new URL(`../fixtures/${name}.json`,import.meta.url);const before=await readFile(fixture);const dir=await mkdtemp(path.join(tmpdir(),'ominous-delivery-')),out=path.join(dir,'output');const r=run(`fixtures/${name}.json`,out);assert.equal(r.status,0,r.stderr);
 const files=await readdir(path.join(out,'public'));assert.deepEqual(files.sort(),['captions.srt','index.html','view.json']);
 for(const name of files)disclosure.assertNoPrivate(await readFile(path.join(out,'public',name),'utf8'));
 const receipt=JSON.parse(await readFile(path.join(out,'owner-review/receipt.json'),'utf8'));assert.equal(receipt.sourceSha256,sha(before));assert.equal(receipt.publicSha256.html,sha(await readFile(path.join(out,'public/index.html'))));assert.equal(receipt.publicSha256.json,sha(await readFile(path.join(out,'public/view.json'))));assert.equal(receipt.publicSha256.srt,sha(await readFile(path.join(out,'public/captions.srt'))));
 assert.deepEqual(await readFile(fixture),before);assert.equal(receipt.browserVerification,'not-run');
});
test('oversized and invalid UTF-8 fixtures reject without exposing contents',async()=>{const dir=await mkdtemp(path.join(tmpdir(),'ominous-input-'));for(const [name,bytes] of [['large',Buffer.alloc(65537,'x')],['utf8',Buffer.from([0xff,0xfe])]]){const f=path.join(dir,name+'.json');await writeFile(f,bytes);const r=run(f,path.join(dir,name));assert.equal(r.status,2);assert(!r.stderr.includes(dir));assert(!(await readdir(dir)).includes(name));}});
test('CLI will not follow an existing output symlink',async()=>{const dir=await mkdtemp(path.join(tmpdir(),'ominous-output-'));const target=path.join(dir,'target');const {mkdir}=await import('node:fs/promises');await mkdir(target);const link=path.join(dir,'link');await symlink(target,link);assert.equal(run('fixtures/approved.json',link).status,2);assert.deepEqual(await readdir(target),[]);});
