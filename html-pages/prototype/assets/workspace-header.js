// Search and account sit above the content card; the left navigation stays put.
(() => {
 const workspace=document.querySelector('.ds-workspace');
 const row=document.createElement('header');row.className='workspace-header';
 const search=document.querySelector('#global-search');
 if(search)row.append(search);
 else{row.innerHTML='<form class="top-search" action="index.html" role="search"><span aria-hidden="true">⌕</span><input name="query" aria-label="搜索岛内内容" placeholder="搜索问题、工具、作者或课程"><button type="submit" aria-label="提交搜索">搜索</button></form>';row.querySelector('form').addEventListener('submit',e=>{e.preventDefault();location.href='index.html#search?q='+encodeURIComponent(new FormData(e.target).get('query')||'')});}
 const trigger=document.querySelector('#account-trigger');trigger.classList.remove('profile-row');trigger.innerHTML='<span class="profile-avatar">S</span>';const actions=document.createElement('div');actions.className='workspace-header-actions';
 const notificationSource=document.querySelector('#account-menu a[href$="#notifications"]');
 if(notificationSource){const notification=notificationSource.cloneNode(true);notification.className='header-notifications';notification.setAttribute('aria-label','通知');notification.setAttribute('title','通知');Array.from(notification.childNodes).filter(node=>node.nodeType===Node.TEXT_NODE).forEach(node=>node.remove());actions.append(notification);}
 actions.append(trigger);row.append(actions);
 workspace.before(row);
 document.querySelector('.nova-ds').classList.add('has-workspace-header');
})();
