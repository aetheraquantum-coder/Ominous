import {emptyView,readPublicView} from './public-view.mjs';
import {renderPresentation,escapeText} from './render.mjs';
export function exportPublic(value,options={}) {
 const view=readPublicView(value)||emptyView();
 return Object.freeze({html:renderPresentation(view,options),json:JSON.stringify(view,null,2)+'\n',
  srt:view.status==='ready' && view.caption ? '1\n00:00:00,000 --> 00:00:15,000\n'+escapeText(view.caption)+'\n' : ''});
}
