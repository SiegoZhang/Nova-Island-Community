/* Shared markup renderer: documentation snippets and previews use identical structures. */
window.NovaLibrary = {
 async load(){const [catalog,fixtures]=await Promise.all([fetch('library/catalog.json?v=handbook-20261015', {cache:'no-store'}).then(r=>{if(!r.ok)throw Error('目录加载失败');return r.json()}),fetch('library/source-fixtures.json?v=handbook-20261015', {cache:'no-store'}).then(r=>{if(!r.ok)throw Error('样本加载失败');return r.json()})]);return {catalog,fixtures}},
 render(variant,fixtures,{preview=false,prefix='sample'}={}){
  let raw=variant.fixture?fixtures[variant.fixture]:variant.html;
  if(!raw)throw Error('样本来源缺失：'+(variant.fixture||variant.label));
  let container=document.createElement('div');
  if(variant.selector){const doc=new DOMParser().parseFromString(raw,'text/html');const found=doc.querySelector(variant.selector);if(!found)throw Error('找不到组件：'+variant.fixture+' '+variant.selector);raw=found.outerHTML;}
  container.innerHTML=raw;
  container.querySelectorAll('[data-icon]').forEach(el=>{const icons=JSON.parse(fixtures['icon-paths']||'{}');if(icons[el.dataset.icon])el.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[el.dataset.icon]+'</svg>'});
  container.querySelectorAll('script,link,style,base').forEach(el=>el.remove());
  for(const mod of variant.patch||[]){const nodes=mod.selector?[...container.querySelectorAll(mod.selector)]:[container.firstElementChild];if(!nodes.length)throw Error('状态目标不存在：'+mod.selector);for(const node of nodes){if(!node)continue;if(mod.remove){node.remove();continue}if(mod.addClass)node.classList.add(...mod.addClass.split(' '));if(mod.removeClass)node.classList.remove(...mod.removeClass.split(' '));for(const [key,value] of Object.entries(mod.attrs||{})){if(value===null)node.removeAttribute(key);else node.setAttribute(key,value)}if(mod.text!==undefined)node.textContent=mod.text;if(mod.html!==undefined)node.innerHTML=mod.html;if(mod.htmlAppend)node.insertAdjacentHTML('beforeend',mod.htmlAppend);}}
  // A connection example must never carry an installer or a real syncing action.
  container.querySelectorAll('.ranking-connect-panel pre,.ranking-connect-panel code').forEach(el=>el.textContent='# 组件展示：在这里显示对应系统的接入命令');
  container.querySelectorAll('[data-connect-copy]').forEach(el=>el.disabled=false);
  container.querySelectorAll('input[data-connect-name]').forEach(el=>{el.value='示例岛民';el.setAttribute('value','示例岛民');});
  container.querySelectorAll('img[src],image[href]').forEach(el=>{let attr=el.hasAttribute('src')?'src':'href',url=el.getAttribute(attr);if(url.startsWith('assets/'))el.setAttribute(attr,'../html-pages/prototype/'+url);});
  // IDs are unique between states and the code sample keeps all ARIA relations valid.
  const ids=new Map();container.querySelectorAll('[id]').forEach(el=>{const previous=el.id;const id=prefix+'-'+previous;ids.set(previous,id);el.id=id;});
  container.querySelectorAll('*').forEach(el=>{for(const attr of ['for','aria-describedby','aria-labelledby','aria-controls','popovertarget']){if(el.hasAttribute(attr))el.setAttribute(attr,el.getAttribute(attr).split(' ').map(id=>ids.get(id)||id).join(' '));}for(const attr of ['fill','stroke','clip-path','mask','filter']){const value=el.getAttribute(attr);if(value)el.setAttribute(attr,value.replace(/url\(#([^)]*)\)/g,(_,id)=>`url(#${ids.get(id)||id})`));}const href=el.getAttribute('href');if(href?.startsWith('#')&&ids.has(href.slice(1)))el.setAttribute('href','#'+ids.get(href.slice(1)));});
  if(variant.context){const ctx=document.createElement('div');ctx.className=variant.context;ctx.append(...container.childNodes);container.append(ctx);}
  // Preview handlers deliberately do not import application persistence or routing.
  if(preview)container.querySelectorAll('button:not([type])').forEach(el=>el.type=el.closest('form')?'submit':'button');
  return container.innerHTML;
 },
 escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))},
 format(html){return html.replace(/></g,'>\n<')}
};
