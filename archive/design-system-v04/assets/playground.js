(() => {
  const main=document.querySelector('.ds-main');
  const sections=[...document.querySelectorAll('#playground-panel>.ds-section')];
  let scope='全部组件';
  function filter(){
    sections.forEach(section=>{
      section.hidden=!(scope==='全部组件'||scope==='Foundation'&&section.id==='foundation'||scope==='组件'&&!['foundation','states'].includes(section.id)||scope==='交互状态'&&section.id==='states');
    });
  }
  const subnav=document.querySelector('.community-subnav');
  subnav.addEventListener('click',event=>{
    if(!event.target.closest('a'))return;
    document.querySelector('[aria-label="展示范围"] button').click();
  });
  const tablists=[...document.querySelectorAll('[role="tablist"]')];
  tablists.forEach(list=>{
    const tabs=[...list.querySelectorAll('[role="tab"]')];
    const activate=tab=>{
      tabs.forEach(b=>{b.setAttribute('aria-selected',b===tab);b.tabIndex=b===tab?0:-1;});
      const id=tab.getAttribute('aria-controls');const panel=document.getElementById(id);if(panel)panel.setAttribute('aria-labelledby',tab.id);
      if(list.getAttribute('aria-label')==='展示范围'){scope=tab.textContent;filter();}
      else if(panel)panel.textContent={'概览':'在真实项目中练习，把零散知识连接成能力。','课程内容':'6 节课程，从问题定义到工作流验证。','讨论':'围绕当前课程提出问题，分享你的解决过程。'}[tab.textContent];
    };
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',()=>activate(tab));
      tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(i+1)%tabs.length;if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();tabs[next].focus();activate(tabs[next]);}});
    });
  });
  document.querySelectorAll('.ds-swatch').forEach(button=>button.addEventListener('click',()=>nova.copy('var('+button.querySelector('code').textContent+')')));
  [...document.querySelectorAll('.ds-topbar button')].find(b=>b.textContent.includes('导出 Tokens')).addEventListener('click',()=>{
    const root=document.querySelector('.nova-ds'),computed=getComputedStyle(root),names=new Set();
    [...document.styleSheets].forEach(sheet=>{try{[...sheet.cssRules].forEach(rule=>{if(rule.selectorText==='.nova-ds'&&rule.style)for(const name of rule.style)if(name.startsWith('--'))names.add(name);});}catch{/* Some browsers restrict CSSOM on file URLs. */}});
    document.querySelectorAll('.ds-swatch code').forEach(code=>names.add(code.textContent));
    const tokens=Object.fromEntries([...names].map(name=>[name,computed.getPropertyValue(name).trim()]));
    const url=URL.createObjectURL(new Blob([JSON.stringify({theme:root.dataset.theme||'light',tokens},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='nova-island-tokens.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);nova.notify('Tokens 已导出');
  });
  const tagSpec=[...document.querySelectorAll('.ds-specimen')].find(s=>s.querySelector('h3')?.textContent==='Tag');
  const initialTags=tagSpec.querySelector('.ds-row').innerHTML;
  function wireTags(){tagSpec.querySelectorAll('.ds-tag button').forEach(b=>b.onclick=()=>b.closest('.ds-tag').remove());tagSpec.querySelector('.ds-button').onclick=()=>{tagSpec.querySelector('.ds-row').innerHTML=initialTags;wireTags();};}wireTags();
  document.querySelectorAll('.ds-check').forEach(label=>{if(label.textContent.includes('部分课程'))label.querySelector('input').indeterminate=true;});
  document.querySelectorAll('.ds-tooltip').forEach(wrapper=>{
    const button=wrapper.querySelector('button');let tip;
    function show(){if(tip)return;tip=document.createElement('span');tip.id='html-tooltip';tip.setAttribute('role','tooltip');tip.textContent='将当前内容加入学习清单';wrapper.append(tip);button.setAttribute('aria-describedby',tip.id);}
    function hide(){tip?.remove();tip=null;button.removeAttribute('aria-describedby');}
    wrapper.onmouseenter=show;wrapper.onmouseleave=hide;button.onfocus=show;button.onblur=hide;button.onkeydown=e=>{if(e.key==='Escape')hide();};
  });
  let progress=40;
  const range=document.querySelector('input[type="range"]');
  function changeProgress(value){progress=Math.min(100,Number(value));range.value=progress;document.querySelectorAll('#content .ds-progress-wrap').forEach(w=>{const name=w.querySelector('[role="progressbar"]').getAttribute('aria-label');if(!['尚未开始','已完成'].includes(name))nova.progress(w,progress);});document.querySelectorAll('#content .ds-continue-card [role="status"]').forEach(s=>s.textContent=Math.round(progress*6/100)+' / 6 节已完成');}
  range.addEventListener('input',()=>changeProgress(range.value));
  document.querySelectorAll('#content .ds-continue-card .ds-button,#content .ds-course-card .ds-button').forEach(button=>button.addEventListener('click',()=>{if(button.textContent.includes('查看')){location.href='course.html';return;}changeProgress(progress+10);nova.notify('学习进度已更新');}));
  document.querySelectorAll('#content .ds-lesson:not(:disabled)').forEach(button=>button.addEventListener('click',()=>{const parent=button.parentElement;parent.querySelectorAll('.ds-lesson.current').forEach(b=>{b.classList.replace('current','available');b.removeAttribute('aria-current');});button.classList.add('current');button.setAttribute('aria-current','step');nova.notify(button.querySelector('.ds-lesson-title').textContent);}));
  document.querySelectorAll('#actions button:not(:disabled)').forEach(button=>button.addEventListener('click',()=>nova.notify((button.getAttribute('aria-label')||button.textContent.trim())+'：演示操作已触发')));
  document.querySelectorAll('#states button:not(:disabled)').forEach(button=>button.addEventListener('click',()=>{
    if(button.textContent==='重播入场动画'){const sample=button.parentElement.querySelector('.ds-page-entrance');sample.replaceWith(sample.cloneNode(true));}
    else if(button.textContent==='重新加载'){button.disabled=true;button.textContent='加载中';button.setAttribute('aria-busy','true');setTimeout(()=>{button.disabled=false;button.textContent='重新加载';button.removeAttribute('aria-busy');button.parentElement.querySelector('p').textContent='课程内容加载完成。';},1200);}
    else nova.notify(button.textContent.includes('重试')?'重试成功，演示反馈':'演示操作已触发');
  }));
  filter();
})();
