/* Vanilla adaptation of the supplied spring / pinching-neck interaction. */
(() => {
 const root=document.querySelector('.home-main');
 if(!root)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let previous=null,frame=0,serial=0,glassResize=null;
 const shape=(gap,span)=>{
  if(gap<=0)return '';
  const waist=100*(1-gap/(span*.22));
  if(waist<=0)return '';
  const start=span-gap,mid=start+gap/2;
  return `M${start} 0 Q${mid} ${100-waist} ${span} 0 L${span} 100 Q${mid} ${waist} ${start} 100 Z`;
 };
 function mount(){
  const nav=root.querySelector('.channel-nav:not(.channel-gooey)');
  if(!nav)return;
  cancelAnimationFrame(frame);
  const links=[...nav.querySelectorAll('a')],active=links.findIndex(a=>a.hasAttribute('aria-current'));
  const span=matchMedia('(max-width:760px)').matches?14:20,radius=27;
  const open=(i,index)=>i===0||i===links.length||i===index||i-1===index;
  const target=links.map((_,i)=>[i===0?0:open(i,active)?span:-1,open(i,active)?radius:0,open(i+1,active)?radius:0]);
  const signature=links.map(a=>a.getAttribute('href')).join('|');
  const state=previous?.signature===signature&&!reduced.matches?previous.state.map(v=>[...v]):target.map(v=>[...v]);
  const velocity=state.map(()=>[0,0,0]);
  nav.classList.add('channel-gooey');
  const paths=links.map((link,i)=>{
   if(!i)return null;
   const id=`channel-neck-${++serial}`;
   link.insertAdjacentHTML('afterbegin',`<svg class="channel-gooey-neck" aria-hidden="true" width="${span}" viewBox="0 0 ${span} 100" preserveAspectRatio="none"><defs><linearGradient id="${id}"><stop offset="0"/><stop offset="1"/></linearGradient></defs><path fill="url(#${id})"/></svg>`);
   return link.querySelector('.channel-gooey-neck');
  });
  function paint(){
   links.forEach((link,i)=>{
    const [gap,left,right]=state[i];
    link.style.marginLeft=gap+'px';
    link.style.borderRadius=`${left}px ${right}px ${right}px ${left}px`;
    // Closing seams lose their edge immediately, before the spring settles.
    link.style.setProperty('--gooey-left-edge',open(i,active)?'1px':'0px');
    link.style.setProperty('--gooey-right-edge',open(i+1,active)?'1px':'0px');
    if(paths[i]){
     paths[i].querySelector('path').setAttribute('d',shape(gap,span));
     const stops=paths[i].querySelectorAll('stop');
     stops[0].setAttribute('stop-color',getComputedStyle(links[i-1]).backgroundColor);
     stops[1].setAttribute('stop-color',getComputedStyle(link).backgroundColor);
    }
   });
   // Sample the backdrop once for the full nav, then clip that shared layer.
   const bounds=nav.getBoundingClientRect();
   const outlines=links.map((link,i)=>{
    const box=link.getBoundingClientRect(),x=box.left-bounds.left,y=box.top-bounds.top,w=box.width,h=box.height;
    const l=Math.max(0,Math.min(state[i][1],h/2)),r=Math.max(0,Math.min(state[i][2],h/2));
    // CSS border-radius uses circular arcs, not quadratic corner approximations.
    // Match the shared glass mask to the link border exactly.
    let d=`M${x+l} ${y}H${x+w-r}A${r} ${r} 0 0 1 ${x+w} ${y+r}V${y+h-r}A${r} ${r} 0 0 1 ${x+w-r} ${y+h}H${x+l}A${l} ${l} 0 0 1 ${x} ${y+h-l}V${y+l}A${l} ${l} 0 0 1 ${x+l} ${y}Z`;
    const gap=state[i][0],waist=1-gap/(span*.22);
    if(i&&gap>0&&waist>0){const start=x-gap,mid=x-gap/2;d+=`M${start} ${y}Q${mid} ${y+h*(1-waist)} ${x} ${y}V${y+h}Q${mid} ${y+h*waist} ${start} ${y+h}Z`;}
    return d;
   }).join(' ');
   // An alpha mask clips the backdrop compositor as well as the glass tint.
   // Disconnected capsules leave genuinely transparent gaps between them.
   const mask=`<svg xmlns="http://www.w3.org/2000/svg" width="${bounds.width}" height="${bounds.height}" viewBox="0 0 ${bounds.width} ${bounds.height}"><path fill="white" d="${outlines}"/></svg>`;
   nav.style.setProperty('--channel-glass-mask',`url("data:image/svg+xml,${encodeURIComponent(mask)}")`);
   previous={signature,state};
  }
  paint();
  glassResize?.disconnect();glassResize=new ResizeObserver(paint);glassResize.observe(nav);
  nav.addEventListener('scroll',paint,{passive:true});
  let last=0;
  function tick(now){
   if(!nav.isConnected)return;
   const dt=last?Math.min((now-last)/1000,1/30):1/60;last=now;
   let moving=false;
   state.forEach((values,i)=>values.forEach((value,j)=>{
    // Substeps keep the original stiffness=200, damping=28, mass=1 stable.
    for(let n=0;n<4;n++){
     velocity[i][j]+=(200*(target[i][j]-state[i][j])-28*velocity[i][j])*dt/4;
     state[i][j]+=velocity[i][j]*dt/4;
    }
    if(!reduced.matches&&(Math.abs(target[i][j]-state[i][j])>.01||Math.abs(velocity[i][j])>.01))moving=true;
    else {state[i][j]=target[i][j];velocity[i][j]=0;}
   }));
   paint();
   if(moving)frame=requestAnimationFrame(tick);
  }
  frame=requestAnimationFrame(tick);
 }
 new MutationObserver(mount).observe(root,{childList:true,subtree:true});
 mount();
})();
