import PDFViewer from './PDFViewer';

export default function PDFDataPanel({ filePath, category }) {
  console.log(filePath)
  return (
    <>
      {filePath && <PDFViewer
        file={`/api/cada/file/pdf?filename=${encodeURIComponent(filePath)}`}
        fileName={filePath.split('/').pop()}
        category={category}
      />}
    </>
  )
}
