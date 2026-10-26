(() => {
 const toast=document.querySelector('.toast');let timer;
 function notify(message){toast.textContent=message;toast.hidden=false;clearTimeout(timer);timer=setTimeout(()=>toast.hidden=true,2400);}
 document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(button.dataset.copy);notify('已复制 '+button.dataset.copy);}catch{notify('请手动复制：'+button.dataset.copy);}}));
 document.querySelectorAll('[data-toggle]').forEach(button=>button.addEventListener('click',()=>button.setAttribute('aria-pressed',button.getAttribute('aria-pressed')!=='true')));
 const checkbox=document.querySelector('#demo-check'),chip=document.querySelector('#selected-chip');
 function update(){chip.hidden=!checkbox.checked;}
 checkbox.addEventListener('change',update);
 [chip,document.querySelector('#clear-filter')].forEach(button=>button.addEventListener('click',()=>{checkbox.checked=false;update();}));
})();
