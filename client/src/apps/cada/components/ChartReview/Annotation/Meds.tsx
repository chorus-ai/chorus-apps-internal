import { useEffect, useState, useRef } from "react";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
import { CustomChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { Paper } from "@mui/material";
import { green } from "@mui/material/colors";

const categoryHeight = 20; // Fixed height for each category

// Render item function
function renderItem(params: any, api: any) {
  var categoryIndex = api.value(0);
  var start = api.coord([api.value(1), categoryIndex]);
  var end = api.coord([api.value(2), categoryIndex]);
  var height = api.size([0, 1])[1] * 0.6;
  var rectShape = echarts.graphic.clipRectByRect(
    {
      x: start[0],
      y: start[1] - height / 2,
      width: end[0] - start[0],
      height: height,
    },
    {
      x: params.coordSys.x,
      y: params.coordSys.y,
      width: params.coordSys.width,
      height: params.coordSys.height,
    }
  );
  return (
    rectShape && {
      type: "rect",
      transition: ["shape"],
      shape: rectShape,
      style: api.style(),
    }
  );
}

const MyEChartComponent = (props: any) => {
  const chartRef = useRef(null);
  const [chartHeight, setChartHeight] = useState("300px"); // Initial chart height

  //all categories unique
  const uniqueCategories = [
    ...new Set(props.data.map((item: any) => item.medication)),
  ];
  console.log(uniqueCategories);

  useEffect(() => {
    // Importing necessary modules
    echarts.use([
      TitleComponent,
      TooltipComponent,
      GridComponent,
      DataZoomComponent,
      CustomChart,
      CanvasRenderer,
    ]);

    // Initialize chart
    const myChart = echarts.init(chartRef.current as HTMLElement);

    // Calculate the total chart height
    const totalHeight = uniqueCategories.length * categoryHeight;
    setChartHeight(`${Math.max(totalHeight, 300)}px`); // Set a minimum height of 300px

    const chartData = [];
    // Process data for ECharts
    for (let i = 0; i < props.data.length; i++) {
      if (uniqueCategories.includes(props.data[i].medication)) {
        chartData.push({
          name: props.data[i].medication,
          value: [
            uniqueCategories.indexOf(props.data[i].medication),
            new Date(props.data[i].starttime).getTime(),
            new Date(props.data[i].stoptime).getTime(),
            new Date(props.data[i].stoptime).getTime() -
              new Date(props.data[i].starttime).getTime(),
          ],
          itemStyle: {
            normal: {
              color:
                uniqueCategories.indexOf(props.data[i].medication) % 2 === 0
                  ? "rgba(34, 166, 179,1.0)"
                  : "rgba(240, 147, 43,1.0)",
            },
          },
        });
      }
    }

    const startTime = Math.min(...chartData.map((d) => d.value[1]));

    // ECharts option setup
    var option = {
      title: {
        text: "Meds",
        left: "left",
        textStyle: {
          fontSize: 16,
          color: green[500],
        },
      },
      tooltip: {
        formatter: function (params: any) {
          const dataObj = props.data[params.dataIndex];
          return `
                <div>
                    <p><b>Medication:</b> ${dataObj.medication}</p>
                    <p><b>Start Time:</b> ${dataObj.starttime}</p>
                    <p><b>Stop Time:</b> ${dataObj.stoptime}</p>
                    <p><b>Pharmacy ID:</b> ${dataObj.pharmacy_id}</p>
                    <p><b>HADM ID:</b> ${dataObj.hadm_id}</p>
                </div>
            `;
        },
      },
      dataZoom: [
        {
          type: "inside",
          filterMode: "filter",
        },
      ],
      xAxis: {
        min: startTime,
        scale: true,
        axisLabel: {
          formatter: function (val: any) {
            //return only the month and day
            return new Date(val).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          },
        },
      },
      yAxis: {
        data: uniqueCategories,
        // wrap the label
        axisLabel: {
          formatter: function (value: any) {
            return echarts.format.truncateText(
              value,
              100,
              "10px Microsoft Yahei",
              "…"
            );
          },
        },
      },
      series: [
        {
          type: "custom",
          renderItem: renderItem,
          itemStyle: {
            opacity: 0.8,
          },
          encode: {
            x: [1, 2],
            y: 0,
          },
          data: chartData,
        },
      ],
    };

    // Render the chart
    myChart.setOption(option);

    return () => {
      myChart && myChart.dispose();
    };
  }, [props.data]);

  useEffect(() => {
    console.log(chartHeight);
    const myChart = echarts.getInstanceByDom(chartRef.current as HTMLElement);
    if (myChart) myChart.resize({ height: chartHeight as number | "auto" | undefined });
  }, [chartHeight]);

  return (
    <Paper sx={{ marginTop: 2 }}>
      <div ref={chartRef} style={{ height: chartHeight }} />
    </Paper>
  );
};

export default MyEChartComponent;
