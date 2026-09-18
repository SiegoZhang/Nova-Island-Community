(()=>{
 function tourFolder(id,decorative=false){return "<div class=\"tour-folder\" tabindex=\"0\" role=\"img\" aria-label=\"AI 知识和课程收纳文件夹，悬浮或聚焦可展开卡片\"><div class=\"tour-folder-back\" aria-hidden=\"true\"></div><div class=\"tour-folder-sheet sheet-course\" aria-hidden=\"true\"><span>课程</span><div class=\"folder-course-cover\"><img src=\"assets/course-ai-media-16x9.png\" alt=\"\"><em>▶</em></div><b></b><b class=\"short\"></b></div><div class=\"tour-folder-sheet sheet-news\" aria-hidden=\"true\"><span>AI 知识</span><div class=\"folder-knowledge-map\"><i></i><i></i><i></i><i></i></div><b></b><b class=\"short\"></b></div><div class=\"tour-folder-sheet sheet-notes\" aria-hidden=\"true\"><span>AI 知识</span><div class=\"folder-editorial-cover\"><i></i><i></i><i></i></div><div class=\"folder-editorial-lines\"><b></b><b class=\"short\"></b></div></div><div class=\"tour-folder-frost\" aria-hidden=\"true\"></div><svg class=\"tour-folder-front\" viewBox=\"0 0 300 180\" fill=\"none\" aria-hidden=\"true\"><defs><linearGradient id=\"tour-folder-fill\" x1=\"24\" y1=\"0\" x2=\"256\" y2=\"180\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#FFFFFF\" stop-opacity=\".76\"/><stop offset=\".6\" stop-color=\"#F7F7F9\" stop-opacity=\".56\"/><stop offset=\"1\" stop-color=\"#E8E9ED\" stop-opacity=\".7\"/></linearGradient></defs><path d=\"M1 29C1 13 13 1 29 1H98C110 1 116 5 123 14L139 35C144 42 151 45 161 45H271C287 45 299 57 299 73V151C299 167 287 179 271 179H29C13 179 1 167 1 151V29Z\" fill=\"url(#tour-folder-fill)\" stroke=\"white\" stroke-opacity=\".7\" stroke-width=\"2\"/><path d=\"M23 149H276\" stroke=\"white\" stroke-opacity=\".25\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg></div>".replaceAll('tour-folder-fill','tour-folder-fill-'+id).replace('tabindex="0"',decorative?'aria-hidden="true"':'tabindex="0"');}
 const sidebarCard=document.querySelector('.product-sidebar [data-site-tour]');
 if(sidebarCard){
  sidebarCard.classList.add('sidebar-tour-card');
  sidebarCard.setAttribute('aria-label','功能导览：快速熟悉新岛');
  sidebarCard.innerHTML=tourFolder('sidebar',true)+'<div class="sidebar-tour-copy"><h2>快速熟悉新岛</h2><p>探索 AI 知识与课程</p><span class="guide-card-action">开始导览</span></div>';
 }

 const steps=[
 ['首页推荐','在首页查看精选内容，也可以按学习方向切换频道，找到适合自己的起点。','[data-page="home"]'],
 ['搜索内容','输入问题、工具、作者或课程名称，快速查找岛内内容。','.workspace-header .top-search'],
 ['课程','进入课程查看系统学习内容，打开课程后按目录逐节学习。','[data-page="courses"]'],
 ['资讯','按标签筛选文章，点击卡片阅读全文。你也可以通过「发布资讯」整理自己的经验。','[data-page="articles"]'],
 ['论坛','通过多个标签寻找讨论，发布问题或经验；在帖子详情中点赞、收藏和分享。','[data-page="community"]'],
 ['活动与实战','在活动中查看相聚安排，在实战中寻找项目与参与方式。当前未开放的内容会显示准备状态。','[data-page="practice"]'],
 ['榜单','在这里查看岛民贡献榜及不同时间范围的数据；暂无数据时显示空状态。','[data-page="ranking"]'],
 ['我的账号','点击头像打开个人菜单，管理收藏、草稿和账号设置，也能再次进入入门指南。','#account-trigger']
 ];
 let dialog,index=0,origin,sidebarOpen=false;
 function position(){
  if(!dialog?.open)return;
  const target=document.querySelector(steps[index][2]),ring=dialog.querySelector('.site-tour-ring'),panel=dialog.querySelector('.site-tour-panel');
  const r=target?.getBoundingClientRect();
  const visible=r&&r.width&&r.height&&r.right>0&&r.left<innerWidth&&r.top>=0&&r.bottom<=innerHeight;
  ring.hidden=!visible;
  if(visible)Object.assign(ring.style,{left:(r.left-4)+'px',top:(r.top-4)+'px',width:(r.width+8)+'px',height:(r.height+8)+'px'});
  const width=Math.min(360,innerWidth-32);panel.style.width=width+'px';
  const height=panel.getBoundingClientRect().height;
  let x=visible?r.right+20:(innerWidth-width)/2,y=visible?r.top:(innerHeight-height)/2;
  if(x+width>innerWidth-16){x=Math.min(innerWidth-width-16,Math.max(16,visible?r.left:16));y=visible?r.bottom+20:y;}
  Object.assign(panel.style,{left:Math.max(16,x)+'px',top:Math.max(16,Math.min(y,innerHeight-height-16))+'px'});
 }
 function show(){
  if(typeof setMenu==='function'&&matchMedia('(max-width:760px)').matches)setMenu(steps[index][2].startsWith('[data-page'));
  const [title,desc]=steps[index];
  dialog.querySelector('.site-tour-count').textContent=`功能导览 · ${index+1} / ${steps.length}`;
  dialog.querySelector('h2').textContent=title;dialog.querySelector('p').textContent=desc;
  dialog.querySelector('[data-tour-prev]').disabled=index===0;
  dialog.querySelector('[data-tour-next]').textContent=index===steps.length-1?'完成导览':'下一步';
  requestAnimationFrame(position);
 }
 function close(){dialog.close();dialog.remove();dialog=null;if(typeof setMenu==='function')setMenu(sidebarOpen);origin?.focus();}
 function start(trigger){
  if(dialog)return;origin=trigger;index=0;sidebarOpen=document.querySelector('.product-sidebar')?.classList.contains('menu-open');
  dialog=document.createElement('dialog');dialog.className='site-tour';dialog.setAttribute('aria-labelledby','site-tour-title');dialog.setAttribute('aria-describedby','site-tour-description');
  dialog.innerHTML='<div class="site-tour-ring" aria-hidden="true"></div><section class="site-tour-panel"><span class="site-tour-count"></span><h2 id="site-tour-title"></h2><p id="site-tour-description"></p><footer><button type="button" data-tour-exit>退出导览</button><div><button type="button" data-tour-prev>上一步</button><button type="button" class="ds-button" data-tour-next>下一步</button></div></footer></section>';
  document.body.append(dialog);dialog.showModal();show();dialog.querySelector('[data-tour-next]').focus();
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  dialog.addEventListener('click',e=>{if(e.target.closest('[data-tour-exit]'))close();else if(e.target.closest('[data-tour-prev]')&&index>0){index--;show();}else if(e.target.closest('[data-tour-next]')){if(index===steps.length-1)close();else{index++;show();}}});
 }
 // Invite once per browsing session, after the initial homepage is ready.
 const inviteKey='nova-site-tour-invited-v1';
 let invitationShown=false;
 try{invitationShown=sessionStorage.getItem(inviteKey)==='1'}catch{}
 const invitePreview=new URLSearchParams(location.hash.split('?')[1]||'').get('tour')==='preview';
 if(invitePreview)invitationShown=false;
 function invite(){
  const content=document.querySelector('#content');
  if(invitationShown||dialog||!content?.classList.contains('home-scroll')||content.getAttribute('aria-busy')==='true'||document.documentElement.classList.contains('site-boot-loading'))return;
  invitationShown=true;
  if(!invitePreview)try{sessionStorage.setItem(inviteKey,'1')}catch{}
  const card=document.querySelector('[data-site-tour]');
  const invitation=document.createElement('dialog');invitation.className='site-tour-invite';
  invitation.setAttribute('aria-labelledby','tour-invite-title');invitation.setAttribute('aria-describedby','tour-invite-description');
  invitation.innerHTML='<div class="tour-invite-content">'+tourFolder('invite')+'<h2 id="tour-invite-title" tabindex="-1" autofocus>快速熟悉新岛</h2><p id="tour-invite-description">跟着导览，了解如何找课程、读资讯和参与讨论。<br>也可以稍后从左下角打开。</p><div class="tour-invite-actions"><button type="button" data-invite-later>暂不需要</button><button type="button" data-invite-start>开始导览</button></div></div>';
  document.querySelector('.nova-ds').append(invitation);invitation.showModal();
  invitation.querySelector('#tour-invite-title').focus({preventScroll:true});
  let closing=false;
  function dismiss(begin){
   if(closing)return;closing=true;
   const finish=()=>{invitation.close();invitation.remove();if(begin)start(card);else card?.focus({preventScroll:true})};
   if(begin||matchMedia('(prefers-reduced-motion:reduce)').matches){finish();return}
   const from=invitation.getBoundingClientRect(),to=card?.getBoundingClientRect();
   const visible=to&&to.width&&to.height&&to.left>=0;
   const x=visible?to.left+to.width/2:40,y=visible?to.top+to.height/2:innerHeight-40;
   invitation.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${x-from.left-from.width/2}px,${y-from.top-from.height/2}px) scale(.12)`,opacity:0}],{duration:320,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}).finished.then(finish,finish);
  }
  invitation.addEventListener('cancel',event=>{event.preventDefault();dismiss(false)});
  invitation.querySelector('[data-invite-later]').onclick=()=>dismiss(false);
  invitation.querySelector('[data-invite-start]').onclick=()=>dismiss(true);
 }
 const initialContent=document.querySelector('#content');
 const inviteObserver=new MutationObserver(()=>{invite();if(invitationShown)inviteObserver.disconnect()});
 if(initialContent)inviteObserver.observe(initialContent,{attributes:true,attributeFilter:['aria-busy'],childList:true});
 invite();
 document.addEventListener('click',e=>{const trigger=e.target.closest('[data-site-tour]');if(trigger){e.preventDefault();start(trigger);}});
 window.addEventListener('resize',position);
})();
