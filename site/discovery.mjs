import{quote}from'./engine.mjs';
export const defaultNeeds=()=>({currentInternet:'home',currentEmail:'personal',budget:0,lines:2,users:5,backup:false,pos:false,whatsapp:false,sdwan:false,dedicated:false,connectivity:'fibre'});
const count=(v,max=1000)=>Math.max(0,Math.min(max,Math.floor(Number(v)||0)));
export function recommend(segment,profile,needs,catalogue){
 const sites=Math.max(1,count(profile.sites)),employees=Math.max(1,count(profile.employees,100000));let items={},reasons=[],warnings=[];
 const add=(id,n,why)=>{if(n>0){items[id]=n;reasons.push(why);}};
 let base=segment==='micro'?'P01':'P02';
 if(needs.dedicated){if(profile.gst&&employees>=10){base='P05';reasons.push('Dedicated 20 Mbps ILL requested; active GST and minimum 10 employees must be verified.');}else warnings.push('Dedicated ILL needs active GST and at least 10 employees. Fibre is a provisional alternative; request assisted review.');}
 if(needs.connectivity==='wireless'&&!needs.dedicated)base='P04';
 add(base,sites,`${sites} connection(s), one per business site. ${base==='P04'?'Wireless capacity/coverage must be confirmed.':'Physical feasibility must be confirmed.'}`);
 add('P07',count(needs.lines),'Mobile lines follow your requested quantity.');
 const users=Math.min(count(needs.users),employees);
 if(count(needs.users)>employees)warnings.push('Requested user seats exceed team size; capped at team size. Edit the quote if additional users are required.');
 if(needs.currentEmail==='personal')add('P16',users,'Professional email seats replace personal email for the requested users.');
 else reasons.push('Existing business email retained; no duplicate email subscription added.');
 if(segment!=='micro')add('P20',users,'Endpoint security sized to the requested work devices/users; confirm actual device count.');
 if(needs.backup){if(base==='P04')warnings.push('P09 failover cannot depend on AirFiber alone. It was not added; discuss an eligible fibre/ILL primary connection.');else add('P09',sites,'One failover connection per site reduces dependence on the primary link.');}
 if(needs.pos)add('P19',sites,'One POS/billing counter per site assumed; adjust counter quantities in the quote.');
 if(needs.whatsapp){if(profile.gst)add('P15',1,'One WhatsApp Business API account requested; active GST verification required.');else warnings.push('WhatsApp Business API requires active GST. Not added; keep existing tools or seek assisted registration guidance.');}
 if(needs.sdwan){if(profile.gst&&employees>=10&&sites>=3&&base!=='P04')add('P10',sites,'Managed SD-WAN added at every site; 24-month minimum term applies.');else warnings.push('SD-WAN not added: requires active GST, 10+ employees, 3+ sites and eligible fibre/ILL.');}
 if(needs.currentInternet==='business')warnings.push('You already have business internet. Confirm renewal/exit terms before replacing it; no cancellation or savings assumed.');
 let pricing=quote(items,{...profile,sites,employees},catalogue);let budget=count(needs.budget,10000000);
 if(budget&&pricing.monthly>budget)warnings.push(`Monthly subtotal exceeds your budget by ₹${pricing.monthly-budget}, before taxes. No eligible in-budget bundle is promised; remove optional items or request assistance.`);
 return {items,reasons,warnings,pricing,budgetFits:!budget||pricing.monthly<=budget};
}
export function nextQuestion(needs,lang='en'){
 const qs=needs.budget<=0?{en:'What monthly budget should we work within, before taxes?',hi:'टैक्स से पहले आपका मासिक बजट कितना है?',mr:'करांपूर्वी तुमचे मासिक बजेट किती आहे?'}:needs.currentInternet==='unsure'?{en:'Are you using a mobile hotspot, home broadband or business internet today?',hi:'अभी हॉटस्पॉट, घरेलू ब्रॉडबैंड या बिज़नेस इंटरनेट इस्तेमाल करते हैं?',mr:'सध्या हॉटस्पॉट, घरगुती ब्रॉडबँड की बिझनेस इंटरनेट वापरता?'}:{en:'Would an internet outage stop billing or customer service? Select failover if needed.',hi:'इंटरनेट बंद होने से बिलिंग या ग्राहक सेवा रुकती है? ज़रूरत हो तो बैकअप चुनें।',mr:'इंटरनेट बंद झाल्यास बिलिंग किंवा ग्राहक सेवा थांबेल का? गरज असल्यास बॅकअप निवडा.'};return qs[lang]||qs.en;
}
export function captureNeeds(text){
 const t=String(text).toLowerCase().replace(/(\d),(?=\d{3}\b)/g,'$1'),needs={},profile={},changes=[];let segment;
 const number=(pattern,key,target,label)=>{const m=t.match(pattern);if(m){target[key]=Math.max(key==='budget'?0:1,Math.min(1000000,Number(m[1])));changes.push(label+': '+target[key]);}};
 number(/(?:budget|बजट|बजेट)\s*(?:is|of|है|आहे|:)?\s*(?:₹|rs\.?|inr)?\s*(\d+)/i,'budget',needs,'Budget');
 number(/(\d+)\s*(?:employees|staff|people|कर्मचारी|लोग)/i,'employees',profile,'Team size');
 number(/(\d+)\s*(?:sites|locations|branches|दुकानें|शाखा)/i,'sites',profile,'Sites');
 if(/(?:i (?:run|own|have)|we run|my business is)\s+(?:a\s+)?(?:shop|salon|retail)/i.test(t)){segment='micro';changes.push('Business: local retail/services');}
 if(/(?:i (?:run|own|have)|we run|my business is)\s+(?:a\s+)?(?:clinic|office|coaching)/i.test(t)){segment='office';changes.push('Business: professional office');}
 if(/(?:i (?:run|own|have)|we run|my business is)\s+(?:a\s+)?(?:factory|manufactur)/i.test(t)){segment='manufacturing';changes.push('Business: manufacturing');}
 if(/(?:need|want)\s+(?:a\s+)?(?:backup|failover)/i.test(t)){needs.backup=true;changes.push('Failover requested');}
 if(/(?:do not|don't|no)\s+(?:need|want)\s+(?:a\s+)?(?:backup|failover)/i.test(t)){needs.backup=false;changes.push('Failover not requested');}
 if(/(?:already have|already use)\s+(?:business|professional)\s+email/i.test(t)){needs.currentEmail='business';changes.push('Existing business email');}
 return {needs,profile,segment,changes};
}
