// Keep only complete tags that fit the first line, in their original order.
(()=>{
 const selector='.forum-card-tags';
 const observed=new Set();
 function fit(row){
  const links=[...row.children];
  links.forEach(link=>link.hidden=false);
  const gap=parseFloat(getComputedStyle(row).columnGap)||0;
  let used=0,full=false;
  links.forEach((link,index)=>{
   const width=link.getBoundingClientRect().width;
   const next=used+(index?gap:0)+width;
   if(full||next>row.clientWidth){link.hidden=true;full=true;}else used=next;
  });
 }
 const resize=new ResizeObserver(entries=>entries.forEach(entry=>fit(entry.target)));
 function scan(){
  observed.forEach(row=>{if(!row.isConnected){resize.unobserve(row);observed.delete(row);}});
  document.querySelectorAll(selector).forEach(row=>{if(!observed.has(row)){observed.add(row);fit(row);resize.observe(row);}});
 }
 new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
 scan();
 document.fonts.ready.then(()=>observed.forEach(fit));
})();
