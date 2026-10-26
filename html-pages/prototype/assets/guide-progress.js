const guideProgressKey='nova-guide-progress-v2';
const guideSteps=[
 {title:'先认识 AI',days:'DAY 01–07',label:'听懂常见概念，找到顺手的工具',heading:'不用一次学完，先把第一步走稳。',desc:'从用户手册开始，看看岛上有什么。再用两篇科普，弄懂 AI 能帮你做什么，选一个工具开始尝试。',result:'用 AI 完成一次自我介绍，或整理一份今天的待办。',links:[['第一站 · 新岛用户手册','了解星球内容、学习方式与参与入口','用户手册'],['AI 核心概念大串联','把模型、提示词、智能体这些词串起来','AI 核心概念'],['AI 工具全景图','工具这么多，先选适合你的那一个','工具']]},
 {title:'学会提问题',days:'DAY 08–14',label:'把模糊的想法，变成清楚的任务',heading:'让 AI 听懂你，比背提示词更重要。',desc:'练习交代目标、背景和你想要的结果。用同一个真实任务反复调整，观察回答有什么变化。',result:'整理一套自己的提问模板，完成一次总结或改写。',links:[['Prompt 从入门到理解','理解提示词，练习把需求说清楚','Prompt'],['Token：AI 算账的最小单位','看懂上下文与使用成本','Token'],['从 LLM 到 Agent Skill','从会聊天，走向能完成任务','Agent']]},
 {title:'做一个作品',days:'DAY 15–21',label:'跟着教程，把想法变成看得见的成果',heading:'挑一个你真的想用的小项目。',desc:'不用三个都做。选作品集、个人工作台或微信小程序中的一个，先跑通最小版本，再慢慢加上自己的想法。',result:'做出一个能打开、能演示的作品，记录遇到的第一个问题。',links:[['零基础搭建个人作品集','把你的经历和作品，做成一个网站','作品集'],['搭建自己的个人工作台','把常用入口和信息放到一起','工作台'],['用 AI 做第一个微信小程序','跟着完整教程，从想法到页面','小程序']]},
 {title:'把经验留下',days:'DAY 22–30',label:'复盘一次，让成果成为可复用的方法',heading:'从做出来，到下次还能做出来。',desc:'回顾你的项目：哪些步骤可以复用，哪里需要补课？再选一篇进阶内容，把你学到的东西整理成自己的工作流。',result:'分享作品与复盘：做了什么、卡在哪里、下次怎么改。',links:[['Agent Skill：从使用到原理','把可复用的方法，变成 AI 的装备','Skill'],['搭建专属于你的私人助教','用自己的资料，尝试一个 RAG 项目','RAG'],['新岛内容导航','根据兴趣，找到下一段学习路线','内容导航']]}
];
const guideSearchHref=q=>'https://novaisland.cn/community/search?q='+encodeURIComponent(q);
// Manual completion is separate from historical lesson visits.
const guideCheckedKey='nova-guide-checked-v1';
let guideChecked=new Set();
try{const saved=JSON.parse(localStorage.getItem(guideCheckedKey)||'[]');if(Array.isArray(saved))guideChecked=new Set(saved.filter(id=>typeof id==='string'));}catch{}
function guideLessonLink(title,desc,q){
 const id=encodeURIComponent(q),done=guideChecked.has(id),label=title.replace(' · ','：');
 return `<div class="journey-lesson${done?' is-checked':''}"><button type="button" class="journey-task" role="checkbox" aria-label="标记完成：${label}" aria-checked="${done}" data-guide-check="${id}"><svg class="journey-task-check" viewBox="0 0 24 24" aria-hidden="true"><circle class="task-ring" cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 ${(2*Math.PI*11)/13-1}"/><circle class="task-fill" cx="12" cy="12" r="12"/><path class="task-tick" d="M7.4 12.4 10.6 15.5 16.6 8.9" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg></button><a class="journey-lesson-open" href="${guideSearchHref(q)}" target="_blank" rel="noopener" title="${desc}" aria-label="打开${label}，在新标签页打开"><span class="journey-task-label"><span class="journey-lesson-title">${label}</span></span><span class="journey-lesson-arrow" aria-hidden="true">↗</span></a></div>`;
}
async function toggleGuideLesson(e){
 const button=e.target.closest('[data-guide-check]');if(!button||button.dataset.animating)return;
 const row=button.closest('.journey-lesson'),id=button.dataset.guideCheck,done=!guideChecked.has(id);
 done?guideChecked.add(id):guideChecked.delete(id);
 button.setAttribute('aria-checked',String(done));
 try{localStorage.setItem(guideCheckedKey,JSON.stringify([...guideChecked]));}catch{notify('当前浏览器无法保存，完成记录仅在本次访问生效。');}
 syncGuideCompletion();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const play=(el,frames,duration,easing='cubic-bezier(.22,1,.36,1)',delay=0)=>el.animate(frames,{duration:reduced?0:duration,easing,delay:reduced?0:delay,fill:'forwards'});
 const svg=button.querySelector('svg'),ring=button.querySelector('.task-ring'),fill=button.querySelector('.task-fill'),tick=button.querySelector('.task-tick'),label=row.querySelector('.journey-lesson-title');
 const animations=[];
 const run=(...args)=>{const animation=play(...args);animations.push(animation);return animation.finished;};
 button.dataset.animating='true';
 try{
  const check=()=>Promise.all([
   run(ring,{opacity:done?[1,0]:[0,1]},240),
   run(fill,{transform:done?['scale(0)','scale(1)']:['scale(1)','scale(0)']},240),
   run(tick,{strokeDashoffset:done?[1,0]:[0,1],opacity:done?[0,1]:[1,0]},220,undefined,60),
   ...(done?[run(svg,[{transform:'scale(1)',offset:0},{transform:'scale(1.08)',offset:.4},{transform:'scale(1)',offset:1}],340)]:[])
  ]);
  const strike=()=>run(label,{backgroundSize:done?['0% 1.5px','100% 1.5px']:['100% 1.5px','0% 1.5px']},380,'cubic-bezier(.65,0,.35,1)');
  if(done){await check();row.classList.add('is-struck');await strike();await run(svg,[{transform:'translateX(0)',offset:0},{transform:'translateX(8px)',offset:.35},{transform:'translateX(-2px)',offset:.7},{transform:'translateX(0)',offset:1}],300);}
  else{row.classList.remove('is-struck');await strike();await check();}
 }finally{
  row.classList.toggle('is-checked',done);row.classList.remove('is-struck');
  animations.forEach(animation=>animation.cancel());delete button.dataset.animating;
  refreshGuideJourney();
 }
}
document.addEventListener('click',toggleGuideLesson);
let guideProgress={completed:[],hidden:false};
try{const saved=JSON.parse(localStorage.getItem(guideProgressKey)||'null');if(saved)guideProgress={completed:[...new Set((Array.isArray(saved.completed)?saved.completed:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<guideSteps.length))],hidden:false};}catch{}
// A week is complete only when the user checks every lesson.
function syncGuideCompletion(){
 guideProgress.completed=guideSteps.flatMap((step,i)=>step.links.every(([, ,q])=>guideChecked.has(encodeURIComponent(q)))?[i]:[]);
}
syncGuideCompletion();
function saveGuideProgress(next){guideProgress=next;try{localStorage.setItem(guideProgressKey,JSON.stringify(next));return true;}catch{notify('当前浏览器无法保存，设置仅在本次访问生效。');return false;}}
function guideProgressComponent(){
 const count=guideProgress.completed.length,next=guideSteps.findIndex((_,i)=>!guideProgress.completed.includes(i));
 return `<section class="guide-progress guide-banner" aria-labelledby="guide-progress-title"><a class="guide-progress-link" href="#guide${next>=0?'?step='+next:''}"><span class="guide-banner-art guide-folder guide-editorial-stack" aria-hidden="true"><span class="guide-folder-sheet guide-mini-article mini-one"><span class="guide-mini-cover"><i></i><i></i><i></i></span><span class="guide-mini-heading"></span><span class="guide-mini-copy"></span><span class="guide-mini-copy short"></span></span><span class="guide-folder-sheet guide-mini-article mini-two"><span class="guide-mini-cover"><i></i><i></i><i></i></span><span class="guide-mini-heading"></span><span class="guide-mini-copy"></span><span class="guide-mini-copy short"></span></span><span class="guide-folder-sheet guide-mini-article mini-three"><span class="guide-mini-cover"><i></i><i></i><i></i></span><span class="guide-mini-heading"></span><span class="guide-mini-copy"></span><span class="guide-mini-copy short"></span></span><span class="guide-folder-sheet guide-mini-article mini-four"><span class="guide-mini-cover"><i></i><i></i><i></i></span><span class="guide-mini-heading"></span><span class="guide-mini-copy"></span><span class="guide-mini-copy short"></span></span><span class="guide-folder-sheet guide-mini-article mini-five"><span class="guide-mini-cover"><i></i><i></i><i></i></span><span class="guide-mini-heading"></span><span class="guide-mini-copy"></span><span class="guide-mini-copy short"></span></span><span class="guide-folder-sheet guide-mini-article mini-six"><span class="guide-mini-cover"><i></i><i></i><i></i></span><span class="guide-mini-heading"></span><span class="guide-mini-copy"></span><span class="guide-mini-copy short"></span></span><span class="guide-folder-sheet guide-loose-logo loose-workbuddy"><img src="assets/brand-logos/workbuddy.svg" alt="" width="80" height="80"></span><span class="guide-folder-sheet guide-loose-logo loose-openai"><img src="assets/brand-logos/openai.svg" alt="" width="80" height="80"></span><span class="guide-folder-sheet guide-loose-logo loose-claude"><img src="assets/brand-logos/claude.svg" alt="" width="80" height="80"></span><span class="guide-folder-sheet guide-loose-logo loose-kimi"><img src="assets/brand-logos/kimi.png" alt="" width="80" height="80"></span><span class="guide-folder-sheet guide-loose-logo loose-doubao"><img src="assets/brand-logos/doubao.png" alt="" width="80" height="80"></span></span><div class="guide-folder-cover"><span class="guide-folder-front" aria-hidden="true"></span><svg class="guide-folder-rim" viewBox="0 0 640 156" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M1 21Q1 1 21 1H177Q185 1 191 7L211 27Q217 33 225 33H619Q639 33 639 53V135Q639 155 619 155H21Q1 155 1 135Z" stroke="white" stroke-opacity=".7" stroke-width="2" vector-effect="non-scaling-stroke"/></svg><div class="guide-banner-layout"><div class="guide-banner-copy"><header class="guide-progress-heading"><h2 id="guide-progress-title">30 天 AI 实践之旅</h2></header><p>${count===guideSteps.length?'你已完成入门指南，可以继续探索感兴趣的内容。':'从认识工具，到完成作品。每周前进一步，把 AI 用起来。'}</p></div><div class="guide-banner-actions"><div class="guide-progress-status"><div class="guide-progress-track" role="progressbar" aria-label="入门指南完成进度" aria-valuemin="0" aria-valuemax="${guideSteps.length}" aria-valuenow="${count}" aria-valuetext="已完成 ${count} / ${guideSteps.length}"><span class="guide-progress-fill" style="width:${count/guideSteps.length*100}%"></span></div><span>已完成 <strong>${count}</strong> / ${guideSteps.length} 周</span></div><span class="ds-button guide-progress-continue">${count===guideSteps.length?'查看指南':count?'继续旅程':'开始旅程'}</span></div></div></div></a></section>`;
}
function guideJourneyProgress(){
 const count=guideProgress.completed.length,next=guideSteps.findIndex((_,i)=>!guideProgress.completed.includes(i)),done=next<0,step=guideSteps[done?3:next];
 return `<article class="ds-continue-card journey-resume"><div class="journey-resume-copy"><h2>${done?'30 天旅程已完成':`${['第一周','第二周','第三周','第四周'][next]}：${step.title.replace(' AI','AI')}`}</h2><p class="ds-meta" role="status">已完成 ${count} / 4 周</p><div class="ds-progress" role="progressbar" aria-label="学习阶段完成进度" aria-valuemin="0" aria-valuemax="4" aria-valuenow="${count}"><span style="width:${count/guideSteps.length*100}%"></span></div></div><a class="ds-button primary" href="${done?'https://novaisland.cn/community/categories':guideSearchHref(step.links[0][2])}" target="_blank" rel="noopener">${done?'继续探索':count?'继续学习':'开始学习'}</a></article>`;
}
const journeyIcons=[
 '<path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1"/><circle cx="12" cy="12" r="4"/>',
 '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9H13a8.5 8.5 0 0 1 8 8v.5Z"/><path d="M8 10h8m-8 4h5"/>',
 '<rect x="3" y="4" width="18" height="15" rx="3"/><path d="m9 9-3 3 3 3m6-6 3 3-3 3"/>',
 '<path d="M12 7c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V6c-3-1-6-1-9 1Zm0 0v14M8 3h8"/>'
];
function guideProgressPage(){
 const next=guideSteps.findIndex((_,i)=>!guideProgress.completed.includes(i)),count=guideProgress.completed.length;
 return `<div class="journey-page"><div class="journey-toolbar"><a class="reader-back" href="${escapeHtml(safeReturn(guideOrigin))}">← 返回</a><div class="journey-stats" aria-label="学习进度"><div><strong>4</strong><span>学习周</span></div><div class="stat-complete"><strong>${count}</strong><span>完成</span></div><div><strong>${next<0?0:3-count}</strong><span>未开始</span></div></div></div><header class="journey-header"><div><h1>30 天 AI 实践之旅</h1><p>从认识工具，到完成作品。沿着你的路线，每周前进一步。完成后手动打勾，记录会自动保存。</p></div></header><section class="journey-tree" aria-label="四周学习路线">${guideSteps.map((step,i)=>{
 const completed=guideProgress.completed.includes(i),current=i===next;
 return `<article class="journey-week ${completed?'completed':current?'current':'upcoming'}" id="guide-step-${i}"><span class="journey-node" aria-hidden="true"></span><span class="journey-week-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${journeyIcons[i]}</svg></span><div class="journey-week-meta"><span>${['第一周','第二周','第三周','第四周'][i]}</span></div><h2>${step.title}</h2><p class="journey-week-description">${step.label}</p><nav class="journey-resources" aria-label="第 ${i+1} 周教程">${step.links.map(([title,desc,q])=>guideLessonLink(title,desc,q)).join('')}</nav></article>`;
 }).join('')}</section></div>`;
}
function refreshGuideJourney(){
 const page=document.querySelector('.journey-page');if(!page)return;
 const next=guideSteps.findIndex((_,i)=>!guideProgress.completed.includes(i));
 page.querySelectorAll('.journey-week').forEach((card,i)=>{
  card.classList.toggle('completed',guideProgress.completed.includes(i));
  card.classList.toggle('current',i===next);
  card.classList.toggle('upcoming',i!==next&&!guideProgress.completed.includes(i));
 });
 page.querySelector('.stat-complete strong').textContent=guideProgress.completed.length;
 page.querySelector('.journey-stats>div:last-child strong').textContent=next<0?0:guideSteps.length-guideProgress.completed.length-1;
}

// Preserve the tour folder's 16:21 diagonal and its original Bezier joins at every width.
let guideFolderResize;
function fitGuideFolderCover(){
 guideFolderResize?.disconnect();
 const front=document.querySelector('.guide-folder-front');
 const rim=document.querySelector('.guide-folder-rim');
 if(!front||!rim)return;
 guideFolderResize=new ResizeObserver(()=>{
  const w=front.clientWidth,h=front.clientHeight;
  if(!w||!h)return;
  const k=h/180,t=w*.28,r=20,x=v=>t+(v-98)*k,y=v=>v*k;
  const d=`M1 ${r+1}Q1 1 ${r+1} 1H${t}C${x(110)} 1 ${x(116)} ${y(5)} ${x(123)} ${y(14)}L${x(139)} ${y(35)}C${x(144)} ${y(42)} ${x(151)} ${y(45)} ${x(161)} ${y(45)}H${w-r-1}Q${w-1} ${y(45)} ${w-1} ${y(45)+r}V${h-r-1}Q${w-1} ${h-1} ${w-r-1} ${h-1}H${r+1}Q1 ${h-1} 1 ${h-r-1}Z`;
  rim.setAttribute('viewBox',`0 0 ${w} ${h}`);
  rim.querySelector('path').setAttribute('d',d);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><path d="${d}"/></svg>`;
  const mask=`url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  front.style.maskImage=mask;front.style.webkitMaskImage=mask;
 });
 guideFolderResize.observe(front);
}

// Draw connectors in one coordinate system instead of joining CSS borders.
(() => {
 let activeTree,resize,frame;
 const ns='http://www.w3.org/2000/svg';
 function mount(){
  const tree=document.querySelector('.journey-tree');
  if(tree===activeTree)return;
  resize?.disconnect();activeTree=tree;
  if(!tree)return;
  const cards=[...tree.querySelectorAll('.journey-week')];
  const svg=document.createElementNS(ns,'svg');
  svg.classList.add('journey-connectors');
  svg.setAttribute('aria-hidden','true');
  tree.append(svg);tree.classList.add('has-connectors');
  function draw(){
   if(!tree.isConnected)return;
   const mobile=matchMedia('(max-width:650px)').matches;
   const points=cards.map(card=>{
    const node=card.querySelector('.journey-node');
    return {x:card.offsetLeft+node.offsetLeft+node.offsetWidth/2,y:card.offsetTop+node.offsetTop+node.offsetHeight/2};
   });
   if(points.length<2)return;
   const first=points[0],last=points.at(-1),mid=mobile?1:tree.clientWidth/2,r=14;
   svg.setAttribute('viewBox',`0 0 ${tree.clientWidth} ${tree.clientHeight}`);
   const paths=[];
   const add=(d,offset=0)=>{
    const path=document.createElementNS(ns,'path');
    path.setAttribute('d',d);path.setAttribute('stroke-dashoffset',String(offset));paths.push(path);
   };
   if(mobile){
    add(`M${first.x} ${first.y}H${mid+r}Q${mid} ${first.y} ${mid} ${first.y+r}V${last.y-r}Q${mid} ${last.y} ${mid+r} ${last.y}H${last.x}`);
   }else{
    add(`M${first.x} ${first.y}H${mid-r}Q${mid} ${first.y} ${mid} ${first.y+r}V${last.y-r}Q${mid} ${last.y} ${mid+r} ${last.y}H${last.x}`);
   }
   // Match each branch's dash phase to the trunk at the shared tangent.
   const curveLength=1.62322524*r;
   const trunkStartLength=Math.abs(first.x-mid)-r+curveLength;
   points.slice(1,-1).forEach(p=>{
    const side=p.x<mid?-1:1;
    const branchLength=Math.abs(p.x-mid)-r+curveLength;
    const trunkLength=trunkStartLength+p.y-first.y;
    add(`M${p.x} ${p.y}H${mid+side*r}Q${mid} ${p.y} ${mid} ${p.y+r}`,trunkLength-branchLength);
   });
   svg.replaceChildren(...paths);
  }
  resize=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(draw)});
  resize.observe(tree);cards.forEach(card=>resize.observe(card));
  draw();
 }
 const main=document.querySelector('.ds-main');
 if(main)new MutationObserver(mount).observe(main,{childList:true,subtree:true});
 mount();
})();
