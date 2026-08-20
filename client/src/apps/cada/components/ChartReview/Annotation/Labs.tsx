import { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import { Paper } from "@mui/material";

const categoryHeight = 3; // Fixed height for each category

const MyEChartsComponent = (props: any) => {
  const chartRef = useRef(null);
  const [chartHeight, setChartHeight] = useState("300px"); // Initial chart height

  useEffect(() => {
    const myChart = echarts.init(chartRef.current as HTMLElement);

    //all categories unique
    const uniqueCategories = [
      ...new Set(props.data.map((item: any) => item.itemid)),
    ];
    console.log(uniqueCategories, props.data.length);

    // Calculate the total chart height
    const totalHeight = props.data.length * categoryHeight;
    setChartHeight(`${Math.max(totalHeight, 300)}px`); // Set a minimum height of 300px

    console.log("totalHeight", totalHeight);
    // Convert charttime to timestamp and map data
    const scatterData = props.data.map((lab: any) => {
      return {
        timestamp: new Date(lab.charttime).getTime(),
        itemid: lab.itemid,
      };
    });

    // Extract unique specimens for y-axis categories
    const specimens = Array.from(
      new Set(scatterData.map((item: any) => item.itemid))
    );
    console.log("specimens", specimens);
    console.log("scatterData", scatterData);
    const option = {
      title: {
        text: "Labs",
        left: "left",
        textStyle: {
          fontSize: 16,
        },
      },
      xAxis: {
        type: "time",
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
        type: "category",
        data: uniqueCategories,
      },
      tooltip: {
        formatter: function (params: any) {
          const dataObj = props.data[params.dataIndex];
          return `
                <div>
                    <p><b>Medication:</b> ${dataObj.itemid}</p>
                </div>
            `;
        },
      },
      series: [
        {
          symbolSize: 10,
          color: "rgba(0, 184, 148, 0.5)",
          data: scatterData.map((item: any) => [
            item.timestamp,
            specimens.indexOf(item.itemid),
          ]),
          type: "scatter",
        },
      ],
    };

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

export default MyEChartsComponent;
