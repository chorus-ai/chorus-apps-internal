import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Chart from '../../../cada/components/Afib/Annotation/Data';
import { useState } from 'react';
import useDidMountEffect from '../../../../hooks/useDidMountEffect';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



export default function BasicCard() {

  const [resetButtonVisibility, setResetButtonVisibility] = useState(false);
  const [chartObjects, setChartObjects] = React.useState([]);
  const [selectedRanges, setSelectedRanges] = React.useState({});
  
  const getChartObj = (obj, type) => {
    if (type === "add") {
      setChartObjects((chartObjects) => [...chartObjects, obj]);
    } else if (type === "remove") {
      setChartObjects((chartObjects) => {
        let copy = Object.assign([], chartObjects);

        for (let i = 0; i < copy.length; i++) {
          if (copy[i] === obj) {
            copy.splice(i, 1);
          }
        }
        return copy;
      });
    }
  };

  const onSelectRange = (e) => {
    if (resetButtonVisibility === false) {
      setSelectedRanges({
        ...selectedRanges,
        min: e.axisX[0].viewportMinimum,
        max: e.axisX[0].viewportMaximum,
      });
      setResetButtonVisibility(true);
    }
  };

  const handleResetButtonClick = () => {
    let charts = chartObjects;
    for (let i = 0; i < charts.length; i++) {
      charts[i].options.axisX.viewportMinimum = 0;
      charts[i].options.axisX.viewportMaximum = 30;
      charts[i].render();
      if (charts[i]._zoomButton.getAttribute("state") === "zoom") {
        charts[i]._zoomButton.click();
      }
    }
    setResetButtonVisibility(false);
  };

  useDidMountEffect(() => {
    if (chartObjects) {
      let charts = chartObjects;
      for (let i = 0; i < charts.length; i++) {
        charts[i].options.axisX.viewportMinimum = selectedRanges.min;
        charts[i].options.axisX.viewportMaximum = selectedRanges.max;
        charts[i].render();
        if (charts[i]._zoomButton.getAttribute("state") === "pan") {
          charts[i]._zoomButton.click();
        }
      }
    }
  }, [selectedRanges]);

  return (
    <>
          <Chart
            leadOrder={[]}
              range={30}
              fileLength={30}
              completedTab={true}   
              viewportInterval={onSelectRange}     
              getChartObj={getChartObj}
              filename={"/afib/test2.adibin"}
              nextFilename={"/afib/test2.adibin"}
            />
    </>
  );
}