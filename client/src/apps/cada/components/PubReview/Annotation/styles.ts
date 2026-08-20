// Scoped stylesheet for the Publication Extraction Review annotator.
// Ported from server/data/pub-llm-eval/extraction-review.html, namespaced under
// `.pr-app` and prefixed `pr-` so it can't collide with global CADA styles.
export const styles = `
.pr-app{
  /* Palette mapped to the CADA MUI theme (apps/cada/theme/palette.ts) */
  --surface:#FFFFFF;              /* background.paper */
  --surface-2:#F8F9FA;            /* neutral 50 */
  --surface-3:#F3F4F6;            /* neutral 100 / background.default */
  --ink:#1C2536;                  /* text.primary (neutral 800) */
  --muted:#4D5761;                /* text.secondary (neutral 600) */
  --faint:#9DA4AE;                /* neutral 400 */
  --line:#E5E7EB;                 /* neutral 200 */
  --line-2:#D2D6DB;               /* neutral 300 */
  --teal:#009be5;                 /* primary.main */
  --teal-ink:#0277bd;             /* primary (darker) */
  --teal-tint:rgba(0,155,229,0.12);   /* primary.alpha12 */
  --teal-tint-2:rgba(0,155,229,0.06); /* primary.alpha8 */
  --green:#0B815A;                /* success.dark */
  --green-tint:rgba(16,185,129,0.14); /* success tint */
  --amber:#B54708;               /* warning.dark */
  --amber-tint:#FFFAEB;          /* warning.lightest */
  --red:#B42318;                 /* error.dark */
  --red-tint:#FEF3F2;            /* error.lightest */
  --mono:"IBM Plex Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --r:11px; --r-sm:8px;
  display:flex;flex-direction:column;height:calc(100vh - 64px);overflow:hidden;
  color:var(--ink);background:var(--surface-3);font-size:14px;line-height:1.45;
}
.pr-app *{box-sizing:border-box}
.pr-app button{font-family:inherit}

/* appbar */
.pr-appbar{display:flex;align-items:center;gap:20px;flex-wrap:wrap;padding:11px 18px;background:var(--surface);border-bottom:1px solid var(--line)}
.pr-brand{display:flex;align-items:center;gap:11px;min-width:0}
.pr-logo{width:38px;height:38px;border-radius:10px;background:linear-gradient(160deg,#0B7A88,#0A5E69);display:grid;place-items:center;flex:0 0 auto;box-shadow:0 2px 6px rgba(11,122,136,.35)}
.pr-logo svg{width:26px;height:20px;display:block}
.pr-brand-txt{display:flex;flex-direction:column;line-height:1.15;min-width:0}
.pr-brand-txt b{font-weight:700;font-size:15.5px;letter-spacing:-.2px}
.pr-brand-txt span{font-size:11.5px;color:var(--faint);font-weight:500}
.pr-doc-pick{display:flex;align-items:center;gap:9px}
.pr-doc-pick label{font-size:11px;text-transform:uppercase;letter-spacing:.7px;color:var(--faint);font-weight:600}
.pr-select{appearance:none;-webkit-appearance:none;border:1px solid var(--line-2);background:var(--surface-2);color:var(--ink);font-weight:600;font-size:13.5px;padding:8px 30px 8px 12px;border-radius:9px;cursor:pointer}
.pr-spacer{flex:1 1 auto}
.pr-progress-wrap{display:flex;align-items:center;gap:12px;min-width:210px}
.pr-progress-meta{display:flex;flex-direction:column;align-items:flex-end;line-height:1.15}
.pr-progress-meta b{font-size:13.5px;font-variant-numeric:tabular-nums}
.pr-progress-meta span{font-size:11px;color:var(--faint);text-transform:uppercase;letter-spacing:.6px;font-weight:600}
.pr-bar{width:150px;height:8px;border-radius:99px;background:var(--surface-3);overflow:hidden;border:1px solid var(--line)}
.pr-bar>i{display:block;height:100%;background:linear-gradient(90deg,#0B7A88,#16A6B4);transition:width .28s ease}
.pr-actions{display:flex;align-items:center;gap:9px}
.pr-btn{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line-2);background:var(--surface-2);color:var(--ink);font-weight:600;font-size:13px;padding:8px 13px;border-radius:9px;cursor:pointer;transition:.15s}
.pr-btn svg{width:16px;height:16px}
.pr-btn:hover{background:#fff;box-shadow:0 1px 3px rgba(16,32,44,.08)}
.pr-btn.primary{background:var(--teal);border-color:var(--teal);color:#fff}
.pr-btn.primary:hover{background:#0A6A76;box-shadow:0 3px 9px rgba(11,122,136,.3)}

/* workspace */
.pr-workspace{flex:1 1 auto;display:flex;min-height:0;padding:14px;gap:0}
.pr-panel{background:var(--surface);border:1px solid var(--line);display:flex;flex-direction:column;min-height:0;min-width:0}
.pr-panel.left{border-radius:var(--r) 0 0 var(--r);overflow:hidden}
.pr-panel.right{flex:1 1 auto;border-radius:0 var(--r) var(--r) 0;border-left:0}
.pr-resizer{flex:0 0 10px;cursor:col-resize;position:relative;background:transparent;z-index:5;touch-action:none}
.pr-resizer::before{content:"";position:absolute;inset:0 4px;background:var(--line);border-radius:2px}
.pr-resizer::after{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:2px;height:26px;border-radius:2px;background:var(--line-2)}
.pr-resizer:hover::before{background:var(--teal-tint)}
.pr-resizer:hover::after{background:var(--teal)}

/* pdf side */
.pr-pdf-toolbar{display:flex;align-items:center;gap:10px;padding:9px 12px;border-bottom:1px solid var(--line);background:var(--surface-2);flex:0 0 auto}
.pr-pdf-title{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;color:var(--muted);min-width:0}
.pr-pdf-title .dot{width:7px;height:7px;border-radius:50%;background:var(--teal);flex:0 0 auto}
.pr-pdf-title .name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pr-idx{flex:0 0 auto;font-size:11px;font-weight:600;color:var(--faint);font-variant-numeric:tabular-nums;background:var(--surface);border:1px solid var(--line-2);border-radius:99px;padding:1px 8px}
.pr-nav{flex:0 0 auto;border:1px solid var(--line-2);background:var(--surface);color:var(--muted);width:28px;height:28px;border-radius:8px;cursor:pointer;display:grid;place-items:center}
.pr-nav:hover:not(:disabled){background:var(--surface-3);color:var(--ink)}
.pr-nav:disabled{opacity:.4;cursor:default}
.pr-nav svg{width:15px;height:15px}
.pr-tb-spacer{flex:1}
.pr-pg{font-size:12.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.pr-zoom{display:inline-flex;align-items:center;gap:2px;background:var(--surface);border:1px solid var(--line-2);border-radius:8px;padding:2px}
.pr-zoom button{border:0;background:none;width:28px;height:26px;border-radius:6px;cursor:pointer;color:var(--muted);display:grid;place-items:center}
.pr-zoom button:hover{background:var(--surface-3);color:var(--ink)}
.pr-zoom .zlabel{min-width:44px;text-align:center;font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums;font-weight:600}
.pr-pdf-scroll{flex:1 1 auto;overflow:auto;background:#DDE3E8;padding:18px;display:flex;flex-direction:column;align-items:center;gap:16px}
.pr-pdf-scroll.pr-embed{padding:0;display:block;overflow:hidden;position:relative;min-height:0}
/* in-PDF search box */
.pr-pdf-search{display:inline-flex;align-items:center;gap:4px;background:var(--surface);border:1px solid var(--line-2);border-radius:8px;padding:3px 6px}
.pr-pdf-search>svg{width:14px;height:14px;color:var(--faint);flex:0 0 auto}
.pr-pdf-search input{border:0;outline:none;background:none;font-size:12.5px;color:var(--ink);width:130px}
.pr-sr-count{font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;padding:0 2px;white-space:nowrap}
.pr-sr-btn{border:0;background:none;width:22px;height:22px;border-radius:5px;cursor:pointer;color:var(--muted);display:grid;place-items:center}
.pr-sr-btn:hover{background:var(--surface-3);color:var(--ink)}
.pr-sr-btn svg{width:12px;height:12px}
.pr-zoom .fit{width:auto;padding:0 9px;font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.4px}
.pr-pcanvas{box-shadow:0 2px 10px rgba(16,32,44,.18);background:#fff;border-radius:2px;overflow:hidden}
.pr-pcanvas canvas{display:block}
.pr-loading{padding:60px 20px;color:var(--muted);font-size:13px}

/* facsimile */
.pr-facs-wrap{width:100%;display:flex;justify-content:center}
.pr-page{width:min(760px,100%);background:#fff;box-shadow:0 3px 16px rgba(16,32,44,.16);border-radius:2px;padding:52px 56px 40px;transform-origin:top center;font-family:Georgia,"Times New Roman",serif;color:#1c1c1c}
.pr-ribbon{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:600;color:var(--teal-ink);background:var(--teal-tint-2);border:1px solid var(--teal-tint);padding:5px 10px;border-radius:99px;margin-bottom:22px}
.pr-masthead{display:flex;align-items:baseline;justify-content:space-between;border-bottom:2px solid #111;padding-bottom:8px;margin-bottom:18px}
.pr-venue{font-weight:800;font-size:20px;letter-spacing:-.4px;color:#111}
.pr-venue.lower{text-transform:none;font-weight:700}
.pr-url{font-size:10.5px;color:#7a7a7a}
.pr-badge{display:inline-block;font-size:10.5px;font-weight:700;letter-spacing:1px;color:#0b6b8a;margin-bottom:10px}
.pr-ptitle{font-size:25px;line-height:1.18;font-weight:700;color:#0e4f66;margin:0 0 14px;letter-spacing:-.3px}
.pr-authors{font-size:12.5px;line-height:1.5;color:#333;margin-bottom:4px}
.pr-affil{font-size:10.5px;color:#8a8a8a;margin-bottom:18px}
.pr-abstract{font-size:13.5px;line-height:1.6;color:#2a2a2a;font-weight:600;margin-bottom:20px;font-family:Georgia,serif}
.pr-meta-tbl{width:100%;border-collapse:collapse;margin-bottom:22px;font-size:11.5px}
.pr-meta-tbl td{border:1px solid #d8d8d8;padding:7px 10px;vertical-align:top}
.pr-meta-tbl td.k{width:34%;background:#f3f5f6;font-weight:600;color:#444}
.pr-meta-tbl td.v{color:#555}
.pr-sec-h{font-size:14px;font-weight:700;color:#0e4f66;margin:0 0 8px}
.pr-cols{column-count:2;column-gap:26px}
.pr-cols p{margin:0 0 10px;font-size:11.8px;line-height:1.6;color:#2f2f2f;text-align:justify;font-family:Georgia,serif}
.pr-pfoot{margin-top:26px;padding-top:10px;border-top:1px solid #e2e2e2;font-size:10px;color:#9a9a9a;display:flex;justify-content:space-between}

/* right toolbar */
.pr-right-toolbar{flex:0 0 auto;border-bottom:1px solid var(--line);background:var(--surface-2);padding:10px 14px;display:flex;flex-direction:column;gap:9px}
.pr-rt-row1{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.pr-rt-title{font-size:12.5px;font-weight:700;letter-spacing:-.1px;margin-right:2px}
.pr-filters{display:inline-flex;background:var(--surface);border:1px solid var(--line-2);border-radius:9px;padding:2px}
.pr-pill{border:0;background:none;padding:6px 11px;border-radius:7px;cursor:pointer;font-size:12.5px;font-weight:600;color:var(--muted);display:inline-flex;align-items:center;gap:7px}
.pr-pill:hover{color:var(--ink)}
.pr-pill.active{background:var(--ink);color:#fff}
.pr-pill .cnt{font-size:11px;font-variant-numeric:tabular-nums;background:rgba(93,110,122,.16);color:inherit;border-radius:99px;padding:1px 6px;min-width:18px;text-align:center}
.pr-pill.active .cnt{background:rgba(255,255,255,.22)}
.pr-rt-hint{font-size:11px;color:var(--faint);display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.pr-kbd{font-family:var(--mono);font-size:10.5px;background:var(--surface);border:1px solid var(--line-2);border-bottom-width:2px;border-radius:5px;padding:1px 5px;color:var(--muted)}

/* list + groups */
.pr-right-scroll{flex:1 1 auto;overflow:auto;padding:0 0 20px}
/* bottom action bar — flex sibling, so the scroll area shrinks and never overlays inputs */
.pr-bottom-toolbar{flex:0 0 auto;display:flex;align-items:center;gap:10px;padding:11px 14px;border-top:1px solid var(--line);background:var(--surface-2)}
.pr-skipto{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--muted)}
.pr-skipto input{width:42px;height:30px;text-align:center;border:1px solid var(--line-2);border-radius:7px;background:var(--surface);color:var(--ink);font-size:13px;font-variant-numeric:tabular-nums}
.pr-group{border-bottom:1px solid var(--line)}
.pr-g-head{position:sticky;top:0;z-index:6;background:var(--surface-3);display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 16px;border-bottom:1px solid var(--line)}
.pr-g-title{display:flex;align-items:baseline;gap:9px;min-width:0}
.pr-g-name{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--teal-ink)}
.pr-g-note{font-size:11px;color:var(--faint);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pr-g-meta{display:flex;align-items:center;gap:9px;flex:0 0 auto}
.pr-g-count{font-size:11.5px;color:var(--muted);font-variant-numeric:tabular-nums;font-weight:600}
.pr-g-bar{width:46px;height:5px;border-radius:99px;background:var(--surface);overflow:hidden;border:1px solid var(--line)}
.pr-g-bar>span{display:block;height:100%;background:var(--teal);transition:width .25s ease}
.pr-g-body{padding:12px 14px;display:flex;flex-direction:column;gap:11px}

/* card */
.pr-card{border:1px solid var(--line);border-left:3px solid var(--line-2);border-radius:var(--r-sm);background:var(--surface);padding:12px 13px;transition:border-color .15s}
.pr-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:9px}
.pr-sub{font-size:13.5px;font-weight:600;line-height:1.35}
/* status side tag */
.pr-chip{flex:0 0 auto;font-size:10.5px;font-weight:700;letter-spacing:.3px;padding:3px 9px;border-radius:99px;white-space:nowrap;text-transform:uppercase}
.pr-chip.todo{background:var(--surface-3);color:var(--muted)}
.pr-chip.verified{background:var(--green-tint);color:var(--green)}
.pr-chip.corrected{background:var(--amber-tint);color:var(--amber)}
.pr-hint{font-size:11.5px;color:var(--muted);background:var(--surface-2);border-left:2px solid var(--line-2);padding:5px 9px;border-radius:0 6px 6px 0;margin-bottom:9px}
.pr-extract{background:var(--surface-2);border:1px solid var(--line);border-radius:7px;padding:9px 11px;margin-bottom:10px}
.pr-extract.tier-empty{background:#F6F8F9;border-style:dashed}
.pr-extract-label{display:flex;align-items:center;gap:7px;margin-bottom:5px}
.pr-ml{font-family:var(--mono);font-size:9.5px;font-weight:600;color:#fff;background:var(--muted);padding:1px 6px;border-radius:4px;letter-spacing:.4px}
.pr-extract-label>span:nth-child(2){font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;color:var(--faint);font-weight:600}
.pr-tag{margin-left:auto;font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;text-transform:uppercase;letter-spacing:.4px}
.pr-tag.tag-empty{background:var(--surface-3);color:var(--faint)}
.pr-tag.tag-hedged{background:var(--amber-tint);color:var(--amber)}
.pr-extract-val{font-family:var(--mono);font-size:12.5px;line-height:1.55;color:#26333d;white-space:pre-wrap;word-break:break-word}
.pr-extract.tier-empty .pr-extract-val{color:var(--faint);font-style:italic}
.pr-noval{color:var(--faint);font-style:italic}
.pr-verify{display:flex;align-items:center;gap:11px;flex-wrap:wrap}
.pr-verify-q{font-size:12.5px;font-weight:600;color:var(--muted)}
.pr-seg{display:inline-flex;gap:7px}
.pr-opt{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line-2);background:var(--surface);color:var(--muted);font-size:12.5px;font-weight:600;padding:6px 12px;border-radius:8px;cursor:pointer;transition:.14s}
.pr-opt svg{width:13px;height:13px}
.pr-opt:hover{background:var(--surface-2);color:var(--ink)}
.pr-opt.opt-correct.sel{background:var(--green-tint);border-color:var(--green);color:var(--green)}
.pr-opt.opt-fix.sel{background:var(--red-tint);border-color:var(--red);color:var(--red)}
.pr-correction{margin-top:11px;border-top:1px dashed var(--line-2);padding-top:11px}
.pr-corr-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.pr-corr-head label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--amber)}
.pr-fill{border:0;background:none;color:var(--teal);font-size:11.5px;font-weight:600;cursor:pointer;padding:2px 4px;border-radius:5px}
.pr-fill:hover{background:var(--teal-tint-2);text-decoration:underline}
.pr-corr-input{width:100%;resize:vertical;min-height:64px;border:1px solid var(--line-2);border-radius:7px;padding:9px 10px;font-family:var(--mono);font-size:12.5px;line-height:1.5;color:var(--ink);background:#Fffefb}
/* no focus ring on click; keep a subtle one for keyboard users only */
.pr-app input:focus,.pr-app textarea:focus,.pr-app select:focus{outline:none}
.pr-app input:focus-visible,.pr-app textarea:focus-visible,.pr-app select:focus-visible{outline:2px solid var(--teal-tint)}
.pr-empty{padding:60px 24px;text-align:center;color:var(--muted);font-size:14px}

@media (max-width:900px){
  .pr-workspace{flex-direction:column;overflow:auto}
  .pr-panel.left{flex:0 0 60vh!important;border-radius:var(--r) var(--r) 0 0}
  .pr-panel.right{border-radius:0 0 var(--r) var(--r);border-left:1px solid var(--line)}
  .pr-resizer{display:none}
}
`;
