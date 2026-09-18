/* Shared native browser behavior. No router, framework or network dependency. */
(() => {
  const root = document.querySelector('.nova-ds');
  let toastTimer;
  window.nova = {
    notify(message) {
      let toast = root.querySelector('.ds-toast');
      if (!toast) { toast = document.createElement('div'); toast.className = 'ds-toast'; toast.setAttribute('role','status'); root.append(toast); }
      toast.textContent = message; toast.hidden = false;
      clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
    },
    async copy(text) {
      try { await navigator.clipboard.writeText(text); this.notify('已复制'); }
      catch { this.notify('浏览器不允许自动复制，请手动复制。'); }
    },
    progress(container, value) {
      const bar = container.querySelector('[role="progressbar"]');
      if (!bar) return;
      bar.setAttribute('aria-valuenow', value); bar.firstElementChild.style.width = value + '%';
      const label = bar.closest('.ds-progress-wrap')?.querySelector('.ds-mono');
      if (label) label.textContent = value + '%';
    }
  };
  document.querySelectorAll('.ds-motion-toggle').forEach(button => button.addEventListener('click', () => {
    const paused = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', paused); button.textContent = paused ? '开启动态' : '暂停动态';
    button.closest('.ds-continue-card').querySelector('.ds-fluid-orb').classList.toggle('is-paused', paused);
  }));
  // Continuous HookSidebar rails; spring matches stiffness 420 / damping 34 / mass .7.
  document.querySelectorAll('.ds-article-contents').forEach(nav => {
    const list = nav.querySelector('ol');
    const links = [...list.querySelectorAll('a')];
    const rails = [...nav.querySelectorAll('.ds-hook-rail')];
    const scrollArea = nav.closest('.ds-main') || document.documentElement;
    let active = 0, hover = null, focus = null;
    const springs = rails.map(() => ({ y:0, from:0, vy:0, vf:0, frame:0, initialized:false }));
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function rail(index, from, y, visible) {
      const svg = rails[index], spring = springs[index], path = svg.querySelector('path');
      svg.dataset.visible = String(visible);
      if (!visible) return;
      cancelAnimationFrame(spring.frame);
      if (!spring.initialized || reduced.matches) Object.assign(spring, {from,y,vf:0,vy:0,initialized:true});
      let previous = 0;
      const tick = time => {
        const dt = previous ? Math.min((time-previous)/1000,.032) : 1/60; previous=time;
        for(let n=0;n<4;n++) { const d=dt/4; spring.vf+=(420*(from-spring.from)-34*spring.vf)/.7*d; spring.vy+=(420*(y-spring.y)-34*spring.vy)/.7*d; spring.from+=spring.vf*d; spring.y+=spring.vy*d; }
        const done = reduced.matches || Math.abs(y-spring.y)+Math.abs(from-spring.from)+Math.abs(spring.vf)+Math.abs(spring.vy)<.05;
        if(done) Object.assign(spring,{from,y,vf:0,vy:0});
        const corner=Math.max(0,spring.y-6);
        path.setAttribute('d',`M2.5 ${Math.min(spring.from,corner)} V${corner} a6 6 0 0 0 6 6 H14`);
        if(!done) spring.frame=requestAnimationFrame(tick);
      };
      spring.frame=requestAnimationFrame(tick);
    }
    function paint() {
      const centers=links.map(link=>link.parentElement.offsetTop+link.parentElement.offsetHeight/2);
      const y=centers[active] || 0, preview=hover ?? focus, hy=preview===null?0:centers[preview];
      links.forEach((link,i)=>{ if(i===active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
      rail(1,0,y,!!links.length);
      rail(0,hy<=y?Math.max(0,hy-6):y,hy,preview!==null && preview!==active);
    }
    function update() {
      const top=scrollArea.getBoundingClientRect().top+161;
      active=0;
      links.forEach((link,i)=>{ const section=document.getElementById(decodeURIComponent(link.hash.slice(1))); if(section && section.getBoundingClientRect().top<=top) active=i; });
      paint();
    }
    links.forEach((link,i)=>{
      link.addEventListener('mouseenter',()=>{hover=i;paint();});
      link.addEventListener('focus',()=>{focus=i;paint();});
      link.addEventListener('blur',()=>{focus=null;paint();});
      link.addEventListener('click',()=>{active=i;paint();requestAnimationFrame(update);});
    });
    list.parentElement.addEventListener('mouseleave',()=>{hover=null;paint();});
    scrollArea.addEventListener('scroll',update,{passive:true});
    window.addEventListener('hashchange',update);
    const resize=new ResizeObserver(update); resize.observe(list); resize.observe(scrollArea);
    update();
  });
})();
