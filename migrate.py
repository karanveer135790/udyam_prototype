from pathlib import Path
from urllib.request import urlopen, Request
import time
root=Path('site')
if (root/'index.html').exists():
    print('Using repository-owned prototype files')
    raise SystemExit(0)
origin='https://udyam-saathi-demo.vernalmanta1.chatgpt.site/'
files=['demo.html','app.mjs','style.css','data.json','discovery.mjs','engine.mjs','journey-state.mjs','ocr-parser.mjs','ocr.mjs','local-prompt.mjs','local-ai.js','local-ai-worker.js','favicon.svg','ocr/TESSERACT_LICENSE','ocr/CORE_LICENSE','ocr/tesseract.min.js','ocr/worker.min.js','ocr/lang/eng.traineddata.gz','ocr/core/tesseract-core-simd-lstm.js','ocr/core/tesseract-core-lstm.js','ocr/core/tesseract-core-simd-lstm.wasm.js','ocr/core/tesseract-core-lstm.wasm.js','ocr/core/tesseract-core-simd-lstm.wasm','ocr/core/tesseract-core-lstm.wasm','ai/ort-wasm-simd-threaded.jsep-B0T3yYHD.wasm','samples/K03_signatory_id.png','samples/K09_gst_certificate.png','samples/K11_address_proof.png']
for name in files:
    target=root/name
    target.parent.mkdir(parents=True,exist_ok=True)
    with urlopen(Request(origin+name,headers={'User-Agent':'Udyam-Saathi-Migration'}),timeout=180) as response:
        content=response.read()
        if response.headers.get('content-type','').startswith('text/html') and not name.endswith('.html'):
            raise RuntimeError('Unexpected HTML for '+name)
    target.write_bytes(content)
    print(name,len(content))
p=root/'app.mjs'
p.write_text(p.read_text().replace("fetch('/samples/'+file)","fetch(new URL('samples/'+file,document.baseURI))"))
p=root/'ocr.mjs'
p.write_text(p.read_text().replace("workerPath:'/ocr/worker.min.js',corePath:'/ocr/core',langPath:'/ocr/lang'","workerPath:new URL('ocr/worker.min.js',document.baseURI).href,corePath:new URL('ocr/core',document.baseURI).href,langPath:new URL('ocr/lang',document.baseURI).href"))
p=root/'local-ai.js'
p.write_text(p.read_text().replace('"/local-ai-worker.js"','new URL("./local-ai-worker.js",import.meta.url)').replace("'/local-ai-worker.js'","new URL('./local-ai-worker.js',import.meta.url)"))
(root/'index.html').write_bytes((root/'demo.html').read_bytes())
(root/'.nojekyll').touch()
