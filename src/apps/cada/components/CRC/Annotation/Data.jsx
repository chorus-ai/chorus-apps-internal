import React from "react";
import PDFViewer from "./PDFViewer";

export default function DataPanel({ filePath, category }) {
  return (
    <>
      <PDFViewer
        file={`/api/cada/files/pdf?filename=${encodeURIComponent(filePath)}`}
        fileName={filePath.split("/").pop()}
        category={category}
      />
    </>
  );
}
