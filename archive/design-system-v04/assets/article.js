(() => {
  const article=document.querySelector('.article-prose');
  const buttons=[...document.querySelectorAll('button[aria-pressed]')];
  const fontButton=buttons.find(b=>b.getAttribute('aria-label')==='切换大字号阅读');
  const saveButtons=buttons.filter(b=>b!==fontButton);
  let saved=false;
  fontButton.addEventListener('click',()=>{
    const large=article.classList.toggle('is-large'); fontButton.setAttribute('aria-pressed',large);
  });
  saveButtons.forEach(button=>button.addEventListener('click',()=>{
    saved=!saved;
    saveButtons.forEach(b=>{b.setAttribute('aria-pressed',saved);b.textContent=saved?'已收藏 ✓':'收藏文章';});
    nova.notify(saved?'已收藏，当前页面内有效':'已取消收藏');
  }));
})();
