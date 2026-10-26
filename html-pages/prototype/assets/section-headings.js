// Shared distance-driven headings for all scrolling content lists.
(()=>{
 function sync(page){
  const stacked=matchMedia(page.matches('.forum-discussions')?'(max-width:760px)':'(max-width:1100px)').matches;
  const scroller=page.matches('.scroll-heading-page')?page:page.querySelector(stacked?'.forum-layout':'.forum-feed-scroll');
  const distance=Math.min(64,Math.max(0,scroller?.scrollTop||0));
  page.style.setProperty('--heading-opacity',String(1-distance/64));
  page.style.setProperty('--heading-offset',`${-distance}px`);
  page.classList.toggle('feed-scrolled',distance>=64);
  const journeyToolbar=page.querySelector('.journey-toolbar');
  const journeyStats=journeyToolbar?.querySelector('.journey-stats');
  if(journeyStats){
   journeyStats.style.setProperty('--journey-stats-progress',String(distance/64));
  }

  const toolbar=page.querySelector('.feed-filter-toolbar');
  if(toolbar){
   const style=getComputedStyle(page);
   const start=parseFloat(style.getPropertyValue('--feed-heading-space'))||136;
   const top=parseFloat(getComputedStyle(toolbar).top)||0;
   page.classList.toggle('filter-docked',(scroller?.scrollTop||0)>=start-top);
  }
 }
 document.addEventListener('scroll',event=>{
  const target=event.target;
  if(!(target instanceof Element)||!target.matches('.forum-feed-scroll,.forum-layout,#content.scroll-heading-page'))return;
  const page=target.matches('#content.scroll-heading-page')?target:target.closest('#content.section-index>.forum-page');
  if(page)sync(page);
 },{capture:true,passive:true});
 window.addEventListener('resize',()=>document.querySelectorAll('#content.section-index>.forum-page,#content.scroll-heading-page').forEach(sync));
})();

// Reveal the end-of-feed hint in proportion to the remaining scroll distance.
(()=>{
 let frame=0;
 function update(){
  frame=0;
  document.querySelectorAll('.channel-feed-end').forEach(hint=>{
   let scroller=hint.parentElement;
   while(scroller&&scroller!==document.body){
    if(/auto|scroll/.test(getComputedStyle(scroller).overflowY))break;
    scroller=scroller.parentElement;
   }
   if(!scroller||scroller===document.body)scroller=document.scrollingElement;
   const range=Math.max(0,scroller.scrollHeight-scroller.clientHeight);
   const remaining=Math.max(0,range-scroller.scrollTop);
   const progress=range<=1?1:Math.max(0,Math.min(1,1-remaining/Math.min(120,range)));
   hint.style.setProperty('--feed-end-opacity',String(progress));
  });
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update)}
 document.addEventListener('scroll',schedule,{capture:true,passive:true});
 document.addEventListener('load',schedule,true);
 window.addEventListener('resize',schedule);
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 schedule();
})();
