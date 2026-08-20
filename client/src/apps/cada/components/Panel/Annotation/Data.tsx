import PIDataPanel from "../../PI/Annotation/Data";
import PDFDataPanel from "../../PDF/Annotation/Data";

const panelMap = {
  pi: PIDataPanel,
  pdf: PDFDataPanel,
}

export default function DataPanel({type, ...props}) {
  const PanelComponent = panelMap[type];

  if (!PanelComponent) {
    return null;
  }
  
  return <PanelComponent {...props} />;
};