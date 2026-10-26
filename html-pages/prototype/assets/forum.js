// Local prototype forum: one atomic record for posts and the current draft.
const forumTopics=['工具使用','Agent / Skill','内容写作','网站搭建','学习路线','知识管理','职业发展','社区交流'];
const forumSeed=[{"id": "sample-report", "title": "我用 AI 写社会实践报告拿了一等奖：让结论有凭据", "body": "把走访记录与问卷作为依据，约束 AI 的结论，并保留可追溯的材料。原帖附 Skill 教程。", "author": "妙染", "topic": "内容写作", "sample": true, "source": "https://novaisland.cn/community/p_205214eafbaf48199dbe", "tags": ["内容写作", "Agent / Skill"]}, {"id": "sample-buddy", "title": "WorkBuddy 没有 token 了，日常 AI 任务怎么安排？", "body": "知识库、任务和办公都依赖同一个工具，额度耗尽后如何继续使用？原帖讨论工具额度与使用情况。", "author": "Endless", "topic": "工具使用", "sample": true, "source": "https://novaisland.cn/community/p_4ac004a88fe8440c9532", "tags": ["工具使用", "知识管理"]}, {"id": "sample-goals", "title": "把上百个准大一的问题，整理成一个目标判断 Skill", "body": "将“值得吗”“有必要吗”等困惑转换成明确目标与可执行的下一步。", "author": "化我", "topic": "Agent / Skill", "sample": true, "source": "https://novaisland.cn/community/p_7a23e848807f4d47a812", "tags": ["Agent / Skill", "学习路线"]}, {"id": "sample-career", "title": "求职复盘笔记", "body": "从城市、行业与岗位选择开始，复盘职业素养、资源积累和个人竞争力。", "author": "遇见韶华", "topic": "职业发展", "sample": true, "source": "https://novaisland.cn/community/p_bcbc945738e944078dd7", "tags": ["职业发展", "学习路线"]}, {"id": "sample-site", "title": "如何构建个人网页与学术博客：GitHub Pages 静态部署", "body": "用个人主页展示作品、记录学习与积累知识。原帖提供网站搭建思路与教程。", "author": "ASK", "topic": "网站搭建", "sample": true, "source": "https://novaisland.cn/community/p_7b812e66e183448d9fe5", "tags": ["网站搭建", "知识管理"]}];
let forumState={posts:[],draft:null},forumStorageWarning='';
try{const saved=JSON.parse(localStorage.getItem('nova-forum-v1')||'null');if(saved&&Array.isArray(saved.posts)){forumState.posts=saved.posts.filter(p=>p&&typeof p.id==='string'&&typeof p.title==='string'&&typeof p.body==='string');if(saved.draft&&typeof saved.draft.title==='string'&&typeof saved.draft.body==='string')forumState.draft=saved.draft;}}catch{forumStorageWarning='浏览器暂时无法读取已保存的帖子。';}
function forumSave(next){try{localStorage.setItem('nova-forum-v1',JSON.stringify(next));forumState=next;return true}catch{notify('保存失败：浏览器存储不可用或空间不足，正文仍保留在编辑器中。');return false}}
function forumMeta(p){return `<div class="forum-meta"><span class="card-avatar">${escapeHtml((p.author||'Sage').slice(0,1))}</span><span>${escapeHtml(p.author||'Sage')}</span><span>${escapeHtml((p.tags?.length?p.tags:[p.topic]).join(' / '))}</span><span>${p.sample?'线上内容摘要':new Date(p.created).toLocaleDateString('zh-CN')}</span>${postReadMeta(p)}</div>`;}
function forumRow(p){
 const author=p.author||'Sage';
 const tags=(p.tags?.length?p.tags:[p.topic]).filter(Boolean);
 return `<article class="forum-row"><div class="forum-meta"><span class="card-avatar">${escapeHtml(author.slice(0,1))}</span><span>${escapeHtml(author)}</span></div><a href="#community?post=${encodeURIComponent(p.id)}"><h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.body)}</p></a><div class="forum-card-tags" aria-label="帖子标签">${tags.map(tag=>`<a href="#community?topic=${encodeURIComponent(tag)}" data-filter-tag="${escapeHtml(tag)}" data-filter-key="topic" data-filter-page="community">${escapeHtml(tag)}</a>`).join('')}</div>${forumActions(p)}</article>`;
}
function forumActiveDiscussants(){
 const authors=new Map();
 [...forumState.posts,...forumSeed].forEach(post=>{
  const name=post.author||'Sage';
  const entry=authors.get(name)||{name,count:0,post};
  entry.count++;authors.set(name,entry);
 });
 const ranked=[...authors.values()].sort((a,b)=>b.count-a.count).slice(0,5);
 return `<aside class="forum-activity" aria-label="活跃讨论者"><section><header><h2>活跃讨论者</h2><p>按当前收录的发帖数排序</p></header><ol>${ranked.map(entry=>`<li><a href="#community?post=${encodeURIComponent(entry.post.id)}"><span class="card-avatar">${escapeHtml(entry.name.slice(0,1))}</span><span class="forum-activity-person"><strong>${escapeHtml(entry.name)}</strong><span>${escapeHtml(entry.post.title)}</span></span><small>${entry.count} 篇</small></a></li>`).join('')}</ol></section></aside>`;
}
function forumPage(){const params=route().params;if(params.has('compose'))return forumCompose();if(params.has('post'))return forumDetail(params.get('post'));const topics=params.getAll('topic').filter(t=>t!=='全部'),mine=params.get('mine')==='1',q=params.get('q')||'';const posts=[...forumState.posts,...(mine?[]:forumSeed)].filter(p=>(!topics.length||topics.some(t=>p.topic===t||(p.tags||[]).includes(t)))&&(!q||`${p.title} ${p.body}`.toLowerCase().includes(q.toLowerCase())));return `<section class="forum-page forum-discussions"><header class="forum-heading"><div><h1>论坛</h1><p>岛民的经验分享、学习记录与交流讨论。</p></div><a class="ds-button" href="#community?compose=1">＋ 发布帖子</a></header><div class="forum-layout"><div class="forum-feed-scroll" tabindex="0" role="region" aria-label="论坛帖子列表">${feedFilterToolbar(forumTopics,topics,'topic','community')}${posts.length?posts.map(forumRow).join(''):`<div class="account-empty"><h2>${q?'没有找到相关讨论':mine?'还没有发布帖子':'这个分类还没有讨论'}</h2><p>${q?'换个关键词试试，或看看全部讨论。':'分享一个问题、一次实践或你的新作品。'}</p><a class="ds-button secondary" href="${q?'#community':'#community?compose=1'}">${q?'查看全部':'写第一篇帖子'}</a></div>`}${channelFeedFooter(posts.length,posts.length)}</div>${forumActiveDiscussants()}</div></section>`;}
function forumCompose(){return documentCompose('forum',forumState.draft,forumTopics);}
function documentCompose(kind,draft,options){
 const article=kind==='article',d=draft||{title:'',body:'',tags:[]};
 const tags=d.tags||[d.topic],back=article?'#articles':'#community',publish=article?'发布文章':'发布帖子';
 return `<section class="forum-editor forum-document-editor" aria-label="${publish}"><header class="forum-compose-header"><a class="reader-back" href="${back}">← 返回${article?'文章':'论坛'}</a><a href="${article?'#articles?drafts=1':'#drafts'}">我的草稿</a></header><form id="${kind}-compose" novalidate><input type="hidden" name="images" value="${escapeHtml(JSON.stringify(d.images||[]))}"><label class="forum-required-field"><textarea class="forum-document-title" name="title" aria-label="标题" required maxlength="200" rows="2" placeholder="标题">${escapeHtml(d.title)}</textarea><span class="forum-title-required" aria-hidden="true">*</span></label><div class="forum-compose-tags"><div id="forum-selected-tags" class="forum-card-tags" data-wrap-tags>${forumSelectedTags(tags,options)}</div><button class="feed-filter-trigger forum-add-tag" type="button" popovertarget="forum-compose-tag-popover" aria-haspopup="dialog" aria-expanded="false">＋ 添加标签</button><div id="forum-compose-tag-popover" class="feed-filter-popover" popover="auto" role="dialog" aria-label="选择标签"><div class="feed-filter-search"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg><input type="search" placeholder="搜索标签" aria-label="搜索标签" autocomplete="off"></div><div class="feed-filter-options">${options.map(t=>`<label class="feed-filter-option"><input type="checkbox" name="tags" value="${escapeHtml(t)}" ${tags.includes(t)?'checked':''}><span>${escapeHtml(t)}</span></label>`).join('')}<p class="feed-filter-empty" hidden>没有匹配的标签</p></div><footer><button type="button" data-clear-compose-tags>清空</button><button type="button" class="ds-button" popovertarget="forum-compose-tag-popover" popovertargetaction="hide">完成</button></footer></div></div><label id="forum-body-label"><textarea class="forum-document-body" name="body" aria-label="正文" required maxlength="50000" rows="8" placeholder="分享你的想法、经验或问题…（必填）">${escapeHtml(d.body)}</textarea></label><div id="forum-preview" class="forum-body" hidden></div>${article?`<details class="article-compose-summary"><summary>摘要（选填）</summary><textarea name="summary" aria-label="摘要" maxlength="300" rows="2" placeholder="简要介绍内容；留空时自动从正文提取">${escapeHtml(d.summary||'')}</textarea></details>`:''}<div class="forum-format-tools" role="group" aria-label="正文排版"><input type="file" accept="image/png,image/jpeg,image/webp" multiple data-compose-image-file hidden><button type="button" data-compose-image aria-label="插入图片" title="插入图片"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/></svg></button><button type="button" data-format="bold" aria-label="加粗" title="加粗"><strong>B</strong></button><button type="button" data-format="heading" aria-label="小标题" title="小标题">H₂</button><button type="button" data-format="list" aria-label="列表" title="列表">☷</button><button type="button" data-format="quote" aria-label="引用" title="引用">❝</button><button type="button" data-preview-forum aria-pressed="false">预览正文</button></div><div class="forum-editor-status"><span id="draft-status" role="status">${draft?'已恢复本地草稿':'填写内容后自动保存草稿'}</span><span id="forum-word-count">${d.body.length} / 50000</span></div><p id="forum-error" role="alert" hidden></p><div class="forum-editor-actions"><button class="ds-button secondary" type="button" data-save-compose>保存草稿</button><button class="ds-button" type="submit">${publish}</button></div><p class="forum-note">发布为本地演示，不会发送到线上社区。</p></form></section>`;
}
function forumSelectedTags(tags,options=forumTopics){return tags.filter(t=>options.includes(t)).map(t=>`<button type="button" data-remove-compose-tag="${escapeHtml(t)}" aria-label="移除标签：${escapeHtml(t)}">${escapeHtml(t)} <span aria-hidden="true">×</span></button>`).join('');}
function forumAuthorCard(post){
 const author=post.author||'Sage';
 const posts=[...forumState.posts,...forumSeed].filter(p=>(p.author||'Sage')===author);
 const others=posts.filter(p=>p.id!==post.id);
 return `<aside class="forum-author-card" aria-label="作者信息"><p class="forum-author-label">关于作者</p><div class="forum-author-identity"><span class="card-avatar">${escapeHtml(author.slice(0,1))}</span><h2>${escapeHtml(author)}</h2></div><p class="forum-author-count">当前收录 ${posts.length} 篇帖子</p>${others.length?`<div class="forum-author-posts"><h3>作者的其他帖子</h3>${others.slice(0,3).map(p=>`<a href="#community?post=${encodeURIComponent(p.id)}">${escapeHtml(p.title)}</a>`).join('')}</div>`:''}</aside>`;
}
function forumDetail(id){const p=interactionPost(id);if(!p)return `${heading('帖子不存在')}<a href="#community" class="ds-button">返回论坛</a>`;return `<div class="forum-detail-layout"><article class="forum-detail"><div class="forum-back-space" aria-hidden="true"></div><h1>${escapeHtml(p.title)}</h1>${forumMeta(p)}<div class="forum-body">${forumBody(p.body,p.images||[])}</div>${p.source?`<a class="reader-back" href="${escapeHtml(p.source)}" target="_blank" rel="noopener">查看线上原帖</a><p class="forum-note">以上为原帖摘要，标题作了便于阅读的整理。</p>`:''}${forumActions(p)}${forumComments(p)}${!p.sample?`<div class="forum-detail-footer"><button type="button" class="forum-withdraw" data-withdraw="${escapeHtml(p.id)}">撤回为草稿</button></div>`:''}</article>${forumAuthorCard(p)}</div>`;}
function forumDrafts(){const d=forumState.draft;return `${heading('我的草稿','把还没写完的想法留在这里。')}${d?`<article class="forum-row"><span class="eyebrow">${escapeHtml(d.topic)}</span><a href="#community?compose=1"><h2>${escapeHtml(d.title||'未命名草稿')}</h2><p>${escapeHtml(d.body||'正文尚未填写')}</p><span class="forum-read">继续编辑</span></a></article>`:`<div class="account-empty"><h2>还没有保存的草稿</h2><p>写帖时会自动保存，可随时回来继续。</p><a class="ds-button" href="#community?compose=1">开始写帖</a></div>`}`;}
function forumDraftFrom(form){const d=new FormData(form);return {title:String(d.get('title')||''),body:String(d.get('body')||''),topic:String(d.getAll('tags')[0]||'社区交流'),tags:d.getAll('tags').map(String),images:composeImages(form)}}
function saveForumDraft(form){const draft=forumDraftFrom(form);const ok=forumSave({...forumState,draft:draft.title.trim()||draft.body.trim()||draft.tags.length?draft:null});document.querySelector('#draft-status').textContent=ok?'草稿已保存到当前浏览器':'草稿未保存，请保留当前页面';document.querySelector('#forum-word-count').textContent=draft.body.length+' / 50000';document.querySelector('#forum-selected-tags').innerHTML=forumSelectedTags(draft.tags);return ok;}
document.addEventListener('input',e=>{if(e.target.closest('#forum-compose')&&['title','body','tags'].includes(e.target.name))saveForumDraft(e.target.form)});
document.addEventListener('click',e=>{if(e.target.closest('[data-save-compose]')&&saveDocumentDraft(e.target.closest('form')))notify('草稿已保存');});
document.addEventListener('submit',e=>{if(e.target.id!=='forum-compose')return;e.preventDefault();const draft=forumDraftFrom(e.target);const title=draft.title.trim(),body=draft.body.trim();if(!title||!body){const error=document.querySelector('#forum-error');error.hidden=false;error.textContent='请填写标题和正文。';const preview=document.querySelector('[data-preview-forum]');if(preview.getAttribute('aria-pressed')==='true')preview.click();e.target.elements[!title?'title':'body'].focus();return}const post={id:crypto.randomUUID(),title,body,topic:draft.topic,tags:draft.tags,images:draft.images,author:'Sage',created:Date.now()};if(forumSave({posts:[post,...forumState.posts],draft:null})){location.hash='community?post='+post.id;notify('帖子已发布到本地原型')}});

function forumBody(text,images=[]){return text.split('\n').map(raw=>{const image=composeImageMarkup(raw,images);if(image!==null)return image;const line=escapeHtml(raw);return line.startsWith('## ')?'<h2>'+line.slice(3)+'</h2>':line.startsWith('&gt; ')?'<blockquote>'+line.slice(5)+'</blockquote>':line.startsWith('- ')?'<div>• '+line.slice(2)+'</div>':line.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');}).join('\n');}
document.addEventListener('click',e=>{const button=e.target.closest('[data-format]');if(button){const previewButton=document.querySelector('[data-preview-forum]');if(previewButton.getAttribute('aria-pressed')==='true')previewButton.click();const input=button.closest('form').querySelector('textarea[name=body]'),start=input.selectionStart,end=input.selectionEnd,selection=input.value.slice(start,end);const snippets={bold:'**'+(selection||'重点内容')+'**',heading:'\n## '+(selection||'小标题')+'\n',list:'\n- '+(selection||'列表项目')+'\n',quote:'\n> '+(selection||'引用内容')+'\n'};input.setRangeText(snippets[button.dataset.format],start,end,'select');input.focus();saveDocumentDraft(input.form)}const preview=e.target.closest('[data-preview-forum]');if(preview){const opened=preview.getAttribute('aria-pressed')!=='true';preview.setAttribute('aria-pressed',String(opened));preview.textContent=opened?'继续编辑':'预览正文';document.querySelector('#forum-body-label').hidden=opened;const box=document.querySelector('#forum-preview');box.hidden=!opened;box.innerHTML=forumBody(preview.closest('form').querySelector('textarea[name=body]').value,composeImages(preview.closest('form')))||'正文还没有内容。'}});

document.addEventListener('click',e=>{const button=e.target.closest('[data-withdraw]');if(!button)return;if(forumState.draft){notify('已有未完成草稿，请先发布或清空草稿再撤回。');return}const post=forumState.posts.find(p=>p.id===button.dataset.withdraw);if(post&&forumSave({posts:forumState.posts.filter(p=>p.id!==post.id),draft:{title:post.title,body:post.body,topic:post.topic,tags:post.tags||[post.topic],images:post.images||[]}})){location.hash='community?compose=1';notify('已撤回为草稿，内容完整保留')}});

// Per-browser reactions are separate from post/draft storage.
let forumReactions={};
try{const saved=JSON.parse(localStorage.getItem('nova-forum-reactions-v1')||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))forumReactions=saved}catch{}
// Demonstration replies and browser-local submissions are kept separate from source posts.
const forumDemoComments={
 'sample-report':[{author:'小林',body:'模拟评论：先整理走访记录，再让 AI 帮忙归纳，这个顺序很值得参考。'},{author:'阿禾',body:'模拟评论：想看看你是怎样核对报告里的引用和数据的。'}],
 'sample-buddy':[{author:'小林',body:'模拟评论：我会把资料整理和长文写作拆开，分别安排工具。'}],
 'sample-goals':[{author:'阿禾',body:'模拟评论：把问题改写成具体目标之后，下一步清楚多了。'}],
 'sample-career':[{author:'小林',body:'模拟评论：可以先选一个目标岗位，再逐项整理自己的项目经历。'}],
 'sample-site':[{author:'阿禾',body:'模拟评论：想先从一个简单的作品集页面开始实践。'}]
};
let forumLocalComments={};
try{const saved=JSON.parse(localStorage.getItem('nova-forum-comments-v1')||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved)){for(const [id,items] of Object.entries(saved))if(Array.isArray(items))forumLocalComments[id]=items.filter(c=>c&&typeof c.body==='string'&&typeof c.author==='string');}}catch{}
let forumCommentLikes={};
try{forumCommentLikes=JSON.parse(localStorage.getItem('nova-comment-likes-v1')||'{}')||{};}catch{}
for(const [postId,items] of Object.entries(forumLocalComments))items.forEach((c,i)=>{c.id ||= 'local-'+postId+'-'+(c.created||0)+'-'+i;});
for(const [postId,items] of Object.entries(forumDemoComments))items.forEach((c,i)=>{c.id='demo-'+postId+'-'+i;c.created=Date.parse('2026-09-20T15:00:00+08:00')-i*3600000;});
function forumCommentTime(value){const time=new Date(value).getTime();if(!Number.isFinite(time))return '时间未知';const minutes=Math.max(0,Math.floor((Date.now()-time)/60000));return minutes<1?'刚刚':minutes<60?minutes+' 分钟前':minutes<1440?Math.floor(minutes/60)+' 小时前':new Date(time).toLocaleDateString('zh-CN');}
function forumCommentLikeKey(p,c){return p.id+':'+c.id;}
function forumCommentItem(p,c,comments,depth=0){
 const own=(forumLocalComments[p.id]||[]).some(item=>item.id===c.id);
 const liked=!!forumCommentLikes[forumCommentLikeKey(p,c)];
 const count=Math.max(0,Math.floor(Number(c.likeCount)||0))+(liked?1:0);
 const replies=depth<10?comments.filter(item=>item.parentId===c.id):[];
 return `<article data-comment-id="${escapeHtml(c.id)}"><div class="forum-comment-author"><span class="card-avatar" aria-hidden="true">${escapeHtml((c.author||'岛民').slice(0,1))}</span><strong>${escapeHtml(c.author||'岛民')}</strong><time title="${escapeHtml(c.created?new Date(c.created).toLocaleString('zh-CN'):'时间未知')}">${forumCommentTime(c.created)}</time></div><p>${escapeHtml(c.body||'')}</p><div class="forum-comment-actions"><button type="button" data-comment-action="like" aria-label="${liked?'取消点赞':'点赞评论'}" aria-pressed="${liked}"><svg viewBox="0 0 24 24" width="18" height="18" fill="${liked?'currentColor':'none'}" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7 10v11H3V10h4Zm0 0 5-8c3 0 2 5 1 7h6a2 2 0 0 1 2 2l-2 8a2 2 0 0 1-2 2H7"/></svg><span>${count}</span></button><button type="button" data-comment-action="reply">回复</button>${own?'<button type="button" data-comment-action="delete">删除</button>':''}</div>${replies.length?`<div class="forum-comment-replies">${replies.map(reply=>forumCommentItem(p,reply,comments,depth+1)).join('')}</div>`:''}</article>`;
}
function forumCommentMarkup(p){const comments=forumCommentList(p);const ids=new Set(comments.map(c=>c.id));return comments.length?comments.filter(c=>!c.parentId||!ids.has(c.parentId)).map(c=>forumCommentItem(p,c,comments)).join(''):'<p>暂无评论，来分享你的想法吧。</p>';}
function refreshForumComments(p){
 const section=document.querySelector('#forum-comments');if(!section)return;
 section.querySelector('.forum-comment-list').innerHTML=forumCommentMarkup(p);
 section.querySelector('h2').textContent='评论'+(forumCommentCount(p)?' '+forumCommentCount(p):'');
 document.querySelectorAll('[data-forum-action="comment"]').forEach(button=>{if(button.dataset.postId===p.id){button.querySelector('span').textContent=button.closest('.forum-actions')?.dataset.compact==='true'?forumCommentCount(p):forumCommentCount(p)||'评论';button.setAttribute('aria-label','评论，'+forumCommentCount(p)+' 条');}});
}
document.addEventListener('click',e=>{
 const button=e.target.closest('[data-comment-action]');if(!button)return;
 const section=button.closest('.forum-comments'),form=section.querySelector('form');
 const post=interactionPost(form.dataset.commentPost);if(!post)return;
 const action=button.dataset.commentAction;
 if(action==='cancel'){delete form.dataset.replyTo;form.querySelector('label').textContent='写下你的评论';button.hidden=true;return;}
 const id=button.closest('[data-comment-id]').dataset.commentId;
 const comment=forumCommentList(post).find(c=>c.id===id);if(!comment)return;
 if(action==='reply'){form.dataset.replyTo=id;form.querySelector('label').textContent='回复 '+comment.author;form.querySelector('[data-comment-action="cancel"]').hidden=false;form.elements.comment.focus();return;}
 if(action==='like'){
  const key=forumCommentLikeKey(post,comment),next={...forumCommentLikes,[key]:!forumCommentLikes[key]};
  try{localStorage.setItem('nova-comment-likes-v1',JSON.stringify(next));}catch{notify('点赞保存失败，请重试');return;}
  forumCommentLikes=next;const liked=!!next[key];button.setAttribute('aria-pressed',String(liked));button.setAttribute('aria-label',liked?'取消点赞':'点赞评论');button.querySelector('svg').setAttribute('fill',liked?'currentColor':'none');button.querySelector('span').textContent=Math.max(0,Math.floor(Number(comment.likeCount)||0))+(liked?1:0);return;
 }
 if(action==='delete'){
  if(!(forumLocalComments[post.id]||[]).some(c=>c.id===id))return;
  const next={...forumLocalComments,[post.id]:forumLocalComments[post.id].filter(c=>c.id!==id).map(c=>c.parentId===id?{...c,parentId:comment.parentId||null}:c)};
  try{localStorage.setItem('nova-forum-comments-v1',JSON.stringify(next));}catch{notify('删除失败，请重试');return;}
  forumLocalComments=next;if(form.dataset.replyTo===id){delete form.dataset.replyTo;form.querySelector('label').textContent='写下你的评论';form.querySelector('[data-comment-action="cancel"]').hidden=true;}
  refreshForumComments(post);notify('评论已删除');
 }
});
function forumCommentList(p){return [...(forumLocalComments[p.id]||[]),...(Array.isArray(p.comments)?p.comments.map((c,i)=>({...c,id:c.id||'source-'+p.id+'-'+i})):[]),...(forumDemoComments[p.id]||[])];}
function forumCommentCount(p){const count=Number(p.commentCount);const originals=Array.isArray(p.comments)?p.comments.length:0;return Math.max(originals,Number.isFinite(count)?Math.max(0,Math.floor(count)):0)+(forumLocalComments[p.id]||[]).length+(forumDemoComments[p.id]||[]).length;}
function forumComments(p){const comments=forumCommentList(p);return `<section class="forum-comments" id="forum-comments" tabindex="-1"><h2>评论${forumCommentCount(p)?` ${forumCommentCount(p)}`:''}</h2><form class="forum-comment-form" data-comment-post="${escapeHtml(p.id)}"><label for="forum-comment-input">写下你的评论</label><textarea id="forum-comment-input" name="comment" rows="3" maxlength="2000" required placeholder="分享你的想法，或提出一个问题…"></textarea><div><button type="button" class="forum-reply-cancel" data-comment-action="cancel" hidden>取消回复</button><button class="ds-button primary" type="submit">发布评论</button></div></form><div class="forum-comment-list">${forumCommentMarkup(p)}</div></section>`;}
document.addEventListener('submit',e=>{
 const form=e.target;if(!form.matches('.forum-comment-form'))return;e.preventDefault();
 const input=form.elements.comment,body=input.value.trim();
 if(!body){input.setCustomValidity('请填写评论内容');input.reportValidity();return;}
 const post=interactionPost(form.dataset.commentPost);if(!post)return;
 const next={...forumLocalComments,[post.id]:[{id:crypto.randomUUID(),author:'Sage',body,created:Date.now(),parentId:forumCommentList(post).some(c=>c.id===form.dataset.replyTo)?form.dataset.replyTo:null},...(forumLocalComments[post.id]||[])]};
 try{localStorage.setItem('nova-forum-comments-v1',JSON.stringify(next));}catch{notify('评论保存失败，请保留输入内容后重试');return;}
 forumLocalComments=next;
 const section=form.closest('.forum-comments');section.outerHTML=forumComments(post);
 document.querySelectorAll('[data-forum-action="comment"]').forEach(button=>{if(button.dataset.postId===post.id){button.querySelector('span').textContent=forumCommentCount(post);button.setAttribute('aria-label','评论，'+forumCommentCount(post)+' 条');}});
 document.querySelector('#forum-comment-input')?.focus({preventScroll:true});notify('评论已发布到当前浏览器');
});
document.addEventListener('input',e=>{if(e.target.matches('#forum-comment-input'))e.target.setCustomValidity('');});
function articleReactionBurst(button,action){
 if(!button?.closest('.article-interactive-card,.catalog-reader,.forum-row,.forum-detail')||!['liked','saved'].includes(action)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const icon=button.querySelector('svg');if(!icon?.animate)return;
 const box=icon.getBoundingClientRect(),burst=document.createElement('span');
 burst.className='article-reaction-burst article-reaction-burst--'+action;
 burst.setAttribute('aria-hidden','true');
 burst.style.left=(box.left+box.width/2)+'px';burst.style.top=(box.top+box.height/2)+'px';
 document.body.append(burst);
 const animations=[icon.animate([{transform:'scale(1)'},{transform:'scale(.8)',offset:.18},{transform:'scale(1.2)',offset:.45},{transform:'scale(1)'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'})];
 const offsets=[[-24,-16],[-17,-31],[-5,-37],[10,-34],[24,-22],[29,-6],[-28,3]];
 offsets.forEach(([x,y],i)=>{
  const particle=document.createElement('i');burst.append(particle);
  const angle=action==='liked'?Math.atan2(x,-y)*180/Math.PI:25+i*47;
  animations.push(particle.animate([
   {transform:`translate(-50%,-50%) rotate(${angle}deg) scale(.2)`,opacity:0},
   {transform:`translate(calc(-50% + ${x*.45}px),calc(-50% + ${y*.6}px)) rotate(${angle}deg) scale(1)`,opacity:1,offset:.3},
   {transform:`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) rotate(${angle+(action==='saved'?65:8)}deg) scale(.9)`,opacity:.85,offset:.65},
   {transform:`translate(calc(-50% + ${x*1.15}px),calc(-50% + ${y+12}px)) rotate(${angle+(action==='saved'?125:18)}deg) scale(.3)`,opacity:0}
  ],{duration:700,delay:30+i*18,easing:'cubic-bezier(.22,.7,.36,1)',fill:'both'}));
 });
 Promise.all(animations.map(animation=>animation.finished.catch(()=>{}))).finally(()=>{burst.remove();animations.forEach(animation=>animation.cancel())});
}
function interactionArticles(){return [...new Map([...catalog,...startChannelCatalog].filter(p=>['article','external'].includes(p.type)).map(p=>[p.id,p])).values()]}
function interactionPost(id){return [...forumState.posts,...forumSeed,...interactionArticles()].find(p=>p.id===id)}
function interactionHref(p){return [...forumState.posts,...forumSeed].some(post=>post.id===p.id)?'#community?post='+encodeURIComponent(p.id):'#read/'+encodeURIComponent(p.id)}
function forumActions(p,compact=false){const state=forumReactions[p.id]||{};const baseSaves=Number(p.saveCount);const saves=(Number.isFinite(baseSaves)?Math.max(0,Math.floor(baseSaves)):0)+(state.saved?1:0);const baseLikes=Number(p.likeCount);const likes=(Number.isFinite(baseLikes)?Math.max(0,Math.floor(baseLikes)):0)+(state.liked?1:0);const icon=path=>`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;return `<div class="forum-actions" data-compact="${compact}" aria-label="内容互动"><button type="button" data-forum-action="liked" data-post-id="${escapeHtml(p.id)}" aria-label="${state.liked?'取消点赞':'点赞'}${likes>0?'，'+likes+' 人点赞':''}" aria-pressed="${!!state.liked}">${icon('<path d="M7 10v11H3V10h4Zm0 0 5-8c3 0 2 5 1 7h6a2 2 0 0 1 2 2l-2 8a2 2 0 0 1-2 2H7"/>')}<span>${compact?likes:likes>0?likes:'点赞'}</span></button><button type="button" data-forum-action="comment" data-post-id="${escapeHtml(p.id)}" aria-label="评论，${forumCommentCount(p)} 条">${icon('<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2v-10.5a9.5 9.5 0 0 1 19 0Z"/>')}<span>${compact?forumCommentCount(p):forumCommentCount(p)||'评论'}</span></button><button type="button" data-forum-action="saved" data-post-id="${escapeHtml(p.id)}" aria-label="${state.saved?'取消收藏':'收藏'}，${saves} 人收藏" aria-pressed="${!!state.saved}">${icon('<path d="M6 3h12v18l-6-4-6 4V3Z"/>')}<span>${compact?saves:saves>0?saves:'收藏'}</span></button><button type="button" data-forum-action="share" data-post-id="${escapeHtml(p.id)}">${icon('<path d="M12 16V3m-4 4 4-4 4 4M5 12v9h14v-9"/>')}<span>分享</span></button></div>`}
function forumSaved(){const posts=[...forumState.posts,...forumSeed,...interactionArticles()].filter(p=>forumReactions[p.id]?.saved);return `${heading('我的收藏','把值得再看的内容留在这里。')}${posts.length?posts.map(p=>`<article class="forum-row"><a href="${escapeHtml(interactionHref(p))}"><h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.desc||(Array.isArray(p.body)?p.body[0]:p.body)||'')}</p></a>${forumActions(p)}</article>`).join(''):accountEmpty('','还没有收藏内容','收藏的文章和论坛帖子会显示在这里。','#articles','浏览文章')}`}

document.addEventListener('click',async e=>{const button=e.target.closest('[data-forum-action]');if(!button)return;const id=button.dataset.postId,action=button.dataset.forumAction;const post=interactionPost(id);if(!post)return;if(action==='comment'){if(route().params.get('post')===id||route().page==='read/'+id){document.querySelector('#forum-comments')?.scrollIntoView({block:'start'});document.querySelector('#forum-comments')?.focus({preventScroll:true});}else {const href=interactionHref(post);location.hash=href+(href.includes('?')?'&':'?')+'comments=1'};return}if(action==='share'){const url=new URL(location.href);url.hash=interactionHref(post);try{await navigator.clipboard.writeText(url.href);notify('链接已复制')}catch{window.prompt('复制链接',url.href)}return}const previous=forumReactions[id]||{};const next={...forumReactions,[id]:{...previous,[action]:!previous[action]}};try{localStorage.setItem('nova-forum-reactions-v1',JSON.stringify(next));forumReactions=next;const container=button.closest('.forum-actions').parentElement;document.querySelectorAll('.forum-actions').forEach(bar=>{if(bar.querySelector('[data-post-id]')?.dataset.postId===id)bar.outerHTML=forumActions(post,bar.dataset.compact==='true')});const replacement=container.querySelector(`[data-forum-action="${action}"]`);replacement?.focus({preventScroll:true});if(next[id][action])articleReactionBurst(replacement,action)}catch{notify('保存失败，请检查浏览器存储是否可用。')}});

function filterTagTone(tag){
 return ({'工具使用':'blue','Agent / Skill':'blue','网站搭建':'blue','产品开发':'blue','技术进阶':'blue','内容写作':'red','内容创作':'red','社区交流':'red','工具与趋势':'red','学习路线':'green','知识管理':'green','从零入门':'green','职业发展':'yellow','商业变现':'yellow','工作提效':'yellow'})[tag]||'neutral';
}
function tagFilterButtons(options,selected,key){return ['全部',...options].map(t=>`<button type="button" data-filter-tag="${escapeHtml(t)}" data-filter-key="${key}" data-filter-tone="${filterTagTone(t)}" aria-pressed="${t==='全部'?!selected.length:selected.includes(t)}">${escapeHtml(t)}</button>`).join('');}
document.addEventListener('click',e=>{
 const button=e.target.closest('[data-filter-tag]');if(!button)return;
 if(e.button>0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 e.preventDefault();
 const current=route(),page=button.dataset.filterPage||current.page;
 const params=page===current.page?new URLSearchParams(current.params):new URLSearchParams();
 const key=button.dataset.filterKey,tag=button.dataset.filterTag;
 params.delete('post');params.delete('compose');
 let selected=params.getAll(key).filter(t=>t!=='全部');
 selected=tag==='全部'?[]:selected.includes(tag)?selected.filter(t=>t!==tag):[...selected,tag];
 params.delete(key);selected.forEach(t=>params.append(key,t));
 const query=params.toString();location.hash=page+(query?'?'+query:'');
});

// Prototype-only totals: a post is counted once per browser tab session.
const postReadMemory=new Map(),postReadSession=new Set();
function postReadCount(post){
 const id=String(post.id),key='nova-post-reads-v1:'+id,sessionKey='nova-post-read-session-v1:'+id;
 const base=Number.isFinite(Number(post.viewCount))?Math.max(0,Math.floor(Number(post.viewCount))):0;
 let count=postReadMemory.get(id)||0,seen=postReadSession.has(id);
 try{count=Math.max(count,Number(localStorage.getItem(key))||0);seen=seen||sessionStorage.getItem(sessionKey)==='1'}catch{}
 if(!seen){count++;postReadSession.add(id);try{localStorage.setItem(key,String(count));sessionStorage.setItem(sessionKey,'1')}catch{}}
 postReadMemory.set(id,count);
 return base+count;
}
function postReadMeta(post){
 const count=postReadCount(post);
 return `<span class="post-read-count" aria-label="阅读 ${count} 次"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span>${count.toLocaleString('zh-CN')}</span></span>`;
}

document.addEventListener('click',e=>{const button=e.target.closest('[data-remove-compose-tag]');if(!button)return;const form=button.closest('form');for(const input of form.querySelectorAll('input[name=tags]'))if(input.value===button.dataset.removeComposeTag)input.checked=false;saveDocumentDraft(form);form.querySelector('.forum-add-tag').focus();});

document.addEventListener('click',e=>{if(!e.target.closest('[data-clear-compose-tags]'))return;const form=e.target.closest('form');form.querySelectorAll('input[name=tags]').forEach(input=>input.checked=false);saveDocumentDraft(form);});

document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('#forum-compose-tag-popover input[type=search]'))e.preventDefault();});

function saveDocumentDraft(form){return form?.id==='article-compose'?saveArticleDraft(form):saveForumDraft(form);}
