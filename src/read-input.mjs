import {open} from 'node:fs/promises';
import {constants} from 'node:fs';
export const MAX_INPUT_BYTES=65536;
/** A capped descriptor read; short reads are handled without exceeding limit+1. */
export async function readBoundedHandle(handle) {
 const stat=await handle.stat();
 if(!stat.isFile()) throw Error('UNSUPPORTED_INPUT');
 const buffer=Buffer.alloc(MAX_INPUT_BYTES+1);
 let used=0;
 while(used<buffer.length) {
  const remaining=buffer.length-used;
  const {bytesRead}=await handle.read(buffer,used,remaining,null);
  if(!Number.isInteger(bytesRead)||bytesRead<0||bytesRead>remaining) throw Error('READ_FAILED');
  if(bytesRead===0)break;
  used+=bytesRead;
 }
 if(used>MAX_INPUT_BYTES)throw Error('INPUT_LIMIT');
 return buffer.subarray(0,used);
}
export async function readInputFile(filePath) {
 // Nonblocking open prevents a special-file open from waiting before the regular-file check.
 const handle=await open(filePath,constants.O_RDONLY | (constants.O_NONBLOCK??0));
 try{return await readBoundedHandle(handle);}finally{await handle.close();}
}
