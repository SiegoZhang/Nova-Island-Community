// Shared visual treatment; existing destinations and click behavior stay intact.
(() => {
 const arrow='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M19 12H5m7-7-7 7 7 7"/></svg>';
 function normalizeBackButtons(){
  document.querySelectorAll('a,button').forEach(button=>{
   if(button.classList.contains('back-button'))return;
   const label=button.textContent.trim();
   const isBack=button.matches('.page-back,[data-detail-back]')||(label.length<=16&&/^(?:←\s*)?返回|^继续浏览$/.test(label));
   if(!isBack)return;
   button.classList.add('back-button');
   const accessibleLabel=button.getAttribute('aria-label')||label.replace(/^←\s*/,'')||'返回';
   button.setAttribute('aria-label',accessibleLabel);
   button.title=accessibleLabel;
   button.innerHTML=arrow;
  });
 }
 normalizeBackButtons();
 new MutationObserver(normalizeBackButtons).observe(document.body,{childList:true,subtree:true});
})();
