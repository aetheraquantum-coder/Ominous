import {STATES, emptyView, readPublicView} from './public-view.mjs';
/** Transitions never resurrect a previously cleared result. */
export function transitionPublic(value,nextStatus) {
  const view=readPublicView(value);
  if(!view || !STATES.includes(nextStatus)) return emptyView();
  return Object.freeze({...view,status:nextStatus,
    summary:nextStatus==='ready'?view.summary:'',caption:nextStatus==='ready'?view.caption:''});
}
