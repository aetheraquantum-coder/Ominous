// Fixed UI logic. It receives the public snapshot only, never the host record.
export const BROWSER_SCRIPT = String.raw`(() => {
  'use strict';
  const allowed = ['idle','loading','ready','blocked','error','cancelled'];
  const $ = id => document.getElementById(id);
  let view;
  try { view = JSON.parse($('public-data').textContent); }
  catch { view = {title:'',summary:'',caption:'',status:'error'}; }
  const stateSelect = $('preview-state');
  const motionButton = $('motion-toggle');
  let userReduced = document.body.dataset.reducedMotion === 'true';
  let preference;
  try { preference = window.matchMedia('(prefers-reduced-motion: reduce)'); }
  catch { preference = {matches:true}; }
  function paint() {
    $('display-title').textContent = view.title || 'Ominous';
    $('display-summary').textContent = view.summary;
    $('display-caption').textContent = view.caption;
    $('display-status').textContent = 'Demo: ' + view.status;
    document.body.dataset.state = view.status;
    stateSelect.value = view.status;
  }
  function transition(next) {
    if (!allowed.includes(next)) next = 'error';
    view = {title:view.title,summary:next === 'ready' ? view.summary : '',
      caption:next === 'ready' ? view.caption : '',status:next};
    paint();
  }
  function setMotion() {
    const reduced = userReduced || preference.matches;
    document.body.dataset.reducedMotion = String(reduced);
    motionButton.setAttribute('aria-pressed',String(reduced));
    motionButton.textContent = preference.matches ? 'Reduced by device' : (reduced ? 'Enable motion' : 'Reduce motion');
  }
  stateSelect.addEventListener('change',event => transition(event.target.value));
  motionButton.addEventListener('click',() => { userReduced = !userReduced; setMotion(); });
  if (typeof preference.addEventListener === 'function') preference.addEventListener('change',setMotion);
  // No success text is restored by selecting ready after a non-ready state.
  if (!allowed.includes(view.status)) transition('error'); else paint();
  setMotion();
})();`;
