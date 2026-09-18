/* Register a loader that resolves to page HTML; local pages remain immediate. */
window.novaPageLoading = (() => {
 const loaders=new Map();
 const names={home:'首页',courses:'课程',articles:'资讯',community:'论坛',events:'活动',practice:'实战',ranking:'榜单'};
 const bar=(size='')=>`<i class="skeleton-block skeleton-line ${size}"></i>`;
 const meta=()=>`<div class="skeleton-meta"><i class="skeleton-block skeleton-avatar"></i>${bar('short')}</div>`;
 function card(page,index){
  if(page==='ranking')return `<div class="skeleton-rank">${bar('rank-number')}<i class="skeleton-block skeleton-avatar"></i><div class="skeleton-rank-name">${bar('medium')}</div>${bar('rank-value')}${bar('rank-value')}</div>`;
  if(page==='community')return `<article class="skeleton-post">${meta()}${bar('title')}${bar()}${bar('medium')}<div class="skeleton-tags">${bar('tag')}${bar('tag')}</div></article>`;
  return `<article class="skeleton-card">${page!=='articles'||index%2===0?'<div class="skeleton-block skeleton-cover"></div>':''}<div class="skeleton-card-body">${bar('title')}${bar('medium')}${page==='articles'?bar():''}${meta()}</div></article>`;
 }
 function render(page){
  if(!names[page])return '';
  if(page==='home')return `<section class="page-loading page-loading-home"><span class="loading-announcement" role="status">正在加载首页…</span><div class="skeleton-home-tabs" aria-hidden="true">${bar('tab')}${bar('tab')}${bar('tab')}${bar('tab')}</div><div class="skeleton-home-feature" aria-hidden="true"><div class="skeleton-home-journey">${bar('title')}${bar('medium')}${bar('tab')}</div><div class="skeleton-ranking">${Array.from({length:3},(_,i)=>card('ranking',i)).join('')}</div></div><div class="skeleton-home-heading" aria-hidden="true">${bar('subtitle')}</div><div class="skeleton-layout skeleton-articles" aria-hidden="true">${Array.from({length:6},(_,i)=>card('articles',i)).join('')}</div></section>`;
  const count=page==='ranking'?5:6;
  return `<section class="page-loading"><span class="loading-announcement" role="status">正在加载${names[page]}…</span><header class="home-heading"><h1>${names[page]}</h1><div aria-hidden="true">${bar('subtitle')}</div></header><div class="skeleton-toolbar" aria-hidden="true">${bar('tab')}${bar('tab')}${bar('tab')}</div><div class="skeleton-layout skeleton-${page}" aria-hidden="true">${Array.from({length:count},(_,i)=>card(page,i)).join('')}</div></section>`;
 }
 function shell(active){
  const sidebar=document.querySelector('.product-sidebar');
  if(active&&sidebar&&!sidebar.querySelector('.skeleton-sidebar')){
   const placeholder=document.createElement('div');placeholder.className='skeleton-sidebar';placeholder.setAttribute('aria-hidden','true');
   placeholder.innerHTML=`<div class="skeleton-sidebar-brand">${bar('title')}</div><div class="skeleton-sidebar-links">${Array.from({length:7},()=>`<div class="skeleton-sidebar-item"><i class="skeleton-block skeleton-avatar"></i>${bar('short')}</div>`).join('')}</div><div class="skeleton-sidebar-footer skeleton-block"></div>`;
   sidebar.append(placeholder);
  }
  document.documentElement.classList.toggle('site-boot-loading',active);
  document.querySelectorAll('.product-sidebar,.workspace-header').forEach(el=>{el.inert=active;el.setAttribute('aria-busy',String(active))});
 }
 async function prepareHome(html){
  const template=document.createElement('template');template.innerHTML=html;
  const sources=[...template.content.querySelectorAll('img[src],image[href]')].slice(0,8).map(el=>el.getAttribute('src')||el.getAttribute('href'));
  const assets=Promise.all(sources.map(src=>new Promise(resolve=>{const image=new Image();image.onload=image.onerror=resolve;image.src=src;if(image.complete)resolve()})));
  await Promise.all([new Promise(resolve=>setTimeout(resolve,350)),Promise.race([assets,new Promise(resolve=>setTimeout(resolve,2000))])]);
  return html;
 }
 return {shell,prepareHome,supports:page=>Object.hasOwn(names,page),render,register(page,loader){if(!Object.hasOwn(names,page)||typeof loader!=='function')throw new TypeError('Unsupported page or loader');loaders.set(page,loader);return ()=>loaders.delete(page)},resolve(page,params,fallback){return loaders.has(page)?Promise.resolve().then(()=>loaders.get(page)(new URLSearchParams(params))):fallback()}};
})();
