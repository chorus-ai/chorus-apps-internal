import PdfViewer from "../../../common/PdfViewer";

export default function PDFViewer({
  file,
  fileName,
  category,
}: {
  file: string;
  fileName?: string;
  category?: string;
}) {
  if (!file) return null;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <PdfViewer
        url={file}
        header={`${category ? `${category} : ` : ""}${fileName ?? ""}`}
      />
    </div>
  );
}
