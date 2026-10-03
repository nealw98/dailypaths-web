// One delegated listener also handles CMS pages that retain another guide's scripts.
document.addEventListener('click',event=>{
 const trigger=event.target.closest?.('[data-story-insert]');if(!trigger)return;
 const source=trigger.querySelector('img');if(!source)return;
 const dialog=document.createElement('dialog');dialog.className='story-insert-dialog';dialog.setAttribute('aria-label',source.alt||'Enlarged insert');
 const close=document.createElement('button');close.type='button';close.textContent='Close';close.autofocus=true;close.onclick=()=>dialog.close();
 const image=source.cloneNode();dialog.append(close,image);document.body.append(dialog);const top=window.scrollY;
 dialog.addEventListener('close',()=>{dialog.remove();trigger.focus({preventScroll:true});window.scrollTo({top});},{once:true});
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.showModal();
});
