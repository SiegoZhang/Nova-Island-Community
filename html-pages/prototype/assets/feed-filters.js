// Searchable multi-select filters, shared by forum and articles.
function feedFilterToolbar(options,selected,key,page){
 const id='feed-filter-'+page;
 return `<div class="feed-filter-toolbar"><div class="feed-filter-selection" aria-label="已选标签"><div class="feed-filter-group" role="group" aria-label="内容筛选"><button class="feed-filter-trigger" type="button" popovertarget="${id}" aria-label="筛选标签" aria-haspopup="dialog"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>筛选</button>${selected.map(t=>`<button class="feed-filter-chip" type="button" data-filter-tag="${escapeHtml(t)}" data-filter-key="${key}" data-filter-page="${page}" aria-label="移除标签：${escapeHtml(t)}">${escapeHtml(t)}<span aria-hidden="true">×</span></button>`).join('')}</div>${page==='articles'?`<div class="feed-filter-group feed-filter-toggle"><button class="feed-filter-trigger feed-filter-featured" type="button" data-filter-featured aria-pressed="${route().params.get('featured')==='1'}">精选</button></div>`:''}${page==='community'?`<div class="feed-filter-group feed-filter-toggle"><button class="feed-filter-trigger feed-filter-mine" type="button" data-filter-mine aria-pressed="${route().params.get('mine')==='1'}">我的帖子</button></div>`:''}</div><div id="${id}" class="feed-filter-popover" popover="auto" role="dialog" aria-label="筛选标签" data-key="${key}" data-page="${page}"><div class="feed-filter-search"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg><input type="search" placeholder="搜索标签" aria-label="搜索标签" autocomplete="off"></div><div class="feed-filter-options">${options.map(t=>`<label class="feed-filter-option"><input type="checkbox" value="${escapeHtml(t)}" ${selected.includes(t)?'checked':''}><span>${escapeHtml(t)}</span></label>`).join('')}<p class="feed-filter-empty" hidden>没有匹配的标签</p></div><footer><button type="button" data-clear-feed-filter>清空</button><button class="ds-button" type="button" data-apply-feed-filter>应用筛选</button></footer></div></div>`;
}
(()=>{
 function position(panel){
  const trigger=document.querySelector(`[popovertarget="${panel.id}"]`);if(!trigger)return;
  const rect=trigger.getBoundingClientRect();
  const width=Math.min(320,innerWidth-32);
  panel.style.width=width+'px';
  panel.style.left=Math.max(16,Math.min(rect.left,innerWidth-width-16))+'px';
  panel.style.top=Math.max(16,Math.min(rect.bottom+10,innerHeight-panel.offsetHeight-16))+'px';
 }
 document.addEventListener('toggle',event=>{
  const panel=event.target;if(!panel.matches?.('.feed-filter-popover'))return;
  const trigger=document.querySelector(`[popovertarget="${panel.id}"]`);
  trigger?.setAttribute('aria-expanded',String(event.newState==='open'));
  if(event.newState==='open'){const list=panel.querySelector('.feed-filter-options');if(!panel.hasAttribute('data-preserve-order'))[...list.querySelectorAll('.feed-filter-option')].sort((a,b)=>Number(b.querySelector('input').checked)-Number(a.querySelector('input').checked)).forEach(row=>list.insertBefore(row,list.querySelector('.feed-filter-empty')));position(panel);(panel.querySelector('input[type="search"]')||panel.querySelector('input:checked')||panel.querySelector('input'))?.focus({preventScroll:true});}
 },true);
 document.addEventListener('input',event=>{
  if(!event.target.matches('.feed-filter-search input'))return;
  const panel=event.target.closest('.feed-filter-popover'),query=event.target.value.trim().toLowerCase();let shown=0;
  panel.querySelectorAll('.feed-filter-option').forEach(row=>{row.hidden=!row.textContent.toLowerCase().includes(query);if(!row.hidden)shown++;});
  panel.querySelector('.feed-filter-empty').hidden=shown>0;
 });
 document.addEventListener('click',event=>{
  if(event.target.closest('[data-filter-featured]')){
   const params=new URLSearchParams(route().params);
   if(params.get('featured')==='1')params.delete('featured');else params.set('featured','1');
   params.delete('post');params.delete('compose');
   location.hash='#articles'+(params.size?'?'+params.toString():'');
   return;
  }
  if(event.target.closest('[data-filter-mine]')){
   const params=new URLSearchParams(route().params);
   if(params.get('mine')==='1')params.delete('mine');else params.set('mine','1');
   params.delete('post');params.delete('compose');
   location.hash='#community'+(params.size?'?'+params.toString():'');
   return;
  }
  const panel=event.target.closest('.feed-filter-popover');if(!panel)return;
  if(event.target.closest('[data-clear-feed-filter]'))panel.querySelectorAll('input[type="checkbox"]').forEach(input=>input.checked=false);
  if(event.target.closest('[data-apply-feed-filter]')){
   const params=new URLSearchParams(route().params);params.delete(panel.dataset.key);params.delete('post');params.delete('compose');
   panel.querySelectorAll('input[type="checkbox"]:checked').forEach(input=>params.append(panel.dataset.key,input.value));
   const hash='#'+panel.dataset.page+(params.size?'?'+params.toString():'');panel.hidePopover();
   if(location.hash!==hash)location.hash=hash;
  }
 });
 window.addEventListener('resize',()=>document.querySelectorAll('.feed-filter-popover:popover-open').forEach(position));
 document.addEventListener('scroll',event=>{if(event.target.matches?.('.forum-feed-scroll,.forum-layout'))document.querySelectorAll('.feed-filter-popover:popover-open').forEach(panel=>panel.hidePopover());},true);
})();

// Shared overflow handling for forum, articles and ranking selections.
(()=>{
 const groups=new Set();let frame;
 function fit(group){
  const opener=group.querySelector('.feed-filter-trigger'),chips=[...group.querySelectorAll('[data-filter-tag],[data-ranking-remove]')];
  if(!opener||!chips.length)return;
  let more=group.querySelector('[data-filter-overflow]');
  if(!more){more=document.createElement('button');more.type='button';more.className='feed-filter-chip';more.dataset.filterOverflow='';more.setAttribute('popovertarget',opener.getAttribute('popovertarget'));group.append(more);}
  chips.forEach(chip=>chip.hidden=false);more.hidden=true;
  const style=getComputedStyle(group),gap=parseFloat(style.gap)||4;
  if(group.parentElement.matches('.ranking-filter-control')){
   const natural=[opener,...chips].reduce((sum,item)=>sum+item.getBoundingClientRect().width,0)+gap*chips.length+parseFloat(style.paddingLeft)+parseFloat(style.paddingRight)+2;
   group.parentElement.style.width=Math.ceil(natural)+'px';
  }
  const room=group.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
  let used=opener.getBoundingClientRect().width,shown=chips.length;
  const widths=chips.map(chip=>chip.getBoundingClientRect().width);
  if(used+widths.reduce((sum,w)=>sum+w+gap,0)>room+1){
   more.hidden=false;
   const reserve=48+gap;shown=0;
   for(const width of widths){if(used+gap+width+reserve>room)break;used+=gap+width;shown++;}
   chips.forEach((chip,i)=>chip.hidden=i>=shown);
   const label='+'+(chips.length-shown);if(more.textContent!==label)more.textContent=label;
   more.setAttribute('aria-label','查看其余 '+(chips.length-shown)+' 个已选项');
  }
 }
 function update(){frame=null;groups.forEach(group=>{if(!group.isConnected){observer.unobserve(group);groups.delete(group);}else fit(group);});}
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 const observer=new ResizeObserver(schedule);
 new MutationObserver(()=>{document.querySelectorAll('.feed-filter-group').forEach(group=>{if(!groups.has(group)){groups.add(group);observer.observe(group);}});schedule();}).observe(document.querySelector('#content'),{childList:true,subtree:true});
 window.addEventListener('resize',schedule);document.fonts.ready.then(schedule);
})();
