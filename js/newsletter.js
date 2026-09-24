(() => {
 document.querySelectorAll('[data-newsletter-form]').forEach(form=>{
  const status=form.querySelector('[role="status"]'),button=form.querySelector('button[type="submit"]');
  form.addEventListener('submit',async event=>{
   event.preventDefault();if(!form.reportValidity())return;
   button.disabled=true;status.textContent='Saving your signup…';
   try{
    const response=await fetch(form.dataset.endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+form.dataset.key,apikey:form.dataset.key},body:JSON.stringify({email:form.elements.email.value,website:form.elements.website.value,consent:form.elements.consent.checked}),signal:AbortSignal.timeout(15000)});
    const data=await response.json();if(!response.ok)throw new Error(data.error||'We could not save your signup. Please try again.');
    status.textContent=data.message;form.reset();
   }catch(error){status.textContent=error.name==='TimeoutError'?'The request took too long. Please try again.':error.message||'Check your connection and try again.';}
   finally{button.disabled=false;}
  });
 });
})();
