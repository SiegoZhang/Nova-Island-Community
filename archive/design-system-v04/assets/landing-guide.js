(() => {
 const dialog=document.querySelector('.lg-dialog');let trigger;
 document.querySelectorAll('[data-contact]').forEach(button=>button.addEventListener('click',()=>{trigger=button;dialog.showModal();dialog.querySelector('h2').focus();}));
 dialog.querySelector('.lg-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 dialog.addEventListener('close',()=>trigger?.focus());
})();
