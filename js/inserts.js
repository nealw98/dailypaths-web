/* Shared progressive enhancement for editorial artwork and safety references. */
(() => {
 const init=async()=>{
  await document.fonts.ready;
  const imageSelector='.story-insert:not(.story-insert-transcript *) img, .tg-diagram img';
  const images=[...document.querySelectorAll(imageSelector)];
  const safety=[...document.querySelectorAll('.boundary-insert--safety,.dp-text-panel--safety')].filter(x=>!x.closest('.story-insert-transcript'));
  if(!images.length&&!safety.length)return;
  const dialog=document.createElement('dialog');dialog.className='insert-view';dialog.setAttribute('aria-label','Enlarged insert');
  dialog.innerHTML='<div class="insert-toolbar"><button type="button" data-close>Close</button><button type="button" data-out aria-label="Zoom out">−</button><button type="button" data-in aria-label="Zoom in">+</button><button type="button" data-fit>Fit</button><span aria-live="polite" class="insert-zoom-status"></span></div><div class="insert-viewport"><div class="insert-canvas"></div></div>';
  document.body.append(dialog);
  const viewport=dialog.querySelector('.insert-viewport'),canvas=dialog.querySelector('.insert-canvas'),status=dialog.querySelector('.insert-zoom-status');
  let trigger,zoom=1,baseWidth=800,scrollPosition,previousOverflow,content;
  const size=()=>{const w=Math.max(1,viewport.clientWidth-24);canvas.style.width=Math.round(w*zoom)+'px';if(content?.classList.contains('insert-safety-copy')){const scale=w*zoom/720;content.style.transform=`scale(${scale})`;canvas.style.height=Math.ceil(content.scrollHeight*scale)+'px';}status.textContent=Math.round(zoom*100)+'%';};
  const open=(source,control)=>{
   trigger=control;scrollPosition={x:scrollX,y:scrollY};previousOverflow=document.documentElement.style.overflow;
   content=source.cloneNode(true);content.removeAttribute('id');content.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));
   if(source.tagName==='IMG'){content.removeAttribute('loading');content.style.cssText='display:block;width:100%;height:auto;max-width:none';baseWidth=source.naturalWidth||800;}
   else {content.classList.add('insert-safety-copy');content.style.cssText='width:720px;max-width:none;margin:0;transform-origin:top left;';baseWidth=720;}
   canvas.style.height='auto';canvas.replaceChildren(content);zoom=1;dialog.showModal();document.documentElement.style.overflow='hidden';size();viewport.scrollTo(0,0);dialog.querySelector('[data-close]').focus({preventScroll:true});
  };
  dialog.querySelector('[data-close]').onclick=()=>dialog.close();
  dialog.querySelector('[data-in]').onclick=()=>{zoom=Math.min(4,zoom+.5);size();};
  dialog.querySelector('[data-out]').onclick=()=>{zoom=Math.max(1,zoom-.5);size();};
  dialog.querySelector('[data-fit]').onclick=()=>{zoom=1;size();viewport.scrollTo(0,0);};
  dialog.addEventListener('close',()=>{document.documentElement.style.overflow=previousOverflow;trigger?.focus({preventScroll:true});window.scrollTo(scrollPosition.x,scrollPosition.y);canvas.replaceChildren();});
  window.addEventListener('resize',()=>{if(dialog.open)size();});
  // Native scrolling handles touch panning; dragging also pans with a mouse.
  let drag;
  viewport.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||zoom<=1||e.target.closest('a,button'))return;drag={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(e.pointerId);e.preventDefault();});
  viewport.addEventListener('pointermove',e=>{if(drag){viewport.scrollLeft=drag.left+drag.x-e.clientX;viewport.scrollTop=drag.top+drag.y-e.clientY;}});
  viewport.addEventListener('pointerup',()=>drag=null);viewport.addEventListener('pointercancel',()=>drag=null);
  images.forEach(img=>{
   let button=img.closest('button');
   if(!button){button=document.createElement('button');button.type='button';img.before(button);button.append(img);}
   button.classList.add('insert-open');button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-label','Enlarge '+(img.alt||'insert'));button.dataset.editorialImage='';
  });
  // Capture prevents older CMS snapshot listeners from opening a second dialog.
  document.addEventListener('click',event=>{const button=event.target.closest('[data-editorial-image]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();open(button.querySelector('img'),button);},true);
  safety.forEach(panel=>{
   panel.classList.add('insert-safety');
   // Make existing printed numbers actionable without changing their wording.
   panel.innerHTML=panel.innerHTML.replace(/<strong>800-799-SAFE \(7233\)<\/strong>/g,'<a href="tel:+18007997233"><strong>800-799-SAFE (7233)</strong></a>').replace(/<strong>START to 88788<\/strong>/g,'<a href="sms:88788?body=START"><strong>START to 88788</strong></a>');
   const wrapper=document.createElement('div');wrapper.className='insert-safety-frame';panel.before(wrapper);wrapper.append(panel);
   const fit=()=>{const scale=Math.min(1,wrapper.clientWidth/720);panel.style.transform=`scale(${scale})`;wrapper.style.height=Math.ceil(panel.scrollHeight*scale)+'px';};
   new ResizeObserver(fit).observe(wrapper);fit();
   const button=document.createElement('button');button.type='button';button.className='insert-safety-enlarge';button.textContent='Enlarge safety information';wrapper.after(button);button.onclick=()=>open(panel,button);
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
