// Editorial content for internal administrators; local prototype, independent of member forum posts.
// Production publishing authorization must be enforced by the server.
// Prototype account fixture. Replace with the authenticated session when a backend is connected.
// Never derive publishing privileges from URL parameters or browser storage.
const articleAccount = Object.freeze({role:'member'});
function canPublishArticles(){return articleAccount.role==='admin';}
function articleAccessDenied(){return `${heading('发布文章')}<div class="account-empty"><h2>仅管理员可发布文章</h2><p>你可以浏览文章，或前往论坛分享经验与想法。</p><a class="ds-button secondary" href="#articles">返回文章</a></div>`;}
let articleState={posts:[],draft:null};
try{const saved=JSON.parse(localStorage.getItem('nova-articles-v1')||'null');if(saved&&Array.isArray(saved.posts))articleState=saved;}catch{}
function saveArticles(next){if(!canPublishArticles()){notify('仅管理员可发布文章');return false;}try{localStorage.setItem('nova-articles-v1',JSON.stringify(next));articleState=next;return true;}catch{notify('保存失败，内容仍保留在编辑器中。');return false;}}
function articleItems(){return [...articleState.posts,...catalog.filter(p=>p.type==='article')].map(p=>({...p,featured:p.featured??homeFeaturedIds.includes(p.id),label:'文章',hideTypeBadge:true,articleTags:p.tags||p.channels.map(id=>channels.find(c=>c.id===id)?.name).filter(Boolean)}));}
function articlePage(){
 const params=route().params;
 if(params.has('compose'))return articleCompose();
 if(params.has('drafts'))return articleDrafts();
 if(params.has('post')){
  const p=articleState.posts.find(p=>p.id===params.get('post'));
  if(!p)return `${heading('文章不存在')}<a href="#articles">返回文章</a>`;
  return `<article class="catalog-reader article-published"><a class="reader-back" href="#articles">返回文章</a><h1>${escapeHtml(p.title)}</h1><div class="forum-meta"><span class="card-avatar">S</span><span>Sage</span></div><div class="forum-card-tags">${p.tags.map(t=>`<a href="#articles?tag=${encodeURIComponent(t)}">${escapeHtml(t)}</a>`).join('')}</div><div class="forum-body">${forumBody(p.body,p.images||[])}</div></article>`;
 }
 const tags=params.getAll('tag').filter(t=>t!=='全部');
 const featured=params.get('featured')==='1';
 const items=articleItems().filter(p=>(!featured||p.featured)&&(!tags.length||tags.some(t=>p.articleTags.includes(t))));
 return `<section class="forum-page article-page"><header class="forum-heading"><div><h1>文章</h1><p>由内容团队发布，分享值得阅读的观点、方法与实践。</p></div>${canPublishArticles()?'<a class="ds-button" href="#articles?compose=1">＋ 发布文章</a>':''}</header><div class="forum-layout"><div class="forum-feed-scroll" tabindex="0" role="region" aria-label="文章列表">${feedFilterToolbar(channels.map(c=>c.name),tags,'tag','articles')}${items.length?channelMasonry(items):`<div class="account-empty"><h2>${featured?'暂无符合条件的精选文章':'这个标签下还没有文章'}</h2><p>${featured?'试试其他标签，或取消精选筛选查看全部文章。':'内容团队发布后，相关文章会出现在这里。'}</p></div>`}${channelFeedFooter(items.length,items.length)}</div></div></section>`;
}
function articleCompose(){
 if(!canPublishArticles())return articleAccessDenied();
 return documentCompose('article',articleState.draft,channels.map(c=>c.name));
}
function articleDrafts(){
 if(!canPublishArticles())return articleAccessDenied();
 const d=articleState.draft;
 return `${heading('我的草稿','把还没写完的想法留在这里。')}${d?`<article class="forum-row"><a href="#articles?compose=1"><h2>${escapeHtml(d.title||'未命名草稿')}</h2><p>${escapeHtml(d.body||'正文尚未填写')}</p><span class="forum-read">继续编辑</span></a></article>`:`<div class="account-empty"><h2>还没有保存的草稿</h2><p>写作时会自动保存，可随时回来继续。</p><a class="ds-button" href="#articles?compose=1">开始写文章</a></div>`}`;
}
function articleDraft(form){const data=new FormData(form);return {title:String(data.get('title')||''),summary:String(data.get('summary')||''),body:String(data.get('body')||''),tags:data.getAll('tags').map(String),images:composeImages(form)};}
function saveArticleDraft(form){
 if(!canPublishArticles()||!form)return false;
 const draft=articleDraft(form),ok=saveArticles({...articleState,draft:draft.title.trim()||draft.body.trim()||draft.summary.trim()||draft.tags.length?draft:null});
 form.querySelector('#draft-status').textContent=ok?'草稿已保存到当前浏览器':'草稿未保存，请保留当前页面';
 form.querySelector('#forum-word-count').textContent=draft.body.length+' / 50000';
 form.querySelector('#forum-selected-tags').innerHTML=forumSelectedTags(draft.tags,channels.map(c=>c.name));
 return ok;
}
document.addEventListener('input',e=>{const form=e.target.closest('#article-compose');if(form&&['title','body','tags','summary'].includes(e.target.name))saveArticleDraft(form);});
document.addEventListener('submit',e=>{
 if(e.target.id!=='article-compose')return;
 e.preventDefault();if(!canPublishArticles()){notify('仅管理员可发布文章');return;}const d=articleDraft(e.target);
 if(!d.title.trim()||!d.body.trim()||!d.tags.length){const error=e.target.querySelector('#forum-error');error.hidden=false;error.textContent='请填写标题、正文，并至少选择一个标签。';const preview=e.target.querySelector('[data-preview-forum]');if(preview.getAttribute('aria-pressed')==='true')preview.click();if(!d.title.trim()||!d.body.trim())e.target.elements[!d.title.trim()?'title':'body'].focus();else e.target.querySelector('.forum-add-tag').focus();return;}
 const id='article-'+crypto.randomUUID();
 const post={...d,id,title:d.title.trim(),body:d.body.trim(),desc:d.summary.trim()||d.body.trim().slice(0,150),author:'Sage',type:'article',label:'文章',channels:channels.filter(c=>d.tags.includes(c.name)).map(c=>c.id),channelCover:false,cardHref:'#articles?post='+id,created:Date.now()};
 if(saveArticles({posts:[post,...articleState.posts],draft:null})){location.hash='articles?post='+id;notify('文章已发布到本地原型');}
});
