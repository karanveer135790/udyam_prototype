import{parseDocument,maskText}from'./ocr-parser.mjs';
let worker=null;
export async function stopOCR(){let w=worker;worker=null;if(w)await w.terminate();}
export async function extractImage(file,type,onProgress=()=>{}){
 if(!['image/png','image/jpeg'].includes(file.type))throw new Error('OCR currently supports PNG/JPEG. Export a PDF page as an image.');
 if(file.size>10*1024*1024)throw new Error('Use an image smaller than 10 MB.');
 if(!globalThis.Tesseract)throw new Error('OCR library failed to load. Refresh or enter fields manually.');
 await stopOCR();
 const w=await Tesseract.createWorker('eng',1,{workerPath:new URL('ocr/worker.min.js',document.baseURI).href,corePath:new URL('ocr/core',document.baseURI).href,langPath:new URL('ocr/lang',document.baseURI).href,cacheMethod:'none',logger:m=>onProgress(m.status,Math.round((m.progress||0)*100))});worker=w;
 try{let timer;const result=await Promise.race([w.recognize(file),new Promise((_,reject)=>{timer=setTimeout(()=>{w.terminate();reject(new Error('OCR exceeded 60 seconds. Try a smaller, clearer image or enter fields manually.'));},60000);})]).finally(()=>clearTimeout(timer));let t=result.data.text;return {fields:parseDocument(t,type),confidence:result.data.confidence,preview:maskText(t),type};}finally{if(worker===w)worker=null;await w.terminate().catch(()=>{});}
}
