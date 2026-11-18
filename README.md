# Udyam Saathi

Live prototype: https://karanveer135790.github.io/udyam_prototype/

## Source

All deployed application code and runtime assets are in `site/`. Edit `site/app.mjs` for screens, `site/discovery.mjs` for recommendations, `site/engine.mjs` for quote/KYC rules, `site/ocr.mjs` and `site/ocr-parser.mjs` for OCR, `site/local-prompt.mjs` for experimental AI routing, and `site/style.css` for styling.

Run locally: `python3 -m http.server 8000 --directory site`, then open http://localhost:8000/ .

Changes to main deploy through GitHub Actions. The site no longer depends on the original host. `migrate.py` is the historical one-time import script and is no longer executed by deployment.

## Boundaries

Fictional data only. Catalogue quotes use minimum prices and exclude taxes. Tesseract OCR runs locally. Registry checks, human-review tickets, payment and order events are simulated. Dataset clock: 15 July 2026. Optional SmolLM2 360M English generation is experimental and has not met answer-quality acceptance; guided rules remain authoritative. Model files download separately from Hugging Face. No paid inference API is used. Mobile and final AI acceptance remain outstanding.
