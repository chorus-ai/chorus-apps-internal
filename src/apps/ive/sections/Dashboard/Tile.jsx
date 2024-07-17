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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



export default function BasicCard() {

  const data = [
    {
      name: 'Page A',
      uv: 4000
    },
    {
      name: 'Page B',
      uv: 3000
    },
    {
      name: 'Page C',
      uv: 2000
    },
    {
      name: 'Page D',
      uv: 2780
    },
    {
      name: 'Page E',
      uv: 1890
    },
    {
      name: 'Page F',
      uv: 2390
    },
    {
      name: 'Page G',
      uv: 3490
    },
    {
      name: 'Page H',
      uv: 5000
    },
    {
      name: 'Page I',
      uv: 4200
    },
    {
      name: 'Page J',
      uv: 2800
    },
    {
      name: 'Page K',
      uv: 3300
    },
  ];

  const data1 = [
    {
      name: 'Page A',
      uv: 4000
    },
    {
      name: 'Page B',
      uv: 3000
    },
    {
      name: 'Page C',
      uv: 2000
    },
    {
      name: 'Page D',
      uv: 2780
    },
    {
      name: 'Page E',
      uv: 1890
    },
    {
      name: 'Page F',
      uv: 2390
    },
    {
      name: 'Page G',
      uv: 3490
    },
    {
      name: 'Page H',
      uv: 5000
    },
    {
      name: 'Page I',
      uv: 4200
    },
    {
      name: 'Page J',
      uv: 2800
    },
    {
      name: 'Page K',
      uv: 3300
    },
    {
      name: 'Page L',
      uv: 4100
    },
    {
      name: 'Page M',
      uv: 3600
    },
    {
      name: 'Page N',
      uv: 2800
    },
    {
      name: 'Page O',
      uv: 4500
    },
    {
      name: 'Page P',
      uv: 3200
    },
  ];
  
  const data2 = [
    {
      name: 'Product A',
      sales: 500,
      inventory: 200,
      price: 10.99,
    },
    {
      name: 'Product B',
      sales: 800,
      inventory: 100,
      price: 15.99,
    },
    {
      name: 'Product C',
      sales: 300,
      inventory: 150,
      price: 8.99,
    },
    {
      name: 'Product D',
      sales: 1000,
      inventory: 50,
      price: 19.99,
    },
    {
      name: 'Product E',
      sales: 600,
      inventory: 80,
      price: 12.99,
    },
    {
      name: 'Product F',
      sales: 400,
      inventory: 120,
      price: 9.99,
    },
    {
      name: 'Product G',
      sales: 700,
      inventory: 70,
      price: 17.99,
    },
    {
      name: 'Product H',
      sales: 550,
      inventory: 90,
      price: 11.99,
    },
    {
      name: 'Product I',
      sales: 350,
      inventory: 130,
      price: 7.99,
    },
    {
      name: 'Product J',
      sales: 450,
      inventory: 110,
      price: 14.99,
    },
    {
      name: 'Product K',
      sales: 650,
      inventory: 60,
      price: 16.99,
    },
    {
      name: 'Product L',
      sales: 470,
      inventory: 100,
      price: 13.99,
    },
    {
      name: 'Product M',
      sales: 380,
      inventory: 140,
      price: 10.49,
    },
    {
      name: 'Product N',
      sales: 520,
      inventory: 75,
      price: 18.49,
    },
    {
      name: 'Product O',
      sales: 670,
      inventory: 85,
      price: 12.49,
    },
    {
      name: 'Product P',
      sales: 420,
      inventory: 115,
      price: 9.49,
    },
  ];
  

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

  return (
    <Card sx={{ height: "100%", width: "100%" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Vitals
        </Typography>
        <Stack sx={{ width: '100%', color: 'grey.500' , flexGrow: 1}} spacing={2}>
              <LinearProgress color="secondary" />

            <Chart
            leadOrder={[]}
              range={30}
              fileLength={30}
              completedTab={true}        
              getChartObj={getChartObj}
              filename={"/afib/test2.adibin"}
              nextFilename={"/afib/test2.adibin"}
            />
            </Stack>
            {/* <ResponsiveContainer width="100%" height={100}>
              <LineChart
                width={500}
                height={100}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>

    <ResponsiveContainer width="100%" height={100}>
      <LineChart
        width={500}
        height={100}
        data={data1}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 2 }} />
      </LineChart>
    </ResponsiveContainer>

    <ResponsiveContainer width="100%" height={100}>
      <LineChart
        width={500}
        height={100}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 2 }} />
      </LineChart>
      
    </ResponsiveContainer> */}
      </CardContent>
    </Card>
  );
}