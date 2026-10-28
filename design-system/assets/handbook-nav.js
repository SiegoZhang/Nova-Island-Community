(() => {
 const sidebar=document.querySelector('.manual-sidebar');
 if(!sidebar)return;
 const groups=[...sidebar.querySelectorAll('.manual-group')];
 const links=[...sidebar.querySelectorAll('.manual-nav a')];
 const page=location.pathname.split('/').pop()||'index.html';
 const section=page==='foundations.html'?'foundations':page==='ai-community.html'?'components':['principles.html','extend.html','pattern-feed.html'].includes(page)?'guidelines':'start';
 const key='nova-handbook-nav-v1';
 let saved={};try{saved=JSON.parse(sessionStorage.getItem(key)||'{}')}catch{}
 for(const g of groups)g.open=g.dataset.section===section || saved[g.dataset.section]===true;
 function save(){const state=Object.fromEntries(groups.map(g=>[g.dataset.section,g.open]));state.scroll=sidebar.scrollTop;try{sessionStorage.setItem(key,JSON.stringify(state))}catch{}}
 function select(){
  const hash=page==='ai-community.html'?(location.hash||'#overview'):location.hash;
  for(const a of links){const u=new URL(a.href);const match=u.pathname===location.pathname && u.hash===hash;a.toggleAttribute('data-selected',match);if(match)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}
  groups.forEach(g=>g.toggleAttribute('data-current-section',g.dataset.section===section));
 }
 function alignChapter(){
  if(page!=='foundations.html'||!location.hash)return;
  const target=document.getElementById(location.hash.slice(1));
  if(target)target.scrollIntoView({block:'start',behavior:'instant'});
 }
 select();
 if(document.readyState==='complete')requestAnimationFrame(alignChapter);
 else window.addEventListener('load',()=>requestAnimationFrame(alignChapter),{once:true});
 window.addEventListener('hashchange',()=>{select();alignChapter()});window.addEventListener('manual-navigation',select);
 groups.forEach(g=>g.addEventListener('toggle',save));
 sidebar.addEventListener('click',e=>{const a=e.target.closest('a');if(a){save();if(page==='foundations.html'){const u=new URL(a.href);if(u.pathname===location.pathname&&u.hash===location.hash)requestAnimationFrame(alignChapter)}}});
 window.addEventListener('pagehide',save);
 if(Number.isFinite(saved.scroll))sidebar.scrollTop=saved.scroll;
 requestAnimationFrame(()=>{
  const current=sidebar.querySelector('[aria-current="page"]');
  if(!current)return;
  const box=current.getBoundingClientRect(),bounds=sidebar.getBoundingClientRect();
  if(box.bottom>bounds.bottom)sidebar.scrollTop+=box.bottom-bounds.bottom+20;
  else if(box.top<bounds.top)sidebar.scrollTop+=box.top-bounds.top-20;
 });
 const search=sidebar.querySelector('#component-search');
 const rows=[...sidebar.querySelectorAll('#component-nav a')];
 function filter(){const q=search.value.trim().toLocaleLowerCase();let count=0;for(const a of rows){a.hidden=!(a.dataset.search||a.textContent).toLocaleLowerCase().includes(q);if(!a.hidden)count++;}sidebar.querySelectorAll('.manual-category').forEach(g=>g.hidden=![...g.querySelectorAll('a')].some(a=>!a.hidden));sidebar.querySelector('#search-empty').hidden=count>0;}
 search.addEventListener('input',filter);search.addEventListener('search',filter);
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.target.matches('input,textarea,select,[contenteditable]')){e.preventDefault();groups.find(g=>g.dataset.section==='components').open=true;search.focus();}if(e.key==='Escape'&&document.activeElement===search){search.value='';filter();search.blur();}});
})();
