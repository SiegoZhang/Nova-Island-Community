// Prototype catalog. Descriptions are excerpts, not full articles.
const channels = [
  {id:'start',name:'从零入门',description:'认识 AI，开始第一次实践'},
  {id:'work',name:'工作提效',description:'用 AI 提升日常工作效率'},
  {id:'build',name:'产品开发',description:'把想法做成可用的产品'},
  {id:'create',name:'内容创作',description:'用 AI 创作图文、声音与视频'},
  {id:'business',name:'商业变现',description:'从真实需求到商业验证'},
  {id:'tech',name:'技术进阶',description:'探索模型与智能体的原理'},
  {id:'tools',name:'工具与趋势',description:'发现工具，读懂趋势'}
];
const catalog = [
  {"id": "workflow-course", "title": "新岛8月AI自媒体实战", "desc": "7 天实战、4 场直播，结合 Obsidian、Codex 和 WorkBuddy，从整理个人素材到内容写作、真实发布与复盘，搭建自己的内容创作系统。", "author": "新岛", "type": "course", "channels": ["create", "work", "start"], "label": "课程", "meta": "7 天实战 · 4 场直播", "image": "assets/original-media/aa91b1edb8204b5787937bf475163519.webp", "sourceImage": "https://novaisland.cn/media/2026/09/14/aa91b1edb8204b5787937bf475163519.webp", "cardHref": "https://xmlaj.xetlk.com/s/10cM6L", "sourceHref": "https://novaisland.cn/community/courses", "keywords": "AI 自媒体 写作 Obsidian Codex WorkBuddy"},
  {"id": "ai-video-course", "title": "新岛7月AI剪辑实战", "desc": "何锦成带练，3 节系统课程 + 6 个业务级 Skill，从零基础口播素材到高级感成片，练习视频剪辑、复刻与实操。", "author": "何锦成", "type": "course", "channels": ["create", "start"], "label": "课程", "meta": "3 节系统课程 · 6 个 Skill", "image": "assets/original-media/e1daaa5216f947b7a6dbb28d7fbb7d9f.webp", "sourceImage": "https://novaisland.cn/media/2026/09/14/e1daaa5216f947b7a6dbb28d7fbb7d9f.webp", "cardHref": "https://xmlaj.xetlk.com/s/22FVwk", "sourceHref": "https://novaisland.cn/community/courses", "keywords": "AI 剪辑 视频 口播 Skill"},
  {id:'build',title:'没有代码基础，也能搭建个人网站：从第一版开始',desc:'把作品介绍、个人经历和联系方式整理好，用 AI 搭出第一个可打开的网站。',author:'ASK',type:'external',channels:['build','start'],sourceImage:'https://novaisland.cn/media/import/zsxq/a4f60b0bc9a3dc9691316473d6e926095e2ca2c29e4d8a3669bdaaa40423ded9.png',image:'assets/original-media/a4f60b0bc9a3dc9691316473d6e926095e2ca2c29e4d8a3669bdaaa40423ded9.png',sourceHref:'https://novaisland.cn/community/p_7b812e66e183448d9fe5',label:'外部教程',meta:'AI 编程',keywords:'网站 产品开发 编程'},
  {id:'obsidian',channelCover:false,title:'如何把微信上的内容导入 Obsidian，附一键同步方案',desc:'把微信中的文章、文字与文件送进 Obsidian，整理为可搜索的个人知识库。',author:'Bill',type:'external',channels:['work','tools'],cover:'notes',label:'外部教程',meta:'知识管理',keywords:'微信 同步 笔记 知识库'},
  {id:'memory',title:'AI 说“我记住了”，它到底记住了什么？',desc:'理解上下文与记忆的区别，知道哪些信息需要主动保存，以及怎样整理自己的知识库。',author:'新岛Michelle',type:'article',channels:['tech'],cover:'memory',label:'文章',meta:'RAG / Memory',keywords:'知识馆 上下文 记忆 知识库'},
  {id:'english',channelCover:false,title:'把 ChatGPT 调成你的英语口语教练，只需这套提示词',desc:'从跟读、情境对话到纠错，把一次口语练习拆成可以直接开始的步骤。',author:'Bill',type:'external',channels:['start','work'],cover:'voice',label:'外部教程',meta:'提示词',keywords:'学习 英语 提问 ChatGPT'},
  {"id": "report", "title": "我用 AI 写社会实践报告拿了一等奖，靠的不是它写得好，是它不敢瞎写", "desc": "AI 会写结论，但不留凭据。一个面向调研报告的 Skill，让结论回到实地材料。", "author": "妙染", "type": "article", "channels": ["create"], "label": "文章", "meta": "内容写作", "sourceHref": "https://novaisland.cn/community/p_205214eafbaf48199dbe", "body": ["我用 AI 写社会实践报告拿了一等奖，靠的不是它写得好，是它不敢瞎写", "你走访了五家企业，录了八小时音，发了两百份问卷。让 AI 起草调研报告，它交回来一篇「随着乡村振兴战略深入推进……建议加大扶持力度、完善长效机制」。实地材料一句都没进去。", "更隐蔽的是另一种。五家里三家提到同一个问题，AI 写成「80% 的受访企业普遍面临」，读着很专业。答辩时评委问一句「这个比例的分母是什么」，现场就下不来台。", "根本原因是同一个，AI 会写结论，但不留凭据。\n所以我做了一个skill，一个专门写挑战杯、三下乡、返乡实践这类调研报告的Skill。我用它写的社会实践报告，拿了一等奖。\n它干的事很简单，就是不让 AI 多写，只让它少说没凭据的话。", "详细skill内容看这里↓"], "channelCover": false, "relatedLinks": [{"label": "查看作者的调研报告 Skill", "href": "https://gcn56uh65831.feishu.cn/docx/PM7bdyQygoMa4mx7zh2cN0Sznvd"}]},
  {id:'workflow-article',channelCover:false,title:'让 AI 工作流真正落地：从一个具体问题开始',desc:'先定义好的结果，再搭建最小工作闭环，把人的判断留在流程里。',author:'林然',type:'article',channels:['work','build'],cover:'process',label:'文章',meta:'实践方法',href:'article.html',keywords:'工作流 AI 方法 文章'},
  {id:'work',channelCover:false,title:'每天都在用 AI，不代表你真的会用 AI',desc:'用五个能力观察点对照最近完成的工作，找到下一步最值得补齐的能力。',author:'Bill',type:'external',channels:['start','tools'],cover:'review',label:'外部教程',meta:'认知成长',keywords:'能力 工具 使用'},
  {id:'buddy',title:'work Buddy没有token啦！',desc:'我的AI知识库、任务、办公基本都是在这上面搞，为何？token要多点。3000的没了[流泪]',author:'Endless',type:'article',channels:['tools','work'],image:'assets/workbuddy-original-1.png',originalImage:true,label:'文章',meta:'工具使用',sourceHref:'https://novaisland.cn/community/p_4ac004a88fe8440c9532',body:['work Buddy没有token啦！','我的AI知识库、任务、办公基本都是在这上面搞，为何？token要多点','3000的没了[流泪]','有没有还没有注册的小伙伴，扫描注册咱们一块得2000token'],images:[{src:'assets/workbuddy-original-1.png',width:750,height:1110,alt:'WorkBuddy 原帖配图：AI 办公伙伴介绍与邀请二维码'},{src:'assets/workbuddy-original-2.png',width:2450,height:1610,alt:'WorkBuddy 原帖配图 2'},{src:'assets/workbuddy-original-3.png',width:622,height:837,alt:'WorkBuddy 原帖配图 3'}],keywords:'WorkBuddy token 额度 工具 任务 办公'}
];
// Selected forum posts: original text, author attribution, and source links.
catalog.push({"id": "forum-goal-check", "title": "上百个准大一的问题，我把判断整理成了一个skill", "desc": "把「我怎么办」翻译成「我要什么」，把拖延、畏难和纠结变成可执行的动作。", "author": "化我", "type": "article", "channels": ["start", "tools"], "label": "文章", "meta": "Agent / Skill", "sourceHref": "https://novaisland.cn/community/p_7a23e848807f4d47a812", "body": ["解决的问题是找到目标。」问「值得吗」「有必要吗」「帮助大吗。把「我怎么办」翻译成「我要什么」。把拖延、畏难、纠结该不该变成可执行的动作。", "用workbuddy，codex，豆包，把以下这段话复制给他。帮我安装npx -y skills add leo485610395-cmyk/huawo-skill -g -s huawo-goal-check", "进入对话/huawo-goal-check使用，如果有他也不能解决的问题。欢迎大家随时来找我。"], "channelCover": false},
{"id": "forum-codex-login", "title": "codex无法登录", "desc": "首次启动遇到套接字权限报错，Viskey 分享了排查 Docker、Hyper-V 与 WinNAT 端口保留冲突的经历。", "author": "Viskey", "type": "article", "channels": ["tools", "tech"], "label": "文章", "meta": "AI 编程", "sourceHref": "https://novaisland.cn/community/p_ed10b80e28fa4b029a4e", "body": ["#新岛朋友圈\ncodex无法登录\n首次启动出现：以一种访问权限不允许的方式做了一个访问套接字的尝试\n换了好几种办法，开加速器、换代理都没有用，最后问了AI，发现安装了Docker,开启Hyper-V虚拟机后windows系统，WinNAT会自动保留一段端口号，其中刚好有codex要用的端口就会报错\n解决办法：\n以管理员身份打开powershell\n输入：\nnet stop winnat\nnet start winnat\n然后重启codex就可以了"], "image": "assets/codex-login-original-1.png", "originalImage": true, "images": [{"src": "assets/codex-login-original-1.png", "width": 1622, "height": 1127, "alt": "Viskey 原帖配图：Codex 登录问题"}, {"src": "assets/codex-login-original-2.png", "width": 550, "height": 195, "alt": "Viskey 原帖配图：问题排查截图"}]},
{"id": "forum-learn-ai", "title": "说想学 AI 的人，十个有九个学不会。", "desc": "从一个需要 AI 解决的具体问题开始，把「想学 AI」变成做网站、改稿子、查资料。", "author": "化我", "type": "article", "channels": ["start"], "label": "文章", "meta": "学习讨论", "sourceHref": "https://novaisland.cn/community/p_5f3f189fdff245f3b910", "body": ["说想学 AI 的人，十个有九个学不会。", "你问他们为什么是 AI 不是剪辑，不是英语，不是做饭？", "答不上来。", "去年火的是短视频，他们会说想学短视频。明年火了别的，他们还会追。词在换，人没变，永远停在「想学」。", "「不知道从哪开始」——这句话你熟吧。", "听起来是问信息：给我个入口，我就能开始。", "B 站搜李宏毅，第一节。入口给你了。", "开始了吗？没有。", "因为你缺的不是入口，是一个要 AI 解决的事。没有事，给你一千个入口你也走不进去。火的词换得再快，你也只是换一个挂着的词，不会多走一步。", "你看真正在用 AI 的人怎么说话。", "他们不说「我想学 AI」。", "他们说：我在用 AI 做我的网站。 他们说：我在用 AI 改我的稿子。 他们说：我在用 AI 帮我查资料。", "他们都有事。事在前，AI 在后。", "你说「我想学 AI」根本没做事。", "没有事，AI 就没地方用。没地方用，你就学不会。", "那你为什么偏说「我想学 AI」，不说「我什么都不想干」？", "因为「我想学 AI」听着像挂上了一件事。有了它，你就有了一个假装在努力的理由。", "这个「想学」，是不想干，又不想承认。所以你不应该去学 AI，应该先解决下心理问题"], "channelCover": false});
// Original prototype examples for the business channel; not published member posts.
catalog.push(
 {id:'business-demand',title:'先验证需求，再做产品：找到第一个愿意付费的人',desc:'从具体人群和高频问题开始，用一次访谈和一个小样，判断你的方案是否值得继续投入。',author:'新岛',type:'article',channels:['business'],label:'文章',meta:'需求验证',channelCover:false},
 {id:'business-service',channelCover:false,title:'把 AI 能力做成一项可以交付的服务',desc:'明确服务对象、交付范围和验收标准，把模糊的“我会用 AI”变成客户能够理解的服务。',author:'新岛',type:'article',channels:['business'],label:'文章',meta:'服务交付',cover:'process',illustration:true},
 {id:'business-pricing',title:'第一次接单，如何说明报价与修改范围？',desc:'把交付内容、沟通节点、修改次数与后续维护写清楚，让双方在开始前对结果形成一致预期。',author:'新岛',type:'article',channels:['business'],label:'文章',meta:'报价方法',channelCover:false},
 {id:'business-review',channelCover:false,title:'完成第一单之后，复盘哪些事情？',desc:'记录投入时间、沟通成本与客户反馈，找到可以复用的步骤，为下一次交付做好准备。',author:'新岛',type:'article',channels:['business'],label:'文章',meta:'商业验证',cover:'writing',illustration:true}
);
// Shared editorial selection used by home recommendations and the news filter.
const homeFeaturedIds=['workflow-course','report','buddy','forum-goal-check','forum-codex-login','forum-learn-ai'];
function contentTypeLabel(item){
 if(item.type==='external'||item.label==='外部教程')return '外部教程';
 return ({article:'文章',course:'课程',forum:'论坛',community:'论坛',event:'活动',practice:'实战'})[item.type]||(['文章','课程','论坛','活动','实战'].includes(item.label)?item.label:'文章');
}
function contentTypeTone(item){return ({'文章':'blue','课程':'purple','论坛':'yellow','活动':'red','外部教程':'red','实战':'yellow'})[contentTypeLabel(item)];}
function contentTypeBadge(item){
 if(item.hideTypeBadge)return '';
 const label=contentTypeLabel(item);
 const tone=contentTypeTone(item);
 return `<span class="content-type-badge" data-tone="${tone}">${label}</span>`;
}
// Only render actual source media; entries without a verified image remain text cards.
function coverMarkup(item) {
 const image=item.image||item.sourceImage;
 if(!image)return '';
 return `<div class="content-cover channel-photo original-photo"><img src="${escapeHtml(image)}" alt="${escapeHtml(item.title)} · ${item.type==='course'?'课程封面':'原帖配图'}" loading="lazy" decoding="async" width="640" height="400"></div>`;
}

function contentCard(item) {
 if(['article','external'].includes(item.type))return channelCard(item);
 return `<a class="content-card" href="${escapeHtml(item.cardHref||(item.href?item.href+'?return='+encodeURIComponent(location.hash||'#home'):'#read/'+item.id))}" data-content-id="${item.id}">${coverMarkup(item)}<div class="card-body">${contentTypeBadge(item)}<h3>${item.title}</h3><div class="card-meta"><span class="card-avatar">${item.author.slice(0,1)}</span><span>${item.author}</span>${item.type!=='course'?`<span class="card-meta-end">${item.meta}</span>`:''}</div></div></a>`;
}
function contentGrid(items){return `<div class="content-grid">${items.map(contentCard).join('')}</div>`;}
function channelNav(active='recommended') {
 return `<nav class="channel-nav" aria-label="内容频道"><a href="#home" ${active==='recommended'?'aria-current="page"':''}>推荐</a>${channels.map(c=>`<a href="#home?channel=${c.id}" ${active===c.id?'aria-current="page"':''}>${c.name}</a>`).join('')}</nav>`;
}
function catalogMatches(q){const words=q.toLowerCase().trim().split(/\s+/).filter(Boolean);return catalog.filter(p=>words.every(w=>[p.title,p.desc,p.author,p.keywords,p.label,...p.channels.map(id=>channels.find(c=>c.id===id).name)].join(' ').toLowerCase().includes(w)));}

// Channel feeds allow image and text entries to retain their natural heights.
function channelMasonry(items) {
 return `<div class="channel-masonry" id="channel-feed">${items.map(channelCard).join('')}</div>`;
}
function channelCard(item) {
  const hasCover=Boolean(item.image||item.sourceImage)&&item.channelCover!==false;
  const articleTone=hasCover?'':` article-tone-${contentTypeTone(item)}`;
  const href=item.cardHref||(item.href?item.href+'?return='+encodeURIComponent(location.hash||'#home'):'#read/'+item.id);
  const interactive=['article','external'].includes(item.type);
  const card=`<a class="content-card channel-card ${hasCover?'channel-card-image':'channel-card-text'}${articleTone}" href="${escapeHtml(href)}" data-content-id="${escapeHtml(item.id)}">${hasCover?coverMarkup(item):''}<div class="card-body">${contentTypeBadge(item)}<h3>${escapeHtml(item.title)}</h3><p class="channel-card-description">${escapeHtml(item.desc)}</p><div class="card-meta"><span class="card-avatar">${escapeHtml(item.author.slice(0,1))}</span><span>${escapeHtml(item.author)}</span></div>${item.articleTags?`<div class="forum-card-tags" aria-label="文章标签">${item.articleTags.map(tag=>`<span class="article-tag">${escapeHtml(tag)}</span>`).join('')}</div>`:''}</div></a>`;
  if(!interactive)return card;
  // Author and actions share a footer outside the article's reading link.
  const meta=card.match(/<div class="card-meta">.*?<\/div>/)?.[0]||'';
  const footer=`<div class="article-card-footer">${meta}${forumActions(item,true)}</div>`;
  const body=card.replace(meta,'').replace(/^<a class="([^"]+)" href="([^"]+)" data-content-id="([^"]+)">/, '<article class="$1 article-interactive-card" data-content-id="$3"><a class="article-card-link" href="$2">').replace(/<\/a>$/, '</a>'+footer+'</article>');
  return body;
}

let channelLayoutObserver;
let channelLayoutFrame;
function layoutChannelMasonry() {
 channelLayoutObserver?.disconnect();
 cancelAnimationFrame(channelLayoutFrame);
 const grid=document.querySelector('.channel-masonry');
 if(!grid)return;
 const cards=[...grid.children];
 const layout=()=>{
  const style=getComputedStyle(grid);
  const columns=style.gridTemplateColumns.split(' ').length;
  const gap=parseFloat(style.getPropertyValue('--masonry-gap'))||20;
  const heights=Array(columns).fill(0);
  const placements=cards.map(card=>{
   const column=heights.indexOf(Math.min(...heights));
   const row=heights[column]+1;
   const span=Math.ceil(card.getBoundingClientRect().height+gap);
   heights[column]+=span;
   return {card,column,row,span};
  });
  placements.forEach(({card,column,row,span})=>{
   card.style.gridColumn=String(column+1);
   card.style.gridRow=`${row} / span ${span}`;
  });
 };
 layout();
 channelLayoutObserver=new ResizeObserver(()=>{
  cancelAnimationFrame(channelLayoutFrame);
  channelLayoutFrame=requestAnimationFrame(layout);
 });
 channelLayoutObserver.observe(grid);
 cards.forEach(card=>channelLayoutObserver.observe(card));
}

const CHANNEL_BATCH_SIZE=12;
let channelFeedStates={};
try {channelFeedStates=JSON.parse(sessionStorage.getItem('nova-channel-feeds')||'{}')||{}}catch{}
function channelItems(id){
 if(id==='start')return startChannelCatalog;
 const items=catalog.filter(item=>item.channels.includes(id));
 if(id==='business')return [...startChannelCatalog.filter(item=>['p_32850d4c8bda432493c6','p_2c3743339455463abaec'].includes(item.id)),...items];
 return items;
}
function channelFeedState(id){
 const saved=channelFeedStates[id]||{};
 return {count:Number.isFinite(saved.count)?Math.max(CHANNEL_BATCH_SIZE,saved.count):CHANNEL_BATCH_SIZE,scroll:Number.isFinite(saved.scroll)?Math.max(0,saved.scroll):0};
}
function persistChannelFeeds(){try{sessionStorage.setItem('nova-channel-feeds',JSON.stringify(channelFeedStates))}catch{}}
function saveChannelPosition(){
 const grid=document.querySelector('.channel-masonry[data-channel]');
 if(!grid)return;
 const id=grid.dataset.channel;
 channelFeedStates[id]={count:grid.children.length,scroll:document.querySelector('#content').scrollTop};
 persistChannelFeeds();
}
function channelFeedFooter(count,total){
 return `<div class="channel-feed-footer"><button type="button" class="ds-button secondary" data-load-channel aria-controls="channel-feed" ${count>=total?'hidden':''}>加载更多</button><span class="channel-feed-end" ${count<total?'hidden':''}>已经看完全部内容</span></div>`;
}
function channelFeed(items,id){
 const count=Math.min(channelFeedState(id).count,items.length);
 return channelMasonry(items.slice(0,count)).replace('id="channel-feed"',`id="channel-feed" data-channel="${id}"`)+channelFeedFooter(count,items.length);
}
async function loadMoreChannel(automatic=false){
 const grid=document.querySelector('.channel-masonry[data-channel]');
 if(!grid)return;
 const button=document.querySelector('[data-load-channel]');
 if(!button||button.disabled)return;
 const items=channelItems(grid.dataset.channel),count=grid.children.length;
 const next=items.slice(count,count+CHANNEL_BATCH_SIZE);
 if(!next.length)return;
 button.disabled=true;
 if(grid.dataset.channel==='start'){
  const loading=document.createElement('div');loading.className='channel-loading-cards';loading.setAttribute('role','status');loading.setAttribute('aria-label','正在加载更多内容');
  loading.innerHTML=next.map(()=>'<div class="skeleton-card" aria-hidden="true"><span class="skeleton-block skeleton-cover"></span><div class="skeleton-card-body"><span class="skeleton-block skeleton-line title"></span><span class="skeleton-block skeleton-line"></span><span class="skeleton-block skeleton-line medium"></span><div class="skeleton-meta"><span class="skeleton-block skeleton-avatar"></span><span class="skeleton-block skeleton-line short"></span></div></div></div>').join('');
  grid.after(loading);grid.setAttribute('aria-busy','true');
  await new Promise(resolve=>setTimeout(resolve,400));
  if(!grid.isConnected){loading.remove();return;}
  loading.remove();grid.removeAttribute('aria-busy');
 }
 const oldScroll=document.querySelector('#content').scrollTop;
 grid.insertAdjacentHTML('beforeend',next.map(channelCard).join(''));
 layoutChannelMasonry();
 const footer=document.querySelector('.channel-feed-footer');
 const shown=grid.children.length;
 button.disabled=false;
 button.hidden=shown>=items.length;
 footer.querySelector('.channel-feed-end').hidden=shown<items.length;
 // Keep keyboard navigation at the first newly appended card without scrolling it into view.
 if(!automatic)grid.children[count].focus({preventScroll:true});
 document.querySelector('#content').scrollTop=oldScroll;
 saveChannelPosition();
}
document.addEventListener('click',e=>{if(e.target.closest('[data-load-channel]'))loadMoreChannel()});
window.addEventListener('pagehide',saveChannelPosition);

// The start channel loads at the end of the current batch without moving focus.
(()=>{
 let activeGrid=null,observer=null;
 function connect(){
  const grid=document.querySelector('.channel-masonry[data-channel="start"]');
  if(grid===activeGrid)return;
  observer?.disconnect();activeGrid=grid;if(!grid)return;
  const footer=grid.nextElementSibling;
  observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)&&!footer.querySelector('[data-load-channel]').hidden)loadMoreChannel(true);
  },{root:document.querySelector('#content'),threshold:0,rootMargin:'0px 0px 80px 0px'});
  observer.observe(footer);
 }
 new MutationObserver(connect).observe(document.querySelector('#content'),{childList:true,subtree:true});
 connect();
})();
