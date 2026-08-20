import { useEffect, useRef } from "react";
import { Paper, ExtractionRow } from "../sampleData";

export type Decision = "correct" | "fix" | null;
export interface ReviewState {
  decision: Decision;
  correction: string;
}
// Keyed by row.id (the stable annotation-value `field`).
export type ReviewMap = Record<string, ReviewState>;

export const getR = (reviews: ReviewMap, id: string): ReviewState =>
  reviews[id] || { decision: null, correction: "" };
export const statusOf = (r: ReviewState) =>
  r.decision === "correct" ? "verified" : r.decision === "fix" ? "corrected" : "todo";

const STATUS_LABEL: Record<string, string> = {
  todo: "To Review",
  verified: "Reviewed",
  corrected: "Corrected",
};

// Classify the extracted value: absent, hedged ("not stated", "implies"), or a real answer.
export function valueTier(v: string): "empty" | "hedged" | "ok" {
  const t = String(v || "").trim().toLowerCase().replace(/[.\s]+$/, "");
  if (["", "not stated directly", "not specified", "not stated", "not applicable", "n/a"].includes(t))
    return "empty";
  if (/not stated|not specified|impl(y|ies|ied)/.test(String(v).toLowerCase())) return "hedged";
  return "ok";
}

function splitAttr(a: string) {
  const i = a.indexOf("(");
  if (i > 0) return { name: a.slice(0, i).trim(), note: a.slice(i).trim() };
  return { name: a, note: "" };
}

interface Props {
  paper: Paper;
  reviews: ReviewMap;
  onChange: (id: string, patch: Partial<ReviewState>) => void;
  filter: string;
  activeKey: string | null; // active row.id
  setActiveKey: (k: string | null) => void;
}

export default function ReviewPanel({
  paper,
  reviews,
  onChange,
  filter,
  activeKey,
  setActiveKey,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  const matches = (row: ExtractionRow) => {
    const r = getR(reviews, row.id);
    const base =
      filter === "all" ||
      (filter === "todo" && r.decision === null) ||
      (filter === "verified" && r.decision === "correct") ||
      (filter === "corrected" && r.decision === "fix");
    return base;
  };

  const setDecision = (id: string, dec: Exclude<Decision, null>) => {
    const r = getR(reviews, id);
    onChange(id, { decision: r.decision === dec ? null : dec });
    setActiveKey(id);
  };

  // Keyboard: Y=correct, N=needs fix, J/K (or arrows) to move the active card.
  useEffect(() => {
    const visible: string[] = [];
    paper.groups.forEach((g) =>
      g.rows.forEach((row) => {
        if (matches(row)) visible.push(row.id);
      })
    );
    const scrollTo = (k: string) =>
      listRef.current?.querySelector(`[data-key="${k}"]`)?.scrollIntoView({ block: "nearest" });
    const handler = (e: KeyboardEvent) => {
      const tag = ((e.target as HTMLElement)?.tagName || "").toLowerCase();
      if (tag === "textarea" || tag === "input" || tag === "select") return;
      if (!visible.length) return;
      const idx = activeKey ? visible.indexOf(activeKey) : -1;
      if (e.key === "y" || e.key === "Y") {
        if (activeKey) { setDecision(activeKey, "correct"); e.preventDefault(); }
      } else if (e.key === "n" || e.key === "N") {
        if (activeKey) { setDecision(activeKey, "fix"); e.preventDefault(); }
      } else if (e.key === "j" || e.key === "ArrowDown") {
        const n = visible[Math.min(visible.length - 1, idx + 1)] || visible[0];
        setActiveKey(n); scrollTo(n); e.preventDefault();
      } else if (e.key === "k" || e.key === "ArrowUp") {
        const n = visible[Math.max(0, (idx < 0 ? visible.length : idx) - 1)];
        setActiveKey(n); scrollTo(n); e.preventDefault();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  });

  const check = (
    <svg viewBox="0 0 16 16"><path d="M13.5 4.5l-7 7-3-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
  const cross = (
    <svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
  );

  const sections = paper.groups.map((g, gi) => {
    const vis = g.rows.filter(matches);
    if (!vis.length) return null;

    let reviewed = 0;
    g.rows.forEach((row) => { if (getR(reviews, row.id).decision !== null) reviewed++; });
    const { name, note } = splitAttr(g.attribute);

    return (
      <section className="pr-group" key={gi}>
        <div className="pr-g-head">
          <div className="pr-g-title">
            <span className="pr-g-name">{name}</span>
            {note && <span className="pr-g-note">{note}</span>}
          </div>
          <div className="pr-g-meta">
            <span className="pr-g-count">{reviewed}/{g.rows.length}</span>
            <span className="pr-g-bar">
              <span style={{ width: `${(reviewed / g.rows.length) * 100}%` }} />
            </span>
          </div>
        </div>
        <div className="pr-g-body">
          {vis.map((row) => {
            const r = getR(reviews, row.id);
            const st = statusOf(r);
            const tier = valueTier(row.value);
            return (
              <article
                className={"pr-card" + (activeKey === row.id ? " active" : "")}
                key={row.id}
                data-key={row.id}
                data-status={st}
                tabIndex={0}
                onFocus={() => setActiveKey(row.id)}
                onClick={() => setActiveKey(row.id)}
              >
                <div className="pr-card-top">
                  <div className="pr-sub">{row.sub}</div>
                  <span className={"pr-chip " + st}>{STATUS_LABEL[st]}</span>
                </div>
                {row.hint && <div className="pr-hint">Look for: {row.hint}</div>}
                <div className={"pr-extract tier-" + tier}>
                  <div className="pr-extract-label">
                    <span className="pr-ml">LLM</span>
                    <span>extracted value</span>
                    {tier === "empty" && <span className="pr-tag tag-empty">not in source</span>}
                    {tier === "hedged" && <span className="pr-tag tag-hedged">hedged</span>}
                  </div>
                  <div className="pr-extract-val">
                    {String(row.value || "").trim()
                      ? row.value
                      : <span className="pr-noval">— no value extracted —</span>}
                  </div>
                </div>
                <div className="pr-verify">
                  <span className="pr-verify-q">Is this correct?</span>
                  <div className="pr-seg">
                    <button
                      type="button"
                      className={"pr-opt opt-correct" + (r.decision === "correct" ? " sel" : "")}
                      onClick={(e) => { e.stopPropagation(); setDecision(row.id, "correct"); }}
                    >
                      {check}Yes
                    </button>
                    <button
                      type="button"
                      className={"pr-opt opt-fix" + (r.decision === "fix" ? " sel" : "")}
                      onClick={(e) => { e.stopPropagation(); setDecision(row.id, "fix"); }}
                    >
                      {cross}Needs fix
                    </button>
                  </div>
                </div>
                {r.decision === "fix" && (
                  <div className="pr-correction">
                    <div className="pr-corr-head">
                      <label>Corrected value</label>
                      <button
                        type="button"
                        className="pr-fill"
                        onClick={(e) => { e.stopPropagation(); onChange(row.id, { correction: row.value }); }}
                      >
                        use extracted text
                      </button>
                    </div>
                    <textarea
                      className="pr-corr-input"
                      rows={3}
                      placeholder="Type the corrected value…"
                      value={r.correction}
                      onChange={(e) => onChange(row.id, { correction: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    );
  });

  const hasAny = sections.some(Boolean);

  return (
    <div className="pr-right-scroll" ref={listRef}>
      {hasAny ? sections : <div className="pr-empty">No fields match this view.</div>}
    </div>
  );
}
