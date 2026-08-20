
export default function Tooltip({ children, title, description, placement="right", style={} as any, width="250px", activate=true }: { children: any; title: any; description: any; placement?: any; style?: any; width?: any; activate?: any }) {

  const placementMap = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left"
  };

  const placementStyle: Record<string, any> = {};
  placementStyle[placementMap[placement]] = "calc(100% + 10px)";
  placementStyle.width = width;

  return (
    <div className="tooltip-container">
      <div className="children">
        {children}
      </div>
      {activate && <div className="tooltip-box" style={placementStyle}>
        <div className="tooltip-token-name">{title}</div>
        <div className="tooltip-description" style={style}>{description}</div>
      </div>}

      <style>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }

        .children {
          display: inline-block;
        }

        .tooltip-box {
          display: flex;
          flex-direction: column;
          text-align: left;
          position: absolute;
          top: -8px;
          // left: calc(100% + 20px);
          background-color: white;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 10px;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          z-index: 9999999999999999;
        }

        .children:hover + .tooltip-box, .tooltip-box:hover {
          opacity: 1;
        }

        .tooltip-token-name {
          font-weight: bold;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}