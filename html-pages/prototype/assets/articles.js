// Article publishing is a local prototype, independent of forum posts.
let articleState={posts:[],draft:null};
try{const saved=JSON.parse(localStorage.getItem('nova-articles-v1')||'null');if(saved&&Array.isArray(saved.posts))articleState=saved;}catch{}
function saveArticles(next){try{localStorage.setItem('nova-articles-v1',JSON.stringify(next));articleState=next;return true;}catch{notify('保存失败，内容仍保留在编辑器中。');return false;}}
function articleItems(){return [...articleState.posts,...catalog.filter(p=>p.type!=='course')].map(p=>({...p,articleTags:p.tags||p.channels.map(id=>channels.find(c=>c.id===id)?.name).filter(Boolean)}));}
function articlePage(){
 const params=route().params;
 if(params.has('compose'))return articleCompose();
 if(params.has('post')){
  const p=articleState.posts.find(p=>p.id===params.get('post'));
  if(!p)return `${heading('文章不存在')}<a href="#articles">返回文章</a>`;
  return `<article class="catalog-reader"><a class="reader-back" href="#articles">返回文章</a><h1>${escapeHtml(p.title)}</h1><div class="forum-meta"><span class="card-avatar">S</span><span>Sage</span></div><div class="forum-card-tags">${p.tags.map(t=>`<a href="#articles?tag=${encodeURIComponent(t)}">${escapeHtml(t)}</a>`).join('')}</div><div class="article-published-body">${escapeHtml(p.body)}</div></article>`;
 }
 const tags=params.getAll('tag').filter(t=>t!=='全部');
 const items=articleItems().filter(p=>!tags.length||tags.some(t=>p.articleTags.includes(t)));
 return `<section class="forum-page article-page"><header class="forum-heading"><div><h1>资讯</h1><p>分享方法、记录实践，把经验整理成文章。</p></div><a class="ds-button" href="#articles?compose=1">＋ 发布资讯</a></header><div class="forum-layout"><div class="forum-feed-scroll" tabindex="0" role="region" aria-label="文章列表"><div class="forum-list-label"><span>${tags.length?'已选 '+tags.length+' 个标签':'全部文章'}</span><span>${items.length} 篇文章</span></div>${items.length?channelMasonry(items):'<div class="account-empty"><h2>这个标签下还没有文章</h2><p>分享你的方法与实践经验。</p></div>'}</div><aside class="forum-aside"><section class="forum-tags-panel"><h2>标签</h2><nav class="forum-filters" aria-label="文章标签">${tagFilterButtons(channels.map(c=>c.name),tags,'tag')}</nav></section><a class="forum-draft-link" href="#articles?compose=1"><span>文章草稿</span><span>${articleState.draft?'继续编辑':'新建文章'}</span></a></aside></div></section>`;
}
function articleCompose(){
 const d=articleState.draft||{title:'',body:'',summary:'',tags:[]};
 return `<section class="forum-editor"><a class="reader-back" href="#articles">返回文章</a>${heading('发布资讯')}<form id="article-compose"><fieldset class="forum-tag-picker"><legend>标签（可多选）</legend>${channels.map(c=>`<label><input type="checkbox" name="tags" value="${escapeHtml(c.name)}" ${d.tags.includes(c.name)?'checked':''}><span>${escapeHtml(c.name)}</span></label>`).join('')}</fieldset><label>标题<input class="ds-input" name="title" required maxlength="200" value="${escapeHtml(d.title)}" placeholder="给文章一个清晰的标题"></label><label>摘要<input class="ds-input" name="summary" maxlength="300" value="${escapeHtml(d.summary||'')}" placeholder="简要介绍文章内容（选填）"></label><label>正文<textarea class="ds-input" name="body" required rows="16" maxlength="50000" placeholder="写下你的方法、经验与实践过程">${escapeHtml(d.body)}</textarea></label><p id="article-status" role="status">${articleState.draft?'已恢复草稿':'编辑内容自动保存为草稿'}</p><div class="forum-editor-actions"><button class="ds-button" type="submit">发布资讯</button><button class="ds-button secondary" type="button" data-save-article>保存草稿</button><a href="#articles">返回文章</a></div><p class="forum-note">本地原型：文章仅保存在当前浏览器，不会发布到线上。</p></form></section>`;
}
function articleDraft(form){const data=new FormData(form);return {title:String(data.get('title')||''),summary:String(data.get('summary')||''),body:String(data.get('body')||''),tags:data.getAll('tags').map(String)};}
function saveArticleDraft(form){const ok=saveArticles({...articleState,draft:articleDraft(form)});document.querySelector('#article-status').textContent=ok?'草稿已保存':'保存失败，请重试';return ok;}
document.addEventListener('input',e=>{const form=e.target.closest('#article-compose');if(form)saveArticleDraft(form);});
document.addEventListener('click',e=>{if(e.target.closest('[data-save-article]'))saveArticleDraft(document.querySelector('#article-compose'));});
document.addEventListener('submit',e=>{
 if(e.target.id!=='article-compose')return;
 e.preventDefault();const d=articleDraft(e.target);
 if(!d.title.trim()||!d.body.trim()||!d.tags.length){document.querySelector('#article-status').textContent='请填写标题、正文，并至少选择一个标签。';return;}
 const id='article-'+crypto.randomUUID();
 const post={...d,id,title:d.title.trim(),body:d.body.trim(),desc:d.summary.trim()||d.body.trim().slice(0,150),author:'Sage',type:'article',label:'文章',channels:channels.filter(c=>d.tags.includes(c.name)).map(c=>c.id),channelCover:false,cardHref:'#articles?post='+id,created:Date.now()};
 if(saveArticles({posts:[post,...articleState.posts],draft:null})){location.hash='articles?post='+id;notify('文章已发布到本地原型');}
});
