(() => {
  const lessons=[...document.querySelectorAll('#curriculum .ds-lesson')];
  const modules=[...document.querySelectorAll('#curriculum .ds-module')];
  const resume=document.querySelector('.ds-continue-card');
  const completed=new Set([0,1]);
  const exercises=[
    ['列出每周重复发生的工作，比较频率、耗时与可验证性。','选择一个每周至少发生两次的任务，写下当前做法和期望结果。'],
    ['把模糊的需求转为有边界、可检查的工作流目标。','准备三组输入样例，为每组样例写出合格输出的判断标准。'],
    ['理解模型负责的判断与工具负责的执行，明确二者的交接点。','画出模型节点和工具节点，并标注每一步的数据格式。'],
    ['为不确定的输出和失败的工具调用设计可恢复的路径。','为一次失败调用设计重试、降级与人工接管规则。'],
    ['从正确性、稳定性和成本三个维度检查输出。','用五组真实样例运行工作流，记录失败原因和改进优先级。'],
    ['把实践过程整理为他人可以理解和复用的学习记录。','写一份包含问题、流程、评估结果与局限的项目说明。']
  ];
  let selected=2;
  const panel=document.createElement('div');panel.className='course-lesson-panel ds-stack';panel.tabIndex=-1;panel.hidden=true;panel.setAttribute('aria-label','当前课时内容');document.getElementById('curriculum').append(panel);
  const firstIncomplete=()=>lessons.findIndex((_,i)=>!completed.has(i));
  const available=i=>completed.has(i)||firstIncomplete()<0||Math.floor(i/2)<=Math.floor(firstIncomplete()/2);
  function update(){
    const next=firstIncomplete();
    lessons.forEach((button,i)=>{
      const state=completed.has(i)?'completed':!available(i)?'locked':i===selected?'current':'available';
      button.className='ds-lesson '+state;button.disabled=state==='locked';
      if(state==='current')button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
      button.querySelector('.ds-lesson-index').textContent=state==='completed'?'✓':state==='current'?'▶':state==='locked'?'−':String(i+1).padStart(2,'0');
      button.querySelector('.ds-lesson-state').textContent={completed:'已完成',current:'当前课时',available:'可学习',locked:'未解锁'}[state];
    });
    modules.forEach((module,i)=>{
      const count=Number(completed.has(i*2))+Number(completed.has(i*2+1));
      const state=count===2?'completed':i>Math.floor(next/2)&&next>=0?'locked':'current';module.className='ds-module '+state;
      module.querySelector('.ds-badge').textContent={completed:'已完成',locked:'未解锁',current:'进行中'}[state];
      module.querySelector('.ds-module-progress .ds-meta').textContent=count+'/2 已完成';
      module.querySelector('.ds-module-progress .ds-progress>span').style.width=count*50+'%';
    });
    const current=completed.has(selected)?Math.max(0,next):selected;
    resume.querySelector('h2').textContent=lessons[current].querySelector('.ds-lesson-title').textContent;
    const meta=resume.querySelector('.ds-resume-identity .ds-meta');
    meta.children[0].textContent='模块 '+String(Math.floor(current/2)+1).padStart(2,'0')+' · '+modules[Math.floor(current/2)].querySelector('.ds-module-title').textContent;
    meta.children[1].textContent=lessons[current].querySelector('.ds-lesson-meta .ds-meta').textContent;
    nova.progress(resume,Math.round(completed.size/6*100));resume.querySelector('[role="status"]').textContent=completed.size+' / 6 节已完成';
    resume.querySelector('.ds-button').textContent=completed.size===6?'回顾课程 →':'继续学习 →';
    resume.querySelector('.ds-badge').textContent=completed.size===6?'已完成':'学习中';
  }
  function open(index){
    if(!available(index))return; selected=index;update();panel.hidden=false;
    panel.innerHTML='<div class="ds-row ds-between"><span class="ds-badge">课时 '+(index+1)+' · 练习预览</span><button class="ds-button ghost" aria-label="关闭课时预览">×</button></div><h3></h3><p></p><p></p><div class="ds-row"><button class="ds-button primary" data-complete>标记为已完成</button><button class="ds-button secondary" data-next>下一课时 →</button></div><span class="ds-meta" role="status">进度仅保留在当前页面，刷新后重置。</span>';
    panel.querySelector('h3').textContent=lessons[index].querySelector('.ds-lesson-title').textContent;
    panel.querySelectorAll('p')[0].textContent=exercises[index][0];panel.querySelectorAll('p')[1].textContent='动手练习：'+exercises[index][1];
    panel.querySelector('[aria-label]').onclick=()=>{panel.hidden=true;lessons[index].focus();};
    const complete=panel.querySelector('[data-complete]');complete.disabled=completed.has(index);if(complete.disabled)complete.textContent='已完成';
    complete.onclick=()=>{completed.add(index);update();open(index);};
    const next=panel.querySelector('[data-next]');next.hidden=index===5||!completed.has(index)||!available(index+1);next.onclick=()=>open(index+1);
    panel.focus();
  }
  lessons.forEach((button,i)=>button.addEventListener('click',()=>open(i)));
  resume.querySelector('.ds-button').addEventListener('click',()=>open(completed.has(selected)?Math.max(0,firstIncomplete()):selected));
  const outlines=[['定义输出格式','提供有效上下文','构建少样本示例','用测试集迭代提示'],['界定用户问题','选择交互形式','搭建原型','组织用户测试','整理反馈与下一步']];
  document.querySelectorAll('#related .ds-course-card').forEach((card,i)=>card.querySelector('button').addEventListener('click',()=>{
    let preview=document.querySelector('#related .course-lesson-panel');if(!preview){preview=document.createElement('div');preview.className='course-lesson-panel ds-stack';preview.tabIndex=-1;document.getElementById('related').append(preview);}
    preview.replaceChildren();const title=document.createElement('h3');title.textContent=card.querySelector('h3').textContent;preview.append(title);
    const list=document.createElement('ol');list.className='course-preview-list';outlines[i].forEach(text=>{const li=document.createElement('li');li.textContent=text;list.append(li);});preview.append(list);
    const close=document.createElement('button');close.className='ds-button ghost';close.textContent='关闭预览';close.onclick=()=>{preview.remove();card.querySelector('button').focus();};preview.append(close);preview.focus();
  }));
  update();
})();
