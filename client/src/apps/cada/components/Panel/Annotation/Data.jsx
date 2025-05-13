import React from "react";
import PIDataPanel from "../../PI/Annotation/Data";

const panelMap = {
  pi: PIDataPanel,
}

export default function DataPanel({type, ...props}) {
  const PanelComponent = panelMap[type];

  if (!PanelComponent) {
    return null;
  }
  
  return <PanelComponent {...props} />;
};