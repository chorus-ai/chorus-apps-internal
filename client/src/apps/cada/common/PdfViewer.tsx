import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
// Worker is bundled from the installed pdfjs-dist — no CDN, no version drift.
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  MdZoomIn,
  MdZoomOut,
  MdChevronLeft,
  MdChevronRight,
  MdFitScreen,
  MdFullscreen,
} from "react-icons/md";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const MIN_SCALE = 0.2;
const MAX_SCALE = 6;
const PAGE_GAP = 12;
const PAD = 32; // total horizontal/vertical breathing room used for fit math

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

type FitMode = "width" | "page" | "custom";
type Size = { w: number; h: number };

/** Renders a single PDF page to a canvas, cancelling any in-flight render on change. */
function PdfPage({
  doc,
  pageNumber,
  scale,
  estimate,
}: {
  doc: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  estimate: Size | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState<Size | null>(null);

  useEffect(() => {
    let cancelled = false;
    let renderTask: ReturnType<PDFPageProxy["render"]> | null = null;

    doc.getPage(pageNumber).then((page) => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale });
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      setSize({ w: viewport.width, h: viewport.height });

      renderTask = page.render({
        canvasContext: ctx,
        viewport,
        transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
      });
      // Swallow the cancellation rejection that fires when scale changes mid-render.
      renderTask.promise.catch(() => {});
    });

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [doc, pageNumber, scale]);

  // Reserve space (page 1's size scaled) before the real render lands, so scroll
  // position and the visible-page observer are stable.
  const w = size?.w ?? (estimate ? estimate.w * scale : 0);
  const h = size?.h ?? (estimate ? estimate.h * scale : 0);

  return (
    <div
      data-pdf-page={pageNumber}
      style={{
        margin: `0 auto ${PAGE_GAP}px`,
        width: w || undefined,
        background: "#fff",
        boxShadow: "0 1px 5px rgba(0,0,0,0.35)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: w || undefined, height: h || undefined }}
      />
    </div>
  );
}

export default function PdfViewer({
  url,
  header,
  withCredentials = true,
}: {
  url: string;
  header?: ReactNode;
  withCredentials?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [baseSize, setBaseSize] = useState<Size | null>(null); // page 1 @ scale 1
  const [scale, setScale] = useState(1);
  const [fitMode, setFitMode] = useState<FitMode>("width");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- load document -------------------------------------------------------
  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    setLoading(true);
    setError(null);
    setDoc(null);
    setNumPages(0);
    setCurrentPage(1);
    setBaseSize(null);

    const loadingTask = pdfjsLib.getDocument({ url, withCredentials });
    loadingTask.promise
      .then(async (pdf) => {
        if (cancelled) {
          pdf.destroy();
          return;
        }
        const first = await pdf.getPage(1);
        const vp = first.getViewport({ scale: 1 });
        if (cancelled) {
          pdf.destroy();
          return;
        }
        setBaseSize({ w: vp.width, h: vp.height });
        setNumPages(pdf.numPages);
        setDoc(pdf);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load PDF");
          setLoading(false);
        }
      });

    // destroy() aborts the load and tears down the worker document.
    return () => {
      cancelled = true;
      loadingTask.destroy();
    };
  }, [url, withCredentials]);

  // Keep the editable page box in sync as the visible page changes.
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  // --- fit math ------------------------------------------------------------
  const computeFitScale = useCallback(
    (mode: "width" | "page") => {
      const el = scrollRef.current;
      if (!el || !baseSize) return 1;
      const sW = (el.clientWidth - PAD) / baseSize.w;
      if (mode === "width") return clamp(sW, MIN_SCALE, MAX_SCALE);
      const sH = (el.clientHeight - PAD) / baseSize.h;
      return clamp(Math.min(sW, sH), MIN_SCALE, MAX_SCALE);
    },
    [baseSize],
  );

  // Apply fit when the mode, the document, or the container size changes.
  useLayoutEffect(() => {
    if (fitMode === "custom" || !baseSize) return;
    setScale(computeFitScale(fitMode));
  }, [fitMode, baseSize, computeFitScale]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale((prev) => (fitMode === "custom" ? prev : computeFitScale(fitMode)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fitMode, computeFitScale]);

  // --- track the page currently in view ------------------------------------
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !numPages) return;
    const ratios = new Map<number, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const n = Number((e.target as HTMLElement).dataset.pdfPage);
          ratios.set(n, e.intersectionRatio);
        }
        let best = 1;
        let bestRatio = -1;
        ratios.forEach((r, n) => {
          if (r > bestRatio) {
            bestRatio = r;
            best = n;
          }
        });
        if (bestRatio > 0) setCurrentPage(best);
      },
      { root, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    root.querySelectorAll<HTMLElement>("[data-pdf-page]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [numPages]);

  // --- controls ------------------------------------------------------------
  const zoomBy = (factor: number) => {
    setFitMode("custom");
    setScale((s) => clamp(s * factor, MIN_SCALE, MAX_SCALE));
  };

  const goToPage = useCallback(
    (n: number) => {
      const target = clamp(n, 1, numPages);
      scrollRef.current
        ?.querySelector<HTMLElement>(`[data-pdf-page="${target}"]`)
        ?.scrollIntoView({ block: "start", behavior: "smooth" });
    },
    [numPages],
  );

  const commitPageInput = () => {
    const n = parseInt(pageInput, 10);
    if (Number.isFinite(n)) goToPage(n);
    else setPageInput(String(currentPage));
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      {header != null && (
        <Box
          sx={{
            height: 50,
            display: "flex",
            alignItems: "center",
            px: 2,
            bgcolor: "#fff",
            borderBottom: "1px solid #e0e0e0",
            fontWeight: 600,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {header}
        </Box>
      )}

      {/* toolbar: zoom + fit */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          py: 0.5,
          bgcolor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
          flexShrink: 0,
        }}
      >
        <Box sx={{ flex: 1 }} />

        <Tooltip title="Zoom out">
          <span>
            <IconButton size="small" disabled={!doc} onClick={() => zoomBy(1 / 1.2)}>
              <MdZoomOut />
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="body2" sx={{ minWidth: 44, textAlign: "center", userSelect: "none" }}>
          {Math.round(scale * 100)}%
        </Typography>
        <Tooltip title="Zoom in">
          <span>
            <IconButton size="small" disabled={!doc} onClick={() => zoomBy(1.2)}>
              <MdZoomIn />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Fit width">
          <span>
            <IconButton
              size="small"
              color={fitMode === "width" ? "primary" : "default"}
              disabled={!doc}
              onClick={() => setFitMode("width")}
            >
              <MdFullscreen style={{ transform: "rotate(90deg)" }} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Fit page">
          <span>
            <IconButton
              size="small"
              color={fitMode === "page" ? "primary" : "default"}
              disabled={!doc}
              onClick={() => setFitMode("page")}
            >
              <MdFitScreen />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* scroll area */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          bgcolor: "#525659",
          p: 2,
          position: "relative",
        }}
      >
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
            <CircularProgress sx={{ color: "#fff" }} />
          </Box>
        )}
        {error && (
          <Box sx={{ textAlign: "center", pt: 8 }}>
            <Typography sx={{ color: "#fff" }}>{error}</Typography>
          </Box>
        )}
        {doc &&
          Array.from({ length: numPages }, (_, i) => (
            <PdfPage key={i + 1} doc={doc} pageNumber={i + 1} scale={scale} estimate={baseSize} />
          ))}
      </Box>

      {/* floating page navigator, centered at the bottom */}
      {doc && numPages > 0 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            gap: 0.2,
            pl: 1,
            pr: 1,
            py: 0.5,
            bgcolor: "#fff",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: "999px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.22)",
          }}
        >
          <Tooltip title="Prev page">
            <span>
              <IconButton size="small" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>
                <MdChevronLeft />
              </IconButton>
            </span>
          </Tooltip>

          <InputBase
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            onBlur={commitPageInput}
            inputProps={{
              "aria-label": "Current page",
              style: { textAlign: "center", padding: 0, outline: "none" },
            }}
            sx={{
              width: 30,
              height: 30,
              border: "1px solid rgba(0,0,0,0.23)",
              borderRadius: "5px",
              fontWeight: 400,
            }}
          />

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", minWidth: 24, textAlign: "center", px: 0.5, userSelect: "none" }}
          >
            {numPages}
          </Typography>

          <Tooltip title="Next page">
            <span>
              <IconButton size="small" disabled={currentPage >= numPages} onClick={() => goToPage(currentPage + 1)}>
                <MdChevronRight />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
