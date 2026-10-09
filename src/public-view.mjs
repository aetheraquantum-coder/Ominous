export const SCHEMA = 'ominous-public-view/v1';
export const STATES = Object.freeze(['idle','loading','ready','blocked','error','cancelled']);
const LIMITS = Object.freeze({title:80, summary:240, caption:160});
const FIELDS = Object.freeze(Object.keys(LIMITS));
const KEYS = Object.freeze(['schema',...FIELDS,'status']);
const CONTROLS = /[\u0000-\u001f\u007f\u2028\u2029]/u;
function plain(value) {
  return value !== null && typeof value === 'object' &&
    [Object.prototype,null].includes(Object.getPrototypeOf(value));
}
function text(value,max) {
  return typeof value === 'string' && value.length <= max * 2 &&
    [...value].length <= max && !CONTROLS.test(value);
}
function ownValue(object,key) {
  const d=Object.getOwnPropertyDescriptor(object,key);
  return d && Object.hasOwn(d,'value') ? d.value : undefined;
}
export function emptyView(status='error') {
  return Object.freeze({schema:SCHEMA,title:'',summary:'',caption:'',status:STATES.includes(status)?status:'error'});
}
/** Accept data records, not instructions. Only exact approved fields are read. */
export function projectPublic(record,approval) {
  try {
    if (!plain(record)) return emptyView();
    const status=ownValue(record,'status');
    if (!STATES.includes(status)) return emptyView();
    const selected=[];
    if (approval != null) {
      if (!Array.isArray(approval) || Object.getPrototypeOf(approval)!==Array.prototype) return emptyView();
      const length=Object.getOwnPropertyDescriptor(approval,'length')?.value;
      if (!Number.isInteger(length) || length<0 || length>FIELDS.length) return emptyView();
      const expected=['length',...Array.from({length},(_,i)=>String(i))];
      const keys=Reflect.ownKeys(approval);
      if (keys.length!==expected.length || keys.some(key=>!expected.includes(key))) return emptyView();
      for(let i=0;i<length;i++) {
        const descriptor=Object.getOwnPropertyDescriptor(approval,String(i));
        if (!descriptor || !Object.hasOwn(descriptor,'value')) return emptyView();
        const field=descriptor.value;
        if (!FIELDS.includes(field) || selected.includes(field)) return emptyView();
        selected.push(field);
      }
    }
    const view={...emptyView(status)};
    for (const field of selected) {
      const value=ownValue(record,field);
      if (!text(value,LIMITS[field])) return emptyView();
      view[field]=value;
    }
    if (status !== 'ready') view.summary=view.caption='';
    return Object.freeze(view);
  } catch { return emptyView(); }
}
/** Strict public-schema validation, producing an independent primitive-only snapshot. */
export function readPublicView(value) {
  try {
    if (!plain(value)) return null;
    const keys=Reflect.ownKeys(value);
    if (keys.length !== KEYS.length || keys.some(k=>!KEYS.includes(k))) return null;
    const view={};
    for(const key of KEYS) {
      const descriptor=Object.getOwnPropertyDescriptor(value,key);
      if (!descriptor || !Object.hasOwn(descriptor,'value')) return null;
      view[key]=descriptor.value;
    }
    if (view.schema !== SCHEMA || !STATES.includes(view.status)) return null;
    for(const field of FIELDS) if (!text(view[field],LIMITS[field])) return null;
    if(view.status !== 'ready' && (view.summary !== '' || view.caption !== '')) return null;
    return Object.freeze(view);
  } catch { return null; }
}
export function isPublicView(value) { return readPublicView(value) !== null; }
