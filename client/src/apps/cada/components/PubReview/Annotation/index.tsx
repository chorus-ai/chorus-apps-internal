import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineDownload, AiOutlineSave } from "react-icons/ai";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Button,
  LinearProgress,
  Menu,
  MenuItem,
  createTheme,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../../../../hooks/redux";
import { getProjects } from "../../../store/thunk";
import { useAnnotationEvents, useSaveAnnotation } from "../../../hooks/useEvents";
import { NoContent } from "../../../common/NoContent";
import type { CadaEvent } from "../../../types";
import { SAMPLE_DATA } from "../sampleData";
import ReviewPanel, { ReviewMap, ReviewState, getR } from "./ReviewPanel";
import ReactPdfViewer from "./ReactPdfViewer";
import { filterMostRecentByField } from "../../../utils/annotation_helper";
import { styles } from "./styles";

const theme = createTheme();

const baseName = (p: string) => decodeURIComponent(p.split("/").pop() || p);

export default function PubReviewAnnotation({ pid }: { pid: number }) {
  const user = useAppSelector((state) => state.main.user);
  const project = useAppSelector((state) => state.cada.userProjects[pid]);
  const dispatch = useAppDispatch();
  const { events, isLoading } = useAnnotationEvents(pid, user?.id ?? 0);
  const saveAnn = useSaveAnnotation();

  // Which sample field-set (extracted attributes) to review against the current PDF.
  const docIds = Object.keys(SAMPLE_DATA);
  const [curDoc, setCurDoc] = useState(docIds[0]);
  const paper = SAMPLE_DATA[curDoc];

  const [curIdx, setCurIdx] = useState(0);
  const [skipInput, setSkipInput] = useState("1");
  const [filter, setFilter] = useState("all");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [exportEl, setExportEl] = useState<null | HTMLElement>(null);
  // Review decisions keyed by eventId → { rowId → decision }.
  const [allReviews, setAllReviews] = useState<Record<string, ReviewMap>>({});
  // Last-saved snapshot per eventId, so Save only submits changed rows.
  const savedRef = useRef<Record<string, ReviewMap>>({});

  useEffect(() => {
    if (!project) dispatch(getProjects());
  }, [project, dispatch]);

  // Drag-to-resize the right (form) panel — same behavior as the pdf/Panel template.
  useEffect(() => {
    const handle = document.querySelector(".handle");
    if (!handle) return;
    const onMove = (e: MouseEvent) => {
      const panelBox = document.getElementById("panel-box");
      const resizableBox = document.getElementById("resizableBox");
      if (!panelBox || !resizableBox) return;
      const style = window.getComputedStyle(panelBox);
      const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const newWidth = window.innerWidth - e.clientX - 25;
      const max = window.innerWidth - padding - 15;
      resizableBox.style.width = `${Math.max(320, Math.min(newWidth, max))}px`;
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    const onDown = (e: Event) => {
      e.preventDefault();
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };
    handle.addEventListener("mousedown", onDown);
    return () => {
      handle.removeEventListener("mousedown", onDown);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  // Flatten assigned + completed events into one ordered list to traverse.
  const eventList: CadaEvent[] = useMemo(() => {
    if (!events) return [];
    return [...events.false, ...events.true].sort((a, b) => a.id - b.id);
  }, [events]);

  const curEvent = eventList[Math.min(curIdx, Math.max(0, eventList.length - 1))];
  const reviewKey = curEvent ? String(curEvent.id) : "";
  const reviews = allReviews[reviewKey] || {};

  // Restore saved decisions for each event: one annotation value per row
  // (field = row.id), latest wins via filterMostRecentByField.
  useEffect(() => {
    if (!eventList.length) return;
    setAllReviews((prev) => {
      const next = { ...prev };
      eventList.forEach((ev) => {
        const key = String(ev.id);
        if (next[key]) return; // don't clobber in-progress edits
        const vals = ev.cadaAnnotations?.[0]?.cadaAnnotationValues || [];
        const map: ReviewMap = {};
        for (const v of filterMostRecentByField(vals)) {
          try {
            const parsed = JSON.parse(v.value);
            map[v.field] = {
              decision: parsed.decision ?? null,
              correction: parsed.correction ?? "",
            };
          } catch {
            /* ignore malformed */
          }
        }
        next[key] = map;
        savedRef.current[key] = JSON.parse(JSON.stringify(map)); // baseline
      });
      return next;
    });
  }, [eventList]);

  const setReview = (rowId: string, patch: Partial<ReviewState>) => {
    setAllReviews((prev) => {
      const doc = { ...(prev[reviewKey] || {}) };
      doc[rowId] = { decision: null, correction: "", ...doc[rowId], ...patch };
      return { ...prev, [reviewKey]: doc };
    });
  };

  const counts = useMemo(() => {
    let total = 0, reviewed = 0, ver = 0, cor = 0;
    paper.groups.forEach((g) =>
      g.rows.forEach((row) => {
        total++;
        const r = getR(reviews, row.id);
        if (r.decision !== null) reviewed++;
        if (r.decision === "correct") ver++;
        if (r.decision === "fix") cor++;
      })
    );
    return { total, reviewed, ver, cor, todo: total - reviewed };
  }, [paper, reviews]);

  // Toolbar progress reflects the assigned papers (events) and their review status:
  // an event counts as reviewed if it's completed, has saved annotation values,
  // or has any decision recorded in this session.
  const eventProgress = useMemo(() => {
    const isReviewed = (ev: CadaEvent) => {
      const ann = ev.cadaAnnotations?.[0];
      if (ann?.completed) return true;
      if ((ann?.cadaAnnotationValues || []).length > 0) return true;
      const local = allReviews[String(ev.id)];
      return !!local && Object.values(local).some((r) => r.decision !== null);
    };
    const total = eventList.length;
    const reviewed = eventList.filter(isReviewed).length;
    return { total, reviewed, pct: total ? Math.round((reviewed / total) * 100) : 0 };
  }, [eventList, allReviews]);

  const goTo = (idx: number) => {
    setCurIdx(idx);
    setActiveKey(null);
  };

  // Keep the "skip to" box in sync with the current paper index.
  useEffect(() => {
    setSkipInput(String(curIdx + 1));
  }, [curIdx]);

  const commitSkip = () => {
    const n = parseInt(skipInput, 10);
    if (Number.isFinite(n) && n >= 1 && n <= eventList.length) goTo(n - 1);
    else setSkipInput(String(curIdx + 1));
  };

  const pdfUrl = curEvent
    ? `/api/cada/file/pdf?filename=${encodeURIComponent(curEvent.cadaFile.path)}`
    : null;

  /* ---------- save (one annotation value per changed row; field = row.id) ---------- */
  const handleSave = async () => {
    if (!curEvent) return;
    const annId = curEvent.cadaAnnotations?.[0]?.id;
    if (!annId) return;

    const baseline = savedRef.current[reviewKey] || {};
    const changed = Object.entries(reviews).filter(([id, r]) => {
      const b = baseline[id];
      return !b || b.decision !== r.decision || b.correction !== r.correction;
    });
    if (!changed.length) return;

    // strictly-increasing createdAt so filterMostRecentByField picks these on reload
    const t0 = Date.now();
    await Promise.all(
      changed.map(([id, r], i) =>
        saveAnn.mutate({
          projectId: pid,
          eventId: curEvent.id,
          completed: true, // don't move buckets; server still stamps the annotation
          isComplete: i === changed.length - 1, // single success toast
          annotation: {
            field: id, // row.id (sheet row number)
            value: JSON.stringify({ decision: r.decision, correction: r.correction }),
            cadaAnnotationId: annId,
            createdAt: new Date(t0 + i).toISOString(),
          },
        })
      )
    );
    savedRef.current[reviewKey] = JSON.parse(JSON.stringify(reviews));
  };

  const isLast = curIdx >= eventList.length - 1;
  const handleSkip = () => {
    if (!isLast) goTo(curIdx + 1);
  };
  const handleSaveNext = async () => {
    await handleSave();
    if (!isLast) goTo(curIdx + 1);
  };

  /* ---------- export ---------- */
  const finalValue = (row: { value: string }, r: ReviewState) =>
    r.decision === "fix" ? r.correction || "" : row.value;
  const decisionLabel = (r: ReviewState) =>
    r.decision === "correct" ? "Correct" : r.decision === "fix" ? "Needs fix" : "Unreviewed";
  const download = (name: string, text: string, mime: string) => {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  const doExport = (fmt: "csv" | "json") => {
    setExportEl(null);
    const stem = curEvent ? baseName(curEvent.cadaFile.path).replace(/\.pdf$/i, "") : curDoc;
    if (fmt === "csv") {
      const q = (s: unknown) => `"${String(s ?? "").replace(/"/g, '""')}"`;
      const rows = [["Row", "Attribute", "Sub-attribute", "Extracted value", "Decision", "Final value"].map(q).join(",")];
      paper.groups.forEach((g) =>
        g.rows.forEach((row) => {
          const r = getR(reviews, row.id);
          rows.push([row.id, g.attribute, row.sub, row.value, decisionLabel(r), finalValue(row, r)].map(q).join(","));
        })
      );
      download(`${stem}_review.csv`, rows.join("\r\n"), "text/csv");
    } else {
      const obj = {
        paper: paper.label,
        source: curEvent ? baseName(curEvent.cadaFile.path) : null,
        eventId: curEvent?.id ?? null,
        exported: new Date().toISOString(),
        groups: paper.groups.map((g) => ({
          attribute: g.attribute,
          fields: g.rows.map((row) => {
            const r = getR(reviews, row.id);
            return {
              id: row.id,
              subAttribute: row.sub,
              extractedValue: row.value,
              decision: decisionLabel(r),
              correctedValue: r.decision === "fix" ? r.correction || "" : null,
              finalValue: finalValue(row, r),
            };
          }),
        })),
      };
      download(`${stem}_review.json`, JSON.stringify(obj, null, 2), "application/json");
    }
  };

  if (isLoading) {
    return <NoContent text="Loading assignments…" subtext="Fetching your assigned papers." />;
  }
  if (!eventList.length || !curEvent) {
    return <NoContent text="There are no assignments!" subtext="Contact your admin for assignments." />;
  }

  const FILTERS: [string, string, number][] = [
    ["all", "All", counts.total],
    ["todo", "To review", counts.todo],
    ["verified", "Verified", counts.ver],
    ["corrected", "Corrected", counts.cor],
  ];

  const cellHeight = "calc(100vh - 250px)";

  return (
    <div>
      <style>{styles}</style>

      {/* ============ MUI toolbar (title · progress · actions) ============ */}
      <AppBar component="div" sx={{ pl: 1 }} position="static" elevation={0}>
        <Toolbar>
          <Typography color="inherit" variant="h6" component="h1">
            {project?.name || "Extraction Review"}
          </Typography>

          {/* progress bar next to the annotation title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 3 }}>
            <Box sx={{ width: 150 }}>
              <LinearProgress
                variant="determinate"
                value={eventProgress.pct}
                color="inherit"
                sx={{
                  height: 8,
                  borderRadius: 99,
                  backgroundColor: "rgba(0,0,0,0.12)",
                  "& .MuiLinearProgress-bar": { backgroundColor: "primary.main" },
                }}
              />
            </Box>
            <Box sx={{ lineHeight: 1.1, textAlign: "right" }}>
              <Typography variant="body2" sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" , color: "primary.main" }}>
                {eventProgress.pct}% completed
              </Typography>
            </Box>
          </Box>

          <div style={{ flex: "1 1 auto" }} />

          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<AiOutlineDownload />}
            onClick={(e) => setExportEl(e.currentTarget)}
          >
            Export
          </Button>

          <Menu anchorEl={exportEl} open={Boolean(exportEl)} onClose={() => setExportEl(null)}>
            <MenuItem onClick={() => doExport("csv")}>CSV — one row per field</MenuItem>
            <MenuItem onClick={() => doExport("json")}>JSON — groups + decisions</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <AppBar component="div" sx={{ px: 1, height: 10 }} position="static" elevation={0} />

      {/* ============ resizable split: PDF (left) · review form (right) ============ */}
      <Box id="panel-box" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container direction="row" wrap="nowrap">
          <Grid
            size="grow"
            sx={{ height: cellHeight, overflow: "hidden", backgroundColor: "#fff", minWidth: 0 }}
          >
            <ReactPdfViewer url={pdfUrl as string} title={baseName(curEvent.cadaFile.path)} />
          </Grid>

          <Grid>
            <div className="handle" role="separator" aria-orientation="vertical" aria-label="Resize panels" />
          </Grid>

          <Grid>
            <Box id="resizableBox" sx={{ height: cellHeight, width: 560, overflow: "hidden" }}>
              {/* form side kept as-is (scoped pr-* styles need the .pr-app ancestor) */}
              <div className="pr-app" style={{ height: "100%" }}>
                <section className="pr-panel right" style={{ height: "100%", borderRadius: 8, borderLeft: "1px solid var(--line)" }}>
                  <div className="pr-right-toolbar">
                    <div className="pr-rt-row1">  Fields: 
                      <div className="pr-filters">
                        {FILTERS.map(([f, label, cnt]) => (
                          <button
                            key={f}
                            className={"pr-pill" + (filter === f ? " active" : "")}
                            onClick={() => setFilter(f)}
                          >
                            {label} <span className="cnt">{cnt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pr-rt-hint">
                      Reviewing <b style={{ margin: "0 3px" }}>{baseName(curEvent.cadaFile.path)}</b> ·
                      <span className="pr-kbd">Y</span> correct
                      <span className="pr-kbd">N</span> needs fix
                      <span className="pr-kbd">J</span><span className="pr-kbd">K</span> move
                    </div>
                  </div>
                  <ReviewPanel
                    key={reviewKey}
                    paper={paper}
                    reviews={reviews}
                    onChange={setReview}
                    filter={filter}
                    activeKey={activeKey}
                    setActiveKey={setActiveKey}
                  />
                  <div className="pr-bottom-toolbar">
                    <button
                      className="pr-btn"
                      onClick={handleSkip}
                      disabled={isLast}
                    >
                      Skip
                    </button>
                    <div className="pr-skipto">
                      <span> to</span>
                      <input
                        type="text"
                        value={skipInput}
                        aria-label="Skip to"
                        onChange={(e) => setSkipInput(e.target.value.replace(/\D/g, ""))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                        }}
                        onBlur={commitSkip}
                      />
                      <span>/ {eventList.length}</span>
                    </div>
                    <div style={{ flex: 1 }} />
                    <button
                      className="pr-btn"
                      onClick={handleSave}
                      disabled={saveAnn.isLoading}
                    >
                      <AiOutlineSave /> {saveAnn.isLoading ? "Saving…" : "Save"}
                    </button>
                    <button
                      className="pr-btn primary"
                      onClick={handleSaveNext}
                      disabled={saveAnn.isLoading}
                    >
                      <AiOutlineSave /> Save &amp; Next
                    </button>
                  </div>
                </section>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <style>
        {`
          .handle {
            position: relative;
            width: 10px;
            height: ${cellHeight};
            background-color: transparent;
            cursor: col-resize;
            flex: 0 0 auto;
          }
          .handle::before {
            content: "";
            position: absolute;
            inset: 0 4px;
            background: #E5E7EB;            /* neutral 200 */
            border-radius: 2px;
          }
          .handle::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 2px;
            height: 26px;
            border-radius: 2px;
            background: #D2D6DB;            /* neutral 300 */
            transition: background-color .15s;
          }
          .handle:hover::before { background: rgba(0,155,229,0.12); } /* primary tint */
          .handle:hover::after { background: #009be5; }               /* primary.main */
        `}
      </style>
    </div>
  );
}
