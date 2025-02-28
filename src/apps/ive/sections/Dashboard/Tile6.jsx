import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tile from './Tile';

const VisitChart = () => {
    const chartRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState('');

    const handleClickOpen = (data) => {
        setDialogContent(`Waveform duration: ${data.value[3]} ms`);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (chartRef.current) {
            const myChart = echarts.init(chartRef.current);

            const data = [];
            const dataCount = 10;
            const startTime = +new Date();
            const visitIds = [2568766, 1561700, 2399783];
            const types = [{ name: 'Waveform', color: '#7b9ce1' }];

            visitIds.forEach((visitId, index) => {
                let baseTime = startTime;
                for (let i = 0; i < dataCount; i++) {
                    const type = types[0];
                    const duration = Math.floor(Math.random() * 10000);
                    data.push({
                        name: type.name,
                        value: [index, baseTime, (baseTime += duration), duration],
                        itemStyle: {
                            color: type.color
                        }
                    });
                    baseTime += Math.floor(Math.random() * 2000);
                }
            });

            const option = {
                tooltip: {
                    formatter: params => `${params.marker}${params.name}: ${params.value[3]} ms`
                },
                grid: {
                    height: 300
                },
                xAxis: {
                    min: startTime,
                    scale: true,
                    axisLabel: {
                        formatter: val => `${Math.max(0, val - startTime)} ms`
                    }
                },
                yAxis: {
                    data: visitIds.map(id => `Visit ${id}`)
                },
                series: [
                    {
                        type: 'custom',
                        renderItem: (params, api) => {
                            const categoryIndex = api.value(0);
                            const start = api.coord([api.value(1), categoryIndex]);
                            const end = api.coord([api.value(2), categoryIndex]);
                            const height = api.size([0, 1])[1] * 0.6;
                            const rectShape = echarts.graphic.clipRectByRect({
                                x: start[0],
                                y: start[1] - height / 2,
                                width: end[0] - start[0],
                                height: height
                            }, {
                                x: params.coordSys.x,
                                y: params.coordSys.y,
                                width: params.coordSys.width,
                                height: params.coordSys.height
                            });
                            return rectShape && {
                                type: 'rect',
                                shape: rectShape,
                                style: api.style()
                            };
                        },
                        itemStyle: {
                            opacity: 0.8
                        },
                        encode: {
                            x: [1, 2],
                            y: 0
                        },
                        data: data
                    }
                ]
            };

            myChart.setOption(option);

            myChart.on('click', function (params) {
                if (params.componentType === 'series') {
                    handleClickOpen(params);
                }
            });

            return () => {
                myChart.off('click');
                myChart.dispose();
            };
        }
    }, []);

    return (
      <Card sx={{ height: "100%", width: "100%" }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Visit Waveforms <Chip label="3" size="small" />
          </Typography>
          <div
            ref={chartRef}
            style={{ height: 400, width: "100%", padding: 0 }}
          />
          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth="xl"
          >
            <DialogTitle>{"Waveform "}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Tile />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    );
};

export default VisitChart;
