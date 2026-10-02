const origins = new Set(['https://dailypaths.org','https://www.dailypaths.org','https://daily-paths-soft-daylight.nealw98.chatgpt.site']);
const resendKey=()=>Deno.env.get('RESEND_API_KEY')||'', fromAddress=()=>Deno.env.get('NEWSLETTER_FROM')||'';
const sendingConfigured=()=>!!(resendKey()&&fromAddress());
// Same wording for every address; it depends only on whether sending is set up.
const messageText=()=>sendingConfigured()?"Almost done. Check your email and tap the link to confirm your signup.":"You're on the list. We'll email you when updates begin.";
async function sendConfirmation(email:string,token:string,site:string){
 const link=site+'/email/confirm/?token='+token;
 const text='Thanks for signing up for Daily Paths.\n\nPlease confirm your email address by opening this link:\n'+link+'\n\nIf you did not sign up, you can ignore this message and nothing more will be sent.\n\nDaily Paths';
 const html='<p>Thanks for signing up for Daily Paths.</p><p><a href="'+link+'">Confirm my email address</a></p><p>If you did not sign up, you can ignore this message and nothing more will be sent.</p><p>Daily Paths</p>';
 const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+resendKey(),'Content-Type':'application/json'},body:JSON.stringify({from:fromAddress(),to:[email],subject:'Please confirm your Daily Paths email updates',text,html})});
 return r.ok;
}
Deno.serve(async (req: Request) => {
 const origin=req.headers.get('origin')||'';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin',...(origins.has(origin)?{'Access-Control-Allow-Origin':origin}:{}),'Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
 const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers});
 if(!origins.has(origin))return reply(403,{error:'Please use the signup form on Daily Paths.'});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply(405,{error:'Method not allowed.'});
 if(!req.headers.get('content-type')?.includes('application/json'))return reply(415,{error:'Expected JSON.'});
 try {
  // Bound the request body even when Content-Length is absent.
  const reader=req.body?.getReader();if(!reader)return reply(400,{error:'Enter your email address.'});
  let size=0;const chunks:Uint8Array[]=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2048){await reader.cancel();return reply(413,{error:'Request too large.'});}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  let data;try{data=JSON.parse(new TextDecoder().decode(bytes));}catch{return reply(400,{error:'Please check your email address.'});}
  if(data?.website)return reply(200,{message:messageText()}); // bot honeypot
  const email=typeof data?.email==='string'?data.email.trim().toLowerCase():'';
  if(email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)||email.split('@').length!==2)return reply(400,{error:'Enter a valid email address.'});
  if(data.consent!==true)return reply(400,{error:'Please agree to receive Daily Paths emails.'});
  const url=Deno.env.get('SUPABASE_URL')!,key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  if(!url||!key)return reply(503,{error:'Signup is temporarily unavailable. Please try again later.'});
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0].trim()||req.headers.get('cf-connecting-ip')||'unknown';
  const bucketBytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key+'|'+Math.floor(Date.now()/3600000)+'|'+ip));
  const bucket=Array.from(new Uint8Array(bucketBytes),b=>b.toString(16).padStart(2,'0')).join('');
  const dbHeaders={'apikey':key,'Authorization':'Bearer '+key,'Content-Type':'application/json'};
  const limit=await fetch(url+'/rest/v1/rpc/newsletter_allow_signup',{method:'POST',headers:dbHeaders,body:JSON.stringify({p_bucket:bucket})});
  if(!limit.ok)return reply(503,{error:'Signup is temporarily unavailable. Please try again later.'});
  if(await limit.json()!==true)return reply(429,{error:'Too many attempts. Please try again in an hour.'});
  const saved=await fetch(url+'/rest/v1/newsletter_subscribers?on_conflict=email&select=confirm_token',{method:'POST',headers:{...dbHeaders,Prefer:'resolution=ignore-duplicates,return=representation'},body:JSON.stringify({email,signup_site:origin.includes('chatgpt.site')?'development':'production',consent_version:'2026-09-24'})});
  if(!saved.ok)return reply(503,{error:'We could not save your signup. Please try again later.'});
  if(sendingConfigured()){
   try{
    const created=await saved.json();
    let token:string|null=created[0]?.confirm_token??null;
    if(!token){
     // Existing address: only a still-pending one gets a fresh link, at most hourly. Never reactivates an unsubscribe.
     const cutoff=new Date(Date.now()-3600000).toISOString();
     const again=await (await fetch(url+'/rest/v1/newsletter_subscribers?email=eq.'+encodeURIComponent(email)+'&status=eq.pending&or=(confirmation_sent_at.is.null,confirmation_sent_at.lt.'+cutoff+')&select=confirm_token',{headers:dbHeaders})).json();
     token=again[0]?.confirm_token??null;
    }
    if(token&&await sendConfirmation(email,token,origin)){
     await fetch(url+'/rest/v1/newsletter_subscribers?email=eq.'+encodeURIComponent(email),{method:'PATCH',headers:{...dbHeaders,Prefer:'return=minimal'},body:JSON.stringify({confirmation_sent_at:new Date().toISOString()})});
    }
   }catch{/* signup is saved; a later attempt can resend the link */}
  }
  // Same response for new/existing addresses. Never reactivate an unsubscribe.
  return reply(200,{message:messageText()});
 }catch{return reply(503,{error:'Signup is temporarily unavailable. Please try again later.'});}
});
