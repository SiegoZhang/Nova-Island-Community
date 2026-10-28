document.querySelectorAll('[data-specimen-toggle]').forEach(button=>button.addEventListener('click',()=>button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed')!=='true'))));
document.querySelectorAll('.prototype-specimens nav').forEach(nav=>nav.addEventListener('click',event=>{const link=event.target.closest('a');if(!link)return;event.preventDefault();nav.querySelectorAll('a').forEach(a=>a.removeAttribute('aria-current'));link.setAttribute('aria-current','page');}));
document.querySelector('[data-specimen-search]').addEventListener('submit',event=>{event.preventDefault();nova.notify('搜索样式示例，实际内容搜索请在产品原型中使用');});
document.querySelectorAll('[data-specimen-notify]').forEach(button=>button.addEventListener('click',()=>nova.notify(button.dataset.specimenNotify)));
