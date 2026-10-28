(() => {
 const root=document.querySelector('.nova-ds');
 document.querySelectorAll('[data-token]').forEach(button=>button.addEventListener('click',()=>nova.copy('var('+button.dataset.token+')')));
 document.querySelector('.ds-topbar button').addEventListener('click',()=>{
  const styles=getComputedStyle(root),tokens={};
  for(const name of styles)if(name.startsWith('--'))tokens[name]=styles.getPropertyValue(name).trim();
  const url=URL.createObjectURL(new Blob([JSON.stringify({theme:'light',tokens},null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='nova-island-tokens.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
 document.querySelectorAll('.prototype-specimens .channel-nav,.prototype-specimens .forum-filters,.prototype-specimens .account-tabs').forEach(nav=>nav.addEventListener('click',event=>{const link=event.target.closest('a');if(!link)return;event.preventDefault();nav.querySelectorAll('a').forEach(a=>a.removeAttribute('aria-current'));link.setAttribute('aria-current','page');}));
 document.querySelectorAll('[data-forum-action]').forEach(button=>button.addEventListener('click',()=>{
  if(button.dataset.forumAction==='share'){nova.copy(location.href.split('#')[0]+'#forum');return;}
  const active=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',active);button.querySelector('span').textContent=button.dataset.forumAction==='liked'?(active?'已点赞':'点赞'):(active?'已收藏':'收藏');
 }));
 const form=document.querySelector('#forum-compose'),body=form.elements.body,status=document.querySelector('#draft-status');
 status.textContent='组件演示，输入仅保留在当前页面';
 form.addEventListener('input',()=>{document.querySelector('#forum-word-count').textContent=body.value.length+' / 50000';status.textContent='组件演示，输入仅保留在当前页面';});
 form.addEventListener('submit',event=>{event.preventDefault();nova.notify('发布按钮演示，不会创建帖子');});
 form.querySelector('[data-save-forum]').addEventListener('click',()=>{status.textContent='草稿按钮演示，不写入原型数据';});
 form.querySelectorAll('[data-format]').forEach(button=>button.addEventListener('click',()=>{const text=body.value.slice(body.selectionStart,body.selectionEnd),snippets={bold:'**'+(text||'重点内容')+'**',heading:'\n## '+(text||'小标题')+'\n',list:'\n- '+(text||'列表项目')+'\n',quote:'\n> '+(text||'引用内容')+'\n'};body.setRangeText(snippets[button.dataset.format],body.selectionStart,body.selectionEnd,'select');body.focus();body.dispatchEvent(new Event('input',{bubbles:true}));}));
 const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 form.querySelector('[data-preview-forum]').addEventListener('click',event=>{const button=event.currentTarget,open=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',open);button.textContent=open?'继续编辑':'预览正文';document.querySelector('#forum-body-label').hidden=open;const preview=document.querySelector('#forum-preview');preview.hidden=!open;preview.innerHTML=escape(body.value).split('\n').map(line=>line.startsWith('## ')?'<h2>'+line.slice(3)+'</h2>':line.startsWith('&gt; ')?'<blockquote>'+line.slice(5)+'</blockquote>':line.startsWith('- ')?'<div>• '+line.slice(2)+'</div>':line.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')).join('\n')||'正文还没有内容。';});
 document.querySelector('#global-search').addEventListener('submit',e=>{e.preventDefault();nova.notify('原型搜索组件展示');});
 document.querySelector('[data-reader-save]').addEventListener('click',e=>{const b=e.currentTarget,on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);b.textContent=on?'已收藏':'收藏文章';});
})();
