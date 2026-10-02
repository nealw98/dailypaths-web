const origins = new Set(['https://dailypaths.org','https://www.dailypaths.org','https://daily-paths-soft-daylight.nealw98.chatgpt.site']);
const resendKey=()=>Deno.env.get('RESEND_API_KEY')||'', fromAddress=()=>Deno.env.get('NEWSLETTER_FROM')||'';
const sendingConfigured=()=>!!(resendKey()&&fromAddress());
// Same wording for every address; it depends only on whether sending is set up.
const messageText=()=>sendingConfigured()?"Almost done. Check your email and tap the link to confirm your signup.":"You're on the list. We'll email you when updates begin.";
async function sendConfirmation(email:string,token:string,site:string){
 const link=site+'/email/confirm/?token='+token;
 const text='Thanks for signing up for Daily Paths.\n\nPlease confirm your email address by opening this link:\n'+link+'\n\nIf you did not sign up, you can ignore this message and nothing more will be sent.\n\nDaily Paths';
 const font="Georgia,'Times New Roman',serif", sans="Helvetica,Arial,sans-serif";
 const html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Please confirm your Daily Paths email updates</title></head>'
  +'<body style="margin:0;padding:0;background-color:#f4f1ea;">'
  +'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f1ea"><tr><td align="center" style="padding:32px 16px;">'
  +'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#ffffff;border-radius:8px;">'
  +'<tr><td align="center" style="padding:32px 32px 8px 32px;"><img src="https://dailypaths.org/assets/app-icon.png" width="64" height="64" alt="Daily Paths" border="0" style="display:block;border-radius:14px;"></td></tr>'
  +'<tr><td align="center" style="padding:8px 32px 0 32px;font-family:'+font+';font-style:italic;font-size:26px;line-height:32px;color:#1b4d54;">Daily Paths</td></tr>'
  +'<tr><td style="padding:24px 32px 0 32px;font-family:'+font+';font-size:20px;line-height:28px;color:#2b2b2b;">Thanks for signing up.</td></tr>'
  +'<tr><td style="padding:12px 32px 0 32px;font-family:'+sans+';font-size:16px;line-height:25px;color:#444444;">Please confirm your email address, and we&rsquo;ll send you a short note with each new daily reflection.</td></tr>'
  +'<tr><td align="center" style="padding:28px 32px 8px 32px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#1b4d54" style="background-color:#1b4d54;border-radius:6px;"><a href="'+link+'" style="display:inline-block;padding:14px 28px;font-family:'+sans+';font-size:16px;line-height:20px;font-weight:bold;color:#ffffff;text-decoration:none;">Confirm my email address</a></td></tr></table></td></tr>'
  +'<tr><td style="padding:20px 32px 0 32px;font-family:'+sans+';font-size:13px;line-height:20px;color:#777777;">Button not working? Copy this link into your browser:<br><a href="'+link+'" style="color:#1b4d54;word-break:break-all;">'+link+'</a></td></tr>'
  +'<tr><td style="padding:24px 32px 32px 32px;font-family:'+sans+';font-size:13px;line-height:20px;color:#777777;border-top-width:0;">If you didn&rsquo;t sign up, you can ignore this message. Nothing more will be sent.</td></tr>'
  +'</table></td></tr></table></body></html>';
 const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+resendKey(),'Content-Type':'application/json'},body:JSON.stringify({from:fromAddress(),reply_to:[Deno.env.get('NEWSLETTER_REPLY_TO')||'support@dailypaths.org'],to:[email],subject:'Please confirm your Daily Paths email updates',text,html})});
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
