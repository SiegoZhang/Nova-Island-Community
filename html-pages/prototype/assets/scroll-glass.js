// Mirrored glass edges hint at content above and below the viewport.
(() => {
 const main=document.querySelector('.ds-main');
 if(!main||document.querySelector('.workspace-scroll-glass'))return;
 const edges=['top','bottom'].map(side=>{
  const edge=document.createElement('div');
  edge.className='workspace-scroll-glass workspace-scroll-glass--'+side;
  edge.setAttribute('aria-hidden','true');
  // Keep both edges inside the theme scope so shell radius tokens resolve.
  main.closest('.nova-ds').append(edge);
  return edge;
 });
 let frame=0;
 function update(){
  frame=0;
  const rect=main.getBoundingClientRect();
  const remaining=main.scrollHeight-main.clientHeight-main.scrollTop;
  const height=Math.min(36,rect.height/2);
  edges.forEach((edge,index)=>{
   const distance=index===0?main.scrollTop:remaining;
   edge.style.left=rect.left+'px';
   edge.style.width=rect.width+'px';
   edge.style.top=(index===0?rect.top:rect.bottom-height)+'px';
   edge.style.height=height+'px';
   edge.style.setProperty('--glass-opacity',String(Math.max(0,Math.min(1,(distance-2)/48))));
  });
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 main.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 // Routes, images and expanded sections can change height without scrolling.
 main.addEventListener('load',schedule,true);
 new MutationObserver(schedule).observe(main,{childList:true,subtree:true,attributes:true,characterData:true});
 const resize=new ResizeObserver(schedule);
 resize.observe(main);
 resize.observe(document.querySelector('.ds-workspace'));
 document.fonts.ready.then(schedule);
 document.addEventListener('animationend',schedule);
 schedule();
})();
