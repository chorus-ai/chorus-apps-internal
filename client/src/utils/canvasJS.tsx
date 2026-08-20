import { useEffect, useRef } from "react";

const Canvas = (props: any) => {
  const nodeRef = useRef(null);
  const chartRef = useRef(null);

  const renderChart = () => {
    const CanvasJS = window.CanvasJS;
    if (!CanvasJS) {
      console.error(
        "CanvasJS not found. Ensure you added <script src='/canvasjs.min.js'></script> to index.html and the file exists in /public."
      );
      return;
    }

    // destroy previous chart if any
    if (chartRef.current) {
      props.chartObjCallback?.(chartRef.current, "remove");
      chartRef.current.destroy();
      chartRef.current = null;
    }

    if (!nodeRef.current) return;

    const newChart = new CanvasJS.Chart(nodeRef.current, props.config);
    chartRef.current = newChart;

    // apply options and render
    props.chartObjCallback?.(newChart, "add");
    if (props.hideToolbar && newChart._toolBar) newChart._toolBar.style.display = "none";
    newChart.render();
  };

  // initial mount + cleanup
  useEffect(() => {
    renderChart();
    return () => {
      if (chartRef.current) {
        props.chartObjCallback?.(chartRef.current, "remove");
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-render when config changes
  useEffect(() => {
    if (props.config) renderChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.config, props.hideToolbar, props.chartObjCallback]);

  return (
    <div
      ref={nodeRef}
      style={{
        height: props.height,
        width: props.width,
        position: props.position,
      }}
    />
  );
};

export default Canvas;
