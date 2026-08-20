import React from "react";
import { useNavigate } from "react-router-dom";

const capabilities = [
  {
    icon: "stacks",
    title: "Stack & series navigation",
    body: "Scroll through DICOM series with thumbnails and keyboard shortcuts.",
  },
  {
    icon: "tune",
    title: "Window / level + presets",
    body: "Bone, lung, soft-tissue, brain presets and free WL/WW adjustment.",
  },
  {
    icon: "straighten",
    title: "Annotations & measurements",
    body: "Length, angle, ROI, and freeform notes saved per study.",
  },
  {
    icon: "link",
    title: "Linked to OMOP",
    body: "Open the study directly from a procedure or imaging-event row.",
  },
];

const ImagingView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Header strip */}
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-sky-400 text-3xl">
            radiology
          </span>
          <div>
            <h1 className="text-xl font-bold">DICOM Viewer</h1>
            <p className="text-xs text-slate-400">
              Radiology studies linked to OMOP procedures and visits
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
          <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
          Coming soon
        </span>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-10">
        {/* Pitch */}
        <section className="space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Open the study without leaving the chart.
          </h2>
          <p className="text-slate-400 max-w-2xl">
            The DICOM viewer will plug IVe into the PACS layer so a click on a
            procedure or imaging event opens the underlying study with window /
            level, measurements, and annotation tooling alongside the rest of
            the patient view.
          </p>
        </section>

        {/* Preview panel */}
        <section>
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Preview
          </div>
          <div className="rounded-xl border border-slate-800 bg-black h-64 flex items-center justify-center relative overflow-hidden">
            {/* Faux scan with overlays so users get a sense of the eventual layout */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/30 via-slate-800/10 to-slate-950" />
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.25),transparent_55%)]" />
            <span className="material-symbols-outlined text-slate-600 text-[120px] relative">
              radiology
            </span>

            <div className="absolute top-3 left-4 text-amber-300/80 text-[11px] font-mono leading-tight">
              <div>STUDY · CT CHEST</div>
              <div>SERIES 3 / 4</div>
              <div>IMG 45 / 120</div>
            </div>
            <div className="absolute top-3 right-4 text-slate-400 text-[11px] font-mono leading-tight text-right">
              <div>WL 40 · WW 400</div>
              <div>kV 120 · mA 200</div>
            </div>
            <div className="absolute bottom-3 left-4 text-slate-500 text-[11px] font-mono">
              MOCK DATA
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            What it will do
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex gap-3"
              >
                <span className="material-symbols-outlined text-sky-400 text-2xl">
                  {c.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {c.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{c.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTAs */}
        <section className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/ive/tables")}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <span className="material-symbols-outlined text-base">
              table_chart
            </span>
            Back to tables
          </button>
          <button
            type="button"
            onClick={() => navigate("/ive")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
          >
            Explore other views
          </button>
        </section>
      </div>
    </div>
  );
};

export default ImagingView;
