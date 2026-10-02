const origins = new Set(['https://dailypaths.org','https://www.dailypaths.org','https://daily-paths-soft-daylight.nealw98.chatgpt.site']);
const resendKey=()=>Deno.env.get('RESEND_API_KEY')||'', fromAddress=()=>Deno.env.get('NEWSLETTER_FROM')||'';
const sendingConfigured=()=>!!(resendKey()&&fromAddress());
// Same wording for every address; it depends only on whether sending is set up.
const messageText=()=>sendingConfigured()?"Almost done. Check your email and tap the link to confirm your signup.":"You're on the list. We'll email you when updates begin.";
async function sendConfirmation(email:string,token:string,site:string){
 const link=site+'/email/confirm/?token='+token;
 const text='Thanks for signing up for Daily Paths.\n\nPlease confirm your email address by opening this link:\n'+link+'\n\nIf you did not sign up, you can ignore this message and nothing more will be sent.\n\nDaily Paths';
 // Matches the website: warm-white paper, olive accent, Newsreader / Cormorant / Manrope (web fonts load in Apple Mail; others use the fallbacks).
 const serif="Newsreader,Georgia,'Times New Roman',serif", wordmark="'Cormorant Garamond',Georgia,'Times New Roman',serif", sans="Manrope,Helvetica,Arial,sans-serif";
 const fonts='https://dailypaths.org/assets/fonts/';
 const css='@font-face{font-family:Newsreader;font-style:normal;font-weight:400 600;src:url('+fonts+'newsreader-normal-latin.woff2) format("woff2");}'
  +'@font-face{font-family:"Cormorant Garamond";font-style:italic;font-weight:500 600;src:url('+fonts+'cormorant-garamond-italic-latin.woff2) format("woff2");}'
  +'@font-face{font-family:Manrope;font-style:normal;font-weight:400 600;src:url('+fonts+'manrope-normal-latin.woff2) format("woff2");}';
 const html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Please confirm your Daily Paths email updates</title><style>'+css+'</style></head>'
  +'<body style="margin:0;padding:0;background-color:#faf9f5;">'
  +'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#faf9f5"><tr><td align="center" style="padding:32px 20px 40px 20px;">'
  +'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:540px;">'
  +'<tr><td style="padding:0 0 18px 0;border-bottom:1px solid #dfdfd3;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>'
  +'<td valign="middle" style="padding-right:12px;"><img src="https://dailypaths.org/assets/app-icon.png" width="42" height="42" alt="" border="0" style="display:block;border-radius:9px;"></td>'
  +'<td valign="middle" style="font-family:'+wordmark+';font-style:italic;font-weight:600;font-size:31px;line-height:36px;letter-spacing:-0.35px;color:#4f5b3d;">Daily Paths</td></tr></table></td></tr>'
  +'<tr><td style="padding:32px 0 0 0;font-family:'+serif+';font-weight:500;font-size:30px;line-height:35px;letter-spacing:-0.3px;color:#34382e;">Please confirm your email.</td></tr>'
  +'<tr><td style="padding:14px 0 0 0;font-family:'+serif+';font-size:19px;line-height:30px;color:#34382e;">Thanks for signing up. Confirm your address, and we&rsquo;ll send you a short note with each new daily reflection, with a link to read it on the site.</td></tr>'
  +'<tr><td style="padding:26px 0 0 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#4f5b3d" style="background-color:#4f5b3d;border-radius:2px;"><a href="'+link+'" style="display:inline-block;padding:14px 24px;font-family:'+sans+';font-size:15px;line-height:20px;font-weight:500;color:#ffffff;text-decoration:none;">Confirm my email address</a></td></tr></table></td></tr>'
  +'<tr><td style="padding:26px 0 0 0;font-family:'+sans+';font-size:13px;line-height:21px;color:#66685d;">If the button doesn&rsquo;t work, copy this link into your browser:<br><a href="'+link+'" style="color:#4f5b3d;text-decoration:underline;word-break:break-all;">'+link+'</a></td></tr>'
  +'<tr><td style="padding:28px 0 0 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #dfdfd3;padding-top:16px;font-family:'+sans+';font-size:13px;line-height:21px;color:#66685d;">If you didn&rsquo;t sign up, you can ignore this message. Nothing more will be sent.</td></tr></table></td></tr>'
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
     // Existing address. A still-pending one gets a fresh link at most hourly. An unsubscribed one may rejoin, but only
     // by confirming a new link (which proves they own the address), and old links stop working. Suppressed addresses never rejoin.
     const cutoff=new Date(Date.now()-3600000).toISOString();
     const found=(await (await fetch(url+'/rest/v1/newsletter_subscribers?email=eq.'+encodeURIComponent(email)+'&select=status,confirm_token,confirmation_sent_at',{headers:dbHeaders})).json())[0];
     if(found?.status==='pending'&&(!found.confirmation_sent_at||found.confirmation_sent_at<cutoff))token=found.confirm_token;
     else if(found?.status==='unsubscribed'){
      const fresh=crypto.randomUUID();
      const now=new Date().toISOString();
      const back=await fetch(url+'/rest/v1/newsletter_subscribers?email=eq.'+encodeURIComponent(email)+'&status=eq.unsubscribed',{method:'PATCH',headers:{...dbHeaders,Prefer:'return=minimal'},body:JSON.stringify({status:'pending',confirm_token:fresh,confirmed_at:null,unsubscribed_at:null,confirmation_sent_at:null,consent_at:now,consent_version:'2026-09-24'})});
      if(back.ok)token=fresh;
     }
    }
    if(token&&await sendConfirmation(email,token,origin)){
     await fetch(url+'/rest/v1/newsletter_subscribers?email=eq.'+encodeURIComponent(email),{method:'PATCH',headers:{...dbHeaders,Prefer:'return=minimal'},body:JSON.stringify({confirmation_sent_at:new Date().toISOString()})});
    }
   }catch{/* signup is saved; a later attempt can resend the link */}
  }
  // Same response for new and existing addresses, so the form never reveals who is on the list.
  return reply(200,{message:messageText()});
 }catch{return reply(503,{error:'Signup is temporarily unavailable. Please try again later.'});}
});
