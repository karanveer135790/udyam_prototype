// Never repair identifiers or fill fields from registry matches: OCR candidates need human confirmation.
export function parseDocument(text,type){let lines=String(text).split(/\r?\n/).map(x=>x.trim()).filter(Boolean),flat=lines.join('\n'),out={};
const date='(20\\d{2}-\\d{2}-\\d{2})';
function value(label){let re=new RegExp('^'+label+'\\s*[:：]?\\s*(.*)$','i');for(let i=0;i<lines.length;i++){let m=lines[i].match(re);if(m)return m[1].trim()||lines[i+1]||'';}return '';}
if(type==='gst'){let id=flat.match(/\b\d{2}[A-Z0-9]{13}\b/);if(id)out.gstin=id[0];let name=value('Legal name');if(name)out.name=name;}
if(type==='udyam'){let id=flat.match(/UDYAM-[A-Z]{2}-\d{2}-\d{7}/i);if(id)out.udyam=id[0].toUpperCase();}
if(type==='id'){let val=value('Valid till');let m=val.match(new RegExp(date));if(m)out.expiry=m[1];}
if(type==='address'){let val=value('Bill date');let m=val.match(new RegExp(date));if(m)out.proof=m[1];}
return out;}
export function maskText(text){return String(text).replace(/\b\d{2}[A-Z0-9]{13}\b/g,x=>'•••••••••••'+x.slice(-4)).replace(/UDYAM-[A-Z]{2}-\d{2}-\d{7}/gi,x=>'UDYAM-••-••-•••'+x.slice(-4)).replace(/SYN-ID-\d+/g,'SYN-ID-••••••');}
