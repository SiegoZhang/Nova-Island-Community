// Product navigation for standalone prototype detail pages.
(() => {
 const sidebar=document.querySelector('.product-sidebar'),trigger=document.querySelector('#account-trigger'),menu=document.querySelector('#account-menu');
 const paths={home:'m3 10 9-7 9 7v10H3z',book:'M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3zM12 6v15',file:'M5 3h9l5 5v13H5zM8 13h8M8 17h6',chat:'M4 4h16v13H9l-5 4z',calendar:'M3 5h18v16H3zM7 2v6M17 2v6M3 11h18',layers:'m12 3 10 5-10 5L2 8zM2 12l10 5 10-5',trophy:'M7 3h10v5c0 5-10 5-10 0zM12 12v7M7 21h10',spark:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',bookmark:'M5 3h14v18l-7-4-7 4z',settings:'M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z',grid:'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z',logout:'M10 3H4v18h6M10 12h11m-4-4 4 4-4 4'};
 document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[el.dataset.icon]||paths.file}"/></svg>`);
 function setMenu(open){sidebar.classList.toggle('menu-open',open);sidebar.inert=matchMedia('(max-width:760px)').matches&&!open;document.querySelector('.menu-scrim').hidden=!open;document.querySelector('.mobile-menu').setAttribute('aria-expanded',String(open));}
 document.querySelectorAll('[data-menu]').forEach(b=>b.addEventListener('click',()=>setMenu(!sidebar.classList.contains('menu-open'))));
 document.querySelector('[data-dismiss]').addEventListener('click',()=>{document.querySelector('#guide-card').hidden=true;try{localStorage.setItem('nova-home-guide-hidden','true')}catch{}trigger.focus()});
 document.querySelector('[data-logout]').addEventListener('click',()=>{menu.hidePopover();window.nova.notify('当前为设计原型，未连接真实登录服务。')});
 menu.addEventListener('toggle',e=>trigger.setAttribute('aria-expanded',String(e.newState==='open')));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sidebar.classList.contains('menu-open')){setMenu(false);document.querySelector('.mobile-menu').focus()}});
 window.addEventListener('resize',()=>setMenu(false));try{document.querySelector('#guide-card').hidden=localStorage.getItem('nova-home-guide-hidden')==='true'}catch{}setMenu(false);
})();
