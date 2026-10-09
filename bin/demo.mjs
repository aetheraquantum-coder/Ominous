import {mkdir,writeFile} from 'node:fs/promises';
import {readInputFile} from '../src/read-input.mjs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {projectPublic} from '../src/public-view.mjs';
import {exportPublic} from '../src/export.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
async function main() {
 const args=process.argv.slice(2), values={};
 if(args.length!==4) throw Error('usage');
 for(let i=0;i<4;i+=2) {
  if(!['--fixture','--out'].includes(args[i]) || values[args[i]] || !args[i+1] || args[i+1].startsWith('--')) throw Error('usage');
  values[args[i]]=args[i+1];
 }
 if(!values['--fixture'] || !values['--out']) throw Error('usage');
 const bytes=await readInputFile(resolve(values['--fixture']));
 const fixture=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
 if(!fixture || Array.isArray(fixture) || typeof fixture!=='object' || !Object.hasOwn(fixture,'record') || Object.keys(fixture).some(k=>!['record','approval'].includes(k))) throw Error('fixture');
 const view=projectPublic(fixture.record,fixture.approval), exported=exportPublic(view);
 const root=resolve(values['--out']);
 // The entire output root must be new; never overwrite or follow an existing root symlink.
 await mkdir(root,{mode:0o700});
 await mkdir(join(root,'public'),{mode:0o700});await mkdir(join(root,'owner-review'),{mode:0o700});
 for(const [name,content] of Object.entries({'index.html':exported.html,'view.json':exported.json,'captions.srt':exported.srt})) await writeFile(join(root,'public',name),content,{flag:'wx',mode:0o600});
 const receipt={schema:'ominous-demo-receipt/v1',sourceSha256:hash(bytes),publicStatus:view.status,
  publicSha256:{html:hash(exported.html),json:hash(exported.json),srt:hash(exported.srt)},
  classification:'synthetic standalone preview',browserVerification:'not-run',generatedAt:new Date().toISOString()};
 await writeFile(join(root,'owner-review','receipt.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
 process.stdout.write('Public preview written. Synthetic status: '+view.status+'\n');
}
main().catch(()=>{process.stderr.write('Preview not written completely. Check the selected JSON fixture and use a new output directory.\n');process.exitCode=2;});
