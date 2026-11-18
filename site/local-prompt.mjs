// Small local model: explain curated facts, never decide commercial terms.
export function advisorFacts(question){
 const t=String(question).toLowerCase();
 if(/backup|failover|outage/.test(t))return 'Internet failover is a second connection used when the main internet connection fails. It can help keep online appointments, billing and communication available. It does not back up files or supply electricity. Coverage and equipment must be checked.';
 if(/email|workspace|mail/.test(t))return 'Business email gives team members work email accounts. Choose the number of accounts the team needs. If the business already has suitable email, avoid paying for duplicate accounts. Review the selected products in the quote.';
 if(/mobile|calls|phone/.test(t))return 'Business mobile lines help staff make work calls and use mobile data. Choose only the number of lines the business needs. Review the selected plan and quantities in the quote.';
 if(/kyc|document|consent|privacy/.test(t))return 'This prototype asks for consent before local document extraction. Extracted fields can be corrected. Registry checks are simulated. A flagged document needs human review. KYC completion is separate from installation.';
 if(/bundle|recommend|clinic|office|shop|business|need/.test(t))return 'Choose internet for business connectivity, mobile lines for staff who need them, and email accounts for the people who use them. Add internet failover only if downtime is a concern. Avoid duplicate services. Review the editable quote before proceeding.';
 return null;
}
export function useGeneratedExplanation(question){return !!advisorFacts(question)&&!/(price|cost|budget|discount|free|₹|\brs\b|rupee|install|time|sla|guarantee|approve|eligible|contract|tax|refund|ignore|instruction|system|pretend)/i.test(question);}
export function makeLocalMessages({question}){
 return [{role:'user',content:`Explain this to a small business owner in two short sentences. Use only these facts: ${advisorFacts(question)||'Use the guided advisor to choose your business services.'}`}];
}
export function checkGeneratedExplanation(text,question){
 const s=String(text).replace(/^\s*\d+[.)]\s+/gm,'').trim();
 // Conservative screen, not a proof of factual correctness. Quote remains authoritative.
 if(s.length<25||s.length>650||/[0-9₹$€£]/.test(s)||/guarantee|unlimited|free of charge|approved|compliant|patient records|medical history|sensitive data|power outage|electricity supply|cloud storage|data backup/i.test(s))return false;
 if(/backup|failover|outage/i.test(question)&&!(/connection|internet/i.test(s)))return false;
 return true;
}
