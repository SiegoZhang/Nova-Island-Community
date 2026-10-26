/* Standalone reader adapter for the shared forum interaction store. */
const catalog=[{id:'workflow-article',type:'article',title:'让 AI 工作流真正落地：从一个具体问题开始',author:'林然'}];
const startChannelCatalog=[];
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function route(){return {page:'read/workflow-article',params:new URLSearchParams()}}
function notify(message){window.nova.notify(message)}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelector('.article-byline')?.insertAdjacentHTML('beforeend',postReadMeta(catalog[0]));
 const prose=document.querySelector('.article-prose');
 if(prose)prose.insertAdjacentHTML('afterend',`<div class="catalog-reader standalone-article-interactions">${forumActions(catalog[0])}${forumComments(catalog[0])}</div>`);
});
