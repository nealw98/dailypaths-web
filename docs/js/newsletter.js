(() => {
 document.querySelectorAll('[data-newsletter-form]').forEach(form=>{
  const status=form.querySelector('[role="status"]'),button=form.querySelector('button[type="submit"]');
  form.addEventListener('submit',async event=>{
   event.preventDefault();if(!form.reportValidity())return;
   button.disabled=true;status.textContent='Saving your signup…';
   try{
    const response=await fetch(form.dataset.endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+form.dataset.key,apikey:form.dataset.key},body:JSON.stringify({email:form.elements.email.value,website:form.elements.website.value,consent:form.elements.consent.checked}),signal:AbortSignal.timeout(15000)});
    const data=await response.json();if(!response.ok)throw new Error(data.error||'We could not save your signup. Please try again.');
    form.reset();
    // Replace the whole sign-up box with a clear confirmation, so it is obvious the sign-up worked and nothing is left to fill in again.
    const box=form.closest('.site-newsletter');if(box)box.classList.add('is-done');
    status.textContent='';const msg=document.createElement('span');msg.className='newsletter-done-message';msg.textContent=data.message;
    const sub=document.createElement('span');sub.className='newsletter-done-sub';sub.textContent='It can take a minute to arrive. If you don\u2019t see it, check your spam folder.';
    status.append(msg,sub);status.tabIndex=-1;status.focus({preventScroll:false});
   }catch(error){status.textContent=error.name==='TimeoutError'?'The request took too long. Please try again.':error.message||'Check your connection and try again.';}
   finally{button.disabled=false;}
  });
 });
})();
