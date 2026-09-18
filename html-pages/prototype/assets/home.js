const icons={bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',bookmark:'<path d="M5 3h14v18l-7-4-7 4z"/>',settings:'<circle cx="12" cy="12" r="4"/><path d="M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z"/>',grid:'<rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/>',logout:'<path d="M10 3H4v18h6M10 12h11m-4-4 4 4-4 4"/>',trophy:'<path d="M7 3h10v5c0 5-10 5-10 0zM7 5H3v3c0 3 4 4 5 4M17 5h4v3c0 3-4 4-5 4M12 12v7M7 21h10M9 19h6"/>',home:'<path d="m3 10 9-7 9 7v10H3zM9 20v-7h6v7"/>',book:'<path d="M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3zM12 6v15"/>',file:'<path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h6"/>',chat:'<path d="M4 4h16v13H9l-5 4zM8 9h8M8 13h5"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18"/>',layers:'<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>',user:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>'};
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[el.dataset.icon]}</svg>`);
const content=document.querySelector('#content'), labels={member:'岛民主页',home:'首页',courses:'课程',articles:'资讯',community:'论坛',events:'活动',practice:'实战',personal:'个人中心',notifications:'通知',saved:'我的收藏',drafts:'我的草稿',settings:'账号设置',admin:'管理后台',ranking:'榜单',guide:'入门指南',search:'搜索'};
function heading(title,desc=''){return `<header class="home-heading"><h1>${title}</h1>${desc?`<p>${desc}</p>`:''}</header>`;}
function section(title,link,label){return `<div class="section-heading"><h2>${title}</h2><a href="${link}">${label}</a></div>`;}
function route(){const [page,query='']=location.hash.slice(1).split('?');return {page:page||'home',params:new URLSearchParams(query)};}
function home(){
 const channel=channels.find(c=>c.id===route().params.get('channel'));
 if(channel){const items=channelItems(channel.id);return `${channelNav(channel.id)}<header class="channel-heading channel-summary" aria-label="${channel.name}"><h2>${channel.description}</h2><span>${items.length} 篇</span></header>${items.length?channelFeed(items,channel.id):`<div class="channel-empty"><h2>这个频道的内容正在整理</h2><p>先看看其他频道，或回到推荐继续浏览。</p><a href="#home" class="ds-button">返回推荐</a></div>`}`;}
 return portalHome();
}
function portalHome(){
 const item=id=>catalog.find(p=>p.id===id);
 const picks=['workflow-course','report','buddy','forum-goal-check','forum-codex-login','forum-learn-ai'];
 return `${channelNav()}<div class="home-feature-row">${guideProgressComponent()}${homeLeaderboardCard()}</div><div class="portal-home"><section class="portal-front portal-front-editorial" aria-label="首页推荐"><aside class="portal-editorial" aria-label="精选"><header class="editorial-heading"><h2>精选</h2></header>${channelMasonry(picks.map(id=>{const p=item(id);return id==='workflow-course'?{...p,image:'assets/course-ai-media-16x9.png',cover:undefined,channelCover:true}:p;}))}</aside></section>${portalSections()}</div>`;
}
function portalCardGrid(items){return `<div class="portal-card-grid">${items.map(item=>channelCard(item)).join('')}</div>`;}
function portalSections(){
 const head=(title,description,href)=>`<div class="portal-section-head"><div><h2>${title}</h2><p>${description}</p></div><a href="${href}">查看全部</a></div>`;
 const posts=[...forumState.posts,...forumSeed].slice(0,3);
 return `<section class="portal-directory-section">${head('课程','围绕一个目标，把方法完整地学一遍。','#courses')}${portalCardGrid(catalog.filter(p=>p.type==='course'))}</section><section class="portal-directory-section">${head('资讯','读一篇好文章，带走一个可以实践的方法。','#articles')}${portalCardGrid(catalog.filter(p=>p.type==='article').slice(0,3))}</section><section class="portal-directory-section">${head('论坛','分享经验、提出问题，与岛民一起交流。','#community')}<div class="portal-forum-list">${posts.map(forumRow).join('')}</div></section>${[['活动','在一次相聚中，遇见新的想法。','#events','近期暂无开放的活动','新的活动安排将在这里更新。','calendar'],['实战','从一个真实问题开始，做出自己的作品。','#practice','新的实战计划正在准备','开放后可在这里查看项目与参与方式。','layers']].map(([title,desc,href,empty,note,icon])=>`<section class="portal-directory-section">${head(title,desc,href)}<div class="portal-section-empty"><span class="portal-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${icons[icon]}</svg></span><div><h3>${empty}</h3><p>${note}</p></div></div></section>`).join('')}`;
}
function catalogPage(type){const course=type==='course';return `${heading(course?'课程':'资讯',course?'围绕一个目标，把方法完整地学一遍。':'随时打开一篇，把好方法带回自己的实践。')}${course?contentGrid(catalog.filter(p=>p.type==='course')):channelMasonry(catalog.filter(p=>p.type!=='course'))}`;}
function readPage(){const item=[...catalog,...startChannelCatalog].find(p=>p.id===route().page.slice(5));if(!item)return `${heading('没有找到这篇内容')}<a href="#home" class="ds-button">返回首页</a>`;return `<article class="catalog-reader"><div class="reader-category">${item.label} / ${channels.find(c=>c.id===item.channels[0]).name}</div><h1>${item.title}</h1><div class="card-meta"><span class="card-avatar">${item.author.slice(0,1)}</span><span>${item.author}</span><span>${item.meta}</span></div>${item.body?`<div class="reader-original-body">${item.body.map(text=>`<p>${escapeHtml(text)}</p>`).join('')}${(item.relatedLinks||[]).map(link=>`<p><a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a></p>`).join('')}${(item.images||[]).map(image=>`<figure><img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async"></figure>`).join('')}</div><p class="reader-source"><a href="${escapeHtml(item.sourceHref)}" target="_blank" rel="noopener noreferrer">查看原帖</a></p>`:`${coverMarkup(item)}<p class="reader-intro">${item.desc}</p><div class="reader-excerpt">${item.sourceHref?`<a href="${escapeHtml(item.sourceHref)}" class="ds-button secondary">阅读原文</a>`:''}<h2>内容节选</h2><p>这里展示已有内容的标题与摘要，用于体验频道浏览和阅读路径。完整正文尚未接入此原型。</p>${item.type==='external'?'<p>完整教程位于飞书，当前原型未配置原文链接。</p>':''}</div>`}<a href="${escapeHtml(lastCatalogRoute)}" class="ds-button secondary">继续浏览</a></article>`;}
function guide(){return guideProgressPage();}
function personal(){return `${heading('我的账号')}<div class="account-page-links">${[['notifications','通知'],['saved','我的收藏'],['drafts','我的草稿'],['settings','账号设置'],['guide','入门指南'],['admin','管理后台']].map(([id,title])=>`<a href="#${id}">${title}</a>`).join('')}</div>`;}
function accountEmpty(title,emptyTitle,desc,href,label){return `${heading(title)}<div class="account-empty"><h2>${emptyTitle}</h2><p>${desc}</p><a class="ds-button secondary" href="${href}">${label}</a></div>`;}
function notificationPage(){return `${heading('通知','回复、互动和系统提醒，都在这里。')}<nav class="account-tabs" aria-label="通知筛选">${[['all','全部'],['unread','未读']].map(([id,name])=>`<a href="#notifications?filter=${id}" ${((route().params.get('filter')||'all')===id)?'aria-current="page"':''}>${name}</a>`).join('')}</nav><div class="account-empty"><h2>${route().params.get('filter')==='unread'?'没有未读通知':'暂时没有通知'}</h2><p>有新的回复、互动或系统消息时，会在这里提醒你。</p></div>`;}
function settingsPage(){return `${heading('账号设置')}<section class="account-settings"><div class="account-identity"><span class="profile-avatar">S</span><div><strong>Sage</strong><small>@u737cb59688dd35…</small></div></div><p>当前为资料展示原型，账号修改与登录服务尚未接入。</p></section>`;}
function rankingPage(){const range=route().params.get('range')||'week',names={week:'本周',month:'本月',all:'总榜'};return `${heading('榜单','认识分享方法、持续贡献经验的岛民。')}<nav class="account-tabs" aria-label="榜单周期">${Object.entries(names).map(([id,name])=>`<a href="#ranking?range=${id}" ${range===id?'aria-current="page"':''}>${name}</a>`).join('')}</nav><div class="account-empty"><h2>暂无${names[range]||'本周'}数据</h2><p>榜单数据尚未接入原型，接入后展示岛民与贡献值。</p></div>`;}
function emptyPage(title,desc){const discussion=title==='交流'||title==='论坛';return `${heading(title,({活动:'在一次相聚中，遇见新的想法。',实战:'从一个真实问题开始，做出自己的作品。'})[title]||'')}<div class="quiet-empty"><span class="eyebrow">${discussion?'一起分享实践':'下次见面之前'}</span><h2>${discussion?'交流内容正在准备':desc}</h2><p>${discussion?'这里将展示岛民的问题与实践分享。':'开放后会在这里展示具体安排。现在也可以从课程开始一次实践。'}</p><a class="ds-button" href="course.html">查看课程</a></div>`;}
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let lastCatalogRoute='#home',guideOrigin='#personal',searchOrigin='#home';
const safeReturn=h=>/^#(home|courses|articles|community|events|practice|personal|guide|search|notifications|saved|drafts|settings|admin|ranking)(\?|$)/.test(h)?h:'#home';
function search(){const q=route().params.get('q')||'',items=q.trim()?catalogMatches(q):[];return `${heading('搜索岛内内容')}<form id="home-search" class="home-search-form" role="search"><input class="ds-input" name="query" aria-label="搜索关键词" value="${escapeHtml(q)}" placeholder="搜索课程、文章或关键词"><button class="ds-button">搜索</button></form>${q.trim()?`<p class="search-summary">“${escapeHtml(q)}” / ${items.length} 条示例结果</p>${items.length?contentGrid(items):'<div class="channel-empty"><h2>没有找到相关内容</h2><p>试试“工作流”“知识库”或作者名字。</p><a href="#search" class="ds-button secondary">清除搜索</a></div>'}`:'<p class="search-summary">输入一个关键词，找到可以开始的内容。</p>'}`;}
let pageRenderVersion=0;
function render(){
 const version=++pageRenderVersion;
 saveChannelPosition();
 const page=route().page,valid=page.startsWith('read/')?'read':labels[page]?page:'home';
 if(['home','courses','articles','search'].includes(valid)){lastCatalogRoute=location.hash||'#home';try{sessionStorage.setItem('nova-catalog-return',lastCatalogRoute)}catch{}}
 const currentChannel=valid==='home'?channels.find(c=>c.id===route().params.get('channel')):null;
 const label=valid==='member'?(memberProfiles[route().params.get('user')]?.name||'岛民主页'):valid==='guide'?'个人中心 / 入门指南':valid==='read'?'文章阅读':currentChannel?'首页 / '+currentChannel.name:labels[valid];
 document.title=label+' / Nova Island';
 const back=document.querySelector('#page-back');
 const destination=valid==='member'?(route().params.get('from')==='ranking'?'#ranking':'#home'):valid==='read'?lastCatalogRoute:valid==='guide'?guideOrigin:valid==='search'?searchOrigin:null;
 back.hidden=!destination;back.href=safeReturn(destination||'#home');
 document.querySelectorAll('[data-page]').forEach(a=>{const active=a.dataset.page===(valid==='guide'?'personal':valid==='read'?'home':valid);a.classList.toggle('selected',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 content.classList.toggle('section-index',['courses','articles','community','events','practice','ranking'].includes(valid)&&!route().params.has('compose')&&!route().params.has('post'));
 content.classList.toggle('home-scroll',valid==='home');
 const buildPage=()=>({home,member:memberPage,courses:()=>catalogPage('course'),articles:articlePage,community:forumPage,events:()=>emptyPage('活动','近期暂无开放的活动'),practice:()=>emptyPage('实战','新的实战计划正在准备'),personal,guide,search,read:readPage,notifications:notificationPage,saved:forumSaved,drafts:forumDrafts,settings:settingsPage,admin:()=>accountEmpty('管理后台','管理功能尚未接入原型','此入口按提供的管理员菜单展示；正式产品按账号权限开放。','#home','返回首页'),ranking:rankingPage}[valid])();
 const loading=novaPageLoading.supports(valid)&&!route().params.has('post')&&!route().params.has('compose');
 const preview=loading&&route().params.get('loading')==='1';
 let result=preview?null:loading?novaPageLoading.resolve(valid,route().params,buildPage):buildPage();
 if(!preview&&valid==='home'&&version===1)result=Promise.resolve(result).then(novaPageLoading.prepareHome);
 const pending=preview||result instanceof Promise;
 novaPageLoading.shell(valid==='home'&&pending&&(version===1||route().params.get('shell')==='1'));
 content.setAttribute('aria-busy',String(pending));
 content.innerHTML=pending?novaPageLoading.render(valid):result;
 if(result instanceof Promise)result.then(html=>{
  if(version!==pageRenderVersion)return;
  novaPageLoading.shell(false);setMenu(false);
  content.innerHTML=html;content.setAttribute('aria-busy','false');layoutChannelMasonry();
  if(currentChannel)content.scrollTop=channelFeedState(currentChannel.id).scroll;
 }).catch(()=>{
  if(version!==pageRenderVersion)return;
  novaPageLoading.shell(false);setMenu(false);
  content.setAttribute('aria-busy','false');
  content.innerHTML='<div class="quiet-empty" role="alert"><h2>暂时无法加载</h2><p>请稍后再试</p><button class="ds-button" data-retry-page>重新加载</button></div>';
  content.querySelector('[data-retry-page]').addEventListener('click',render);
 });
 document.querySelector('#global-search input').value=['search','community'].includes(valid)?(route().params.get('q')||''):'';
 layoutChannelMasonry();
 content.scrollTop=0;setMenu(false);document.querySelector('#account-menu')?.hidePopover();
 content.querySelector('.channel-nav [aria-current]')?.scrollIntoView({block:'nearest',inline:'nearest'});
 if(currentChannel)content.scrollTop=channelFeedState(currentChannel.id).scroll;
}
function setMenu(open){const drawer=document.querySelector('.product-sidebar');drawer.inert=matchMedia('(max-width:760px)').matches&&!open;document.querySelector('.product-sidebar').classList.toggle('menu-open',open);document.querySelector('.menu-scrim').hidden=!open;document.querySelector('.mobile-menu').setAttribute('aria-expanded',String(open));}
function hideGuide(hide){document.querySelector('#guide-card').hidden=hide;try{localStorage.setItem('nova-home-guide-hidden',String(hide))}catch{}}
function notify(message){const el=document.querySelector('.home-toast');el.textContent=message;el.hidden=false;clearTimeout(window.homeToast);window.homeToast=setTimeout(()=>el.hidden=true,3500);}
document.addEventListener('click',e=>{if(e.target.closest('[data-logout]')){document.querySelector('#account-menu').hidePopover();notify('当前为设计原型，未连接真实登录服务。');return;}if(e.target.closest('[data-menu]'))setMenu(!document.querySelector('.product-sidebar').classList.contains('menu-open'));const link=e.target.closest('a[href="#guide"], a[href^="#guide?"]');if(link&&route().page!=='guide'){guideOrigin=safeReturn(location.hash||'#home');try{sessionStorage.setItem('nova-guide-origin',guideOrigin)}catch{}}if(e.target.closest('[data-dismiss]')){hideGuide(true);document.querySelector('#account-trigger').focus();notify('入门指南已收起，可从右上角个人菜单打开。')}if(e.target.closest('[data-finish]')){hideGuide(true);location.hash='personal';notify('入门指南保留在个人菜单中。')}if(e.target.closest('[data-restore]')){hideGuide(false);notify('入门卡片已在侧栏显示。')}});
document.addEventListener('submit',e=>{if(['home-search','global-search'].includes(e.target.id)){e.preventDefault();if(e.target.id==='global-search'&&route().page==='community'){const params=new URLSearchParams(route().params);params.delete('post');params.delete('compose');const q=String(new FormData(e.target).get('query')||'').trim();if(q)params.set('q',q);else params.delete('q');const hash='#community'+(params.size?'?'+params.toString():'');if(location.hash===hash)render();else location.hash=hash;return}if(route().page!=='search'){searchOrigin=safeReturn(location.hash||'#home');try{sessionStorage.setItem('nova-search-origin',searchOrigin)}catch{}}const q=String(new FormData(e.target).get('query')||'');const hash='#search?q='+encodeURIComponent(q);if(location.hash===hash)render();else location.hash=hash;}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('#account-menu').matches(':popover-open')&&document.querySelector('.product-sidebar').classList.contains('menu-open')){setMenu(false);document.querySelector('.mobile-menu').focus()}});window.addEventListener('resize',()=>setMenu(document.querySelector('.product-sidebar').classList.contains('menu-open')));window.addEventListener('hashchange',()=>{render();content.focus({preventScroll:true})});try{guideOrigin=safeReturn(sessionStorage.getItem('nova-guide-origin')||'#personal');searchOrigin=safeReturn(sessionStorage.getItem('nova-search-origin')||'#home')}catch{}try{const saved=sessionStorage.getItem('nova-catalog-return');if(saved&&/^#(home|courses|articles|search)(\?|$)/.test(saved))lastCatalogRoute=saved}catch{}try{document.querySelector('#guide-card').hidden=false}catch{}render();

document.querySelector('#account-menu').addEventListener('toggle',e=>{document.querySelector('#account-trigger').setAttribute('aria-expanded',String(e.newState==='open'))});

document.querySelector('#account-menu').addEventListener('click',e=>{if(e.target.closest('a'))document.querySelector('#account-menu').hidePopover()});


function homeRankTrophy(rank){
 return `<span class="rank-glass-trophy rank-glass-trophy-${rank}" aria-hidden="true"></span>`;
}
function homeLeaderboardCard(){
 // Prototype entries; positions are illustrative, not live contribution totals.
 const people=[
  {name:'Bill',user:'u1893c18408cd28756062'},
  {name:'新岛Michelle',user:'zsxq_0f89aaaa02b67cd0e28c'},
  {name:'ASK',user:'zsxq_f8ce0f60d960b6492a91'}
 ];
 return `<section class="home-leaderboard" aria-labelledby="home-leaderboard-title"><header class="home-leaderboard-heading"><h2 id="home-leaderboard-title">岛民贡献榜</h2><a href="#ranking">查看全部</a></header><ol class="home-leaderboard-list">${people.map((person,index)=>`<li><a class="member-profile-link" href="#member?user=${person.user}" aria-label="查看 ${escapeHtml(person.name)} 的主页"><span class="home-leaderboard-rank" role="img" aria-label="第 ${index+1} 名">${homeRankTrophy(index+1)}</span><span class="home-leaderboard-avatar" aria-hidden="true">${escapeHtml(person.name.slice(0,1))}</span><div class="home-leaderboard-person"><strong class="home-leaderboard-name">${escapeHtml(person.name)}</strong><div class="home-leaderboard-stats"><span aria-label="发布 ${memberProfiles[person.user].total} 篇"><b>${memberProfiles[person.user].total}</b><small>发布</small></span><span aria-label="精华 ${memberProfiles[person.user].featured.length} 篇"><b>${memberProfiles[person.user].featured.length}</b><small>精华</small></span></div></div></a></li>`).join('')}</ol></section>`;
}
