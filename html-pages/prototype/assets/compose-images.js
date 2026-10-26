// Attachments live with each local draft/post; the body stores short image references.
function composeImages(form){
 try{const body=form.elements.body.value;return JSON.parse(form.elements.images.value||'[]').filter(image=>body.includes('(attachment:'+image.id+')'));}catch{return [];}
}
function composeImageMarkup(line,images){
 const match=line.match(/^!\[([^\]]*)\]\(attachment:([\w-]+)\)$/);
 if(!match)return null;
 const item=images.find(image=>image.id===match[2]);
 if(!item||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(item.src))return '<p class="forum-image-missing">图片暂不可用</p>';
 return `<figure class="compose-body-image"><img src="${item.src}" alt="${escapeHtml(match[1])}" loading="lazy" decoding="async"></figure>`;
}
async function prepareComposeImage(file){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('请选择 JPG、PNG 或 WebP 图片。');
 if(file.size>10*1024*1024)throw new Error('单张图片不能超过 10 MB。');
 const bitmap=await createImageBitmap(file);
 try{
  const ratio=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
  canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
  return {id:crypto.randomUUID(),src:canvas.toDataURL('image/webp',.82)};
 }finally{bitmap.close();}
}
document.addEventListener('click',e=>{
 const button=e.target.closest('[data-compose-image]');if(!button)return;
 const form=button.closest('form'),body=form.elements.body;
 form.imageInsertion={start:body.selectionStart,end:body.selectionEnd};
 form.querySelector('[data-compose-image-file]').click();
});
document.addEventListener('change',async e=>{
 if(!e.target.matches('[data-compose-image-file]'))return;
 const picker=e.target,form=picker.form,files=[...picker.files];picker.value='';if(!files.length)return;
 const button=form.querySelector('[data-compose-image]'),error=form.querySelector('#forum-error');
 button.disabled=true;button.setAttribute('aria-busy','true');error.hidden=true;
 try{
  const images=composeImages(form);
  if(images.length+files.length>8)throw new Error('每篇内容最多插入 8 张图片。');
  const additions=[];for(const file of files)additions.push(await prepareComposeImage(file));
  if(!form.isConnected)return;
  if(JSON.stringify([...images,...additions]).length>2000000)throw new Error('图片总大小过大，请减少图片或选择尺寸更小的图片。');
  const preview=form.querySelector('[data-preview-forum]');if(preview.getAttribute('aria-pressed')==='true')preview.click();
  const body=form.elements.body,point=form.imageInsertion||{start:body.selectionStart,end:body.selectionEnd};
  const insertion='\n'+additions.map((item,index)=>`![${files[index].name.replace(/[\[\]\r\n]/g,' ').replace(/\.[^.]+$/,'')}](attachment:${item.id})`).join('\n')+'\n';
  if(body.value.length-(point.end-point.start)+insertion.length>50000)throw new Error('正文已达到字数上限，请先缩短内容。');
  form.elements.images.value=JSON.stringify([...images,...additions]);
  body.setRangeText(insertion,point.start,point.end,'end');body.focus();
  if(saveDocumentDraft(form))notify('图片已插入，可预览正文查看效果');
 }catch(err){if(form.isConnected){error.textContent=err.message||'图片读取失败，请重试。';error.hidden=false;}}
 finally{button.disabled=false;button.removeAttribute('aria-busy');}
});
