const fs=require('fs'),path=require('path'),{pathToFileURL,fileURLToPath}=require('url');
let playwright;try{playwright=require('playwright')}catch{playwright=require('/Users/zhuanzmima0000/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')}
const root=path.resolve(__dirname,'../prototype'),out=__dirname;
const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'};
function asset(url,base){if(/^(data:|https?:|#)/.test(url))return url;const resolved=new URL(url,base);if(resolved.protocol!=='file:')return url;const p=fileURLToPath(resolved);return `data:${mime[path.extname(p)]||'application/octet-stream'};base64,${fs.readFileSync(p).toString('base64')}`}
function cssFile(url){const p=fileURLToPath(url);return fs.readFileSync(p,'utf8').replace(/url\(\s*(['"]?)(.*?)\1\s*\)/g,(_,q,u)=>`url("${asset(u,url)}")`)}
const expand=`html,body{height:auto!important;overflow:visible!important}body .nova-ds,body .ds-workspace,body .ds-page-entrance,body .ds-main,body #content,body #content>.forum-page,body #content>.forum-page .forum-layout,body #content>.forum-page .forum-feed-scroll{height:auto!important;max-height:none!important;overflow:visible!important;flex-shrink:0!important}body .nova-ds{min-height:100vh!important}*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.ds-page-entrance{opacity:1!important;transform:none!important}`;
const escape=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
(async()=>{
const browser=await playwright.chromium.launch({headless:true});
try{
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=pathToFileURL(path.join(root,'index.html')).href;
await page.goto(base);await page.waitForFunction(()=>document.querySelector('#content')?.children.length>0);
const data=await page.evaluate(()=>({labels,channels,catalog,startChannelCatalog,forumSeed,forumTopics}));
const pages=[];
function add(name,title,route,kind='页面',action=null){pages.push({file:name+'.html',title,route,kind,action})}
Object.entries(data.labels).forEach(([id,title])=>add(id,title,'index.html#'+id));
data.channels.forEach(c=>add('channel-'+c.id,c.name,'index.html#home?channel='+c.id,'频道'));
add('course-detail','课程详情','course.html','详情');add('article-detail','文章详情','article.html','详情');
const items=[...new Map([...data.catalog,...data.startChannelCatalog].filter(p=>!p.href).map(p=>[p.id,p])).values()];
items.forEach(p=>add('read-'+p.id,p.title,'index.html#read/'+p.id,'内容阅读'));
data.forumSeed.forEach(p=>add('forum-'+p.id,p.title,'index.html#community?post='+p.id,'论坛详情'));
add('forum-compose','发布帖子','index.html#community?compose=1','编辑与筛选');
add('article-compose','发布文章','index.html#articles?compose=1','编辑与筛选');
add('forum-mine','我的帖子','index.html#community?mine=1','编辑与筛选');
data.forumTopics.forEach((t,i)=>add('forum-tag-'+(i+1),'论坛标签：'+t,'index.html#community?topic='+encodeURIComponent(t),'编辑与筛选'));
data.channels.forEach(c=>add('article-tag-'+c.id,'文章标签：'+c.name,'index.html#articles?tag='+encodeURIComponent(c.name),'编辑与筛选'));
add('search-results','搜索结果','index.html#search?q='+encodeURIComponent('工作流'),'其他状态');
add('search-empty','搜索无结果','index.html#search?q='+encodeURIComponent('不存在的关键词'),'其他状态');
add('notifications-unread','未读通知','index.html#notifications?filter=unread','其他状态');
['month','all'].forEach((r,i)=>add('ranking-'+r,['月榜','总榜'][i],'index.html#ranking?range='+r,'其他状态'));
add('account-menu','个人菜单展开','index.html#home','其他状态','menu');
const map=Object.fromEntries(pages.filter(p=>!p.action).map(p=>[p.route,p.file]));
for(const [index,item] of pages.entries()){
 await page.goto('about:blank');
 await page.goto(new URL(item.route,pathToFileURL(root+'/')).href);await page.waitForTimeout(100);
 if(item.route.includes('channel='))await page.evaluate(()=>{const id=route().params.get('channel');channelFeedStates[id]={count:channelItems(id).length,scroll:0};render()});
 await page.addStyleTag({content:expand});
 if(item.action==='menu')await page.evaluate(()=>document.querySelector('#account-menu').showPopover());
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.complete?Promise.resolve():new Promise(r=>{i.onload=r;i.onerror=r})));document.querySelectorAll('*').forEach(e=>{e.scrollTop=0;e.scrollLeft=0});window.scrollTo(0,0)});
 await page.waitForTimeout(100);
 const styles=await page.locator('link[rel="stylesheet"]').evaluateAll(es=>es.map(e=>e.href));
 const css=styles.map(u=>cssFile(new URL(u))).join('\n');
 const resources=await page.locator('[src]').evaluateAll(es=>es.map(e=>e.getAttribute('src')).filter(Boolean));
 const embedded=Object.fromEntries(resources.filter(u=>!u.endsWith('.js')&&!u.includes('.js?')).map(u=>[u,asset(u,page.url())]));
 await page.evaluate(({css,embedded,map,title})=>{
  document.querySelectorAll('script,link[rel="stylesheet"],base').forEach(e=>e.remove());
  const style=document.createElement('style');style.textContent=css;document.head.prepend(style);document.title=title+' / Nova Island';
  document.querySelectorAll('[src]').forEach(e=>{const value=e.getAttribute('src');if(embedded[value])e.setAttribute('src',embedded[value])});
  document.querySelectorAll('input').forEach(e=>{e.setAttribute('value',e.value);if(e.checked)e.setAttribute('checked','')});
  document.querySelectorAll('textarea').forEach(e=>e.textContent=e.value);
  document.querySelectorAll('a[href]').forEach(e=>{const u=new URL(e.getAttribute('href'),location.href);if(u.protocol==='file:'){const name=u.pathname.split('/').pop();const key=name+u.hash;if(map[key])e.setAttribute('href',map[key]);else if(map[name])e.setAttribute('href',map[name]+u.hash)}});
  document.querySelectorAll('[popover]').forEach(e=>{if(e.matches(':popover-open')){e.removeAttribute('popover');e.style.cssText+=';display:block;position:fixed;z-index:1000;margin:0'}else e.remove()});
 },{css,embedded,map,title:item.title});
 fs.writeFileSync(path.join(out,item.file),await page.content());
 item.bytes=fs.statSync(path.join(out,item.file)).size;
 if(index%20===0)console.log(`已导出 ${index+1}/${pages.length}: ${item.title}`);
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({viewport:{width:1440,height:1000},pages,errors},null,2));
const groups=[...new Set(pages.map(p=>p.kind))];
fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>Nova Island 页面导出目录</title><style>body{font:15px/1.7 system-ui;background:#f5f6f8;color:#25272a;max-width:1100px;margin:60px auto;padding:24px}h1{font-size:30px}section{background:white;border:1px solid #e4e6eb;border-radius:12px;padding:24px;margin:24px 0}ul{display:grid;grid-template-columns:1fr 1fr;gap:12px 28px;padding-left:20px}a{color:#344e79;text-decoration:none}small{display:block;color:#777}a:hover{text-decoration:underline}</style><h1>Nova Island 独立 HTML 页面</h1><p>共 ${pages.length} 页，建议以 1440px 宽度导入。每页已内嵌样式和本地图片，无需 JavaScript。长列表已展开。</p>${groups.map(g=>`<section><h2>${g}</h2><ul>${pages.filter(p=>p.kind===g).map(p=>`<li><a href="${p.file}">${escape(p.title)}</a><small>${p.file}</small></li>`).join('')}</ul></section>`).join('')}</html>`);
// Verify every exported document with JavaScript disabled, including image decoding.
const check=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000}}),viewer=await check.newPage();const failures=[];
for(const item of pages){await viewer.goto(pathToFileURL(path.join(out,item.file)).href);const result=await viewer.evaluate(()=>({text:document.body.innerText.length,bad:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.alt),scripts:document.scripts.length,externalCSS:document.querySelectorAll('link[rel="stylesheet"]').length}));if(result.text<80||result.bad.length||result.scripts||result.externalCSS)failures.push({file:item.file,...result})}
await viewer.goto(pathToFileURL(path.join(out,'home.html')).href);await viewer.screenshot({path:path.join(out,'preview-home.png'),fullPage:true});
await viewer.goto(pathToFileURL(path.join(out,'articles.html')).href);await viewer.screenshot({path:path.join(out,'preview-articles.png'),fullPage:true});
fs.writeFileSync(path.join(out,'validation.json'),JSON.stringify({pages:pages.length,javaScriptDisabled:true,failures,sourceErrors:errors},null,2));
console.log(JSON.stringify({pages:pages.length,failures,sourceErrors:errors}));
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
