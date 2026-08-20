import PdfViewer from "../../../common/PdfViewer";

export default function ReactPdfViewer({ url }: { url: string; title?: string }) {
  return (
    <div style={{ height: "100%", width: "100%", minHeight: 0, display: "flex" }}>
      <PdfViewer url={url} />
    </div>
  );
}
