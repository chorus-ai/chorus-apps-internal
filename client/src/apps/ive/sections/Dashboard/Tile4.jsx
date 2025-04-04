
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';



import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';


// Sample medication data with relative day calculation
const medicationData = [
  { medication: "Aspirin", date: "2024-01-01", dosage: 50 },
  { medication: "Aspirin", date: "2024-01-02", dosage: 80 },
  { medication: "Aspirin", date: "2024-01-03", dosage: 90 },
  { medication: "Ibuprofen", date: "2024-01-01", dosage: 60 },
  { medication: "Ibuprofen", date: "2024-01-02", dosage: 70 },
  { medication: "Ibuprofen", date: "2024-01-03", dosage: 100 },
  { medication: "Aspirin", date: "2024-01-04", dosage: 50 },
  { medication: "Aspirin", date: "2024-01-05", dosage: 80 },
  { medication: "Aspirin", date: "2024-01-06", dosage: 90 },
  { medication: "Ibuprofen", date: "2024-01-04", dosage: 60 },
  { medication: "Ibuprofen", date: "2024-01-05", dosage: 70 },
  { medication: "Ibuprofen", date: "2024-01-06", dosage: 100 },
  { medication: "Aspirin", date: "2024-01-07", dosage: 50 },
  { medication: "Aspirin", date: "2024-01-08", dosage: 80 },
  { medication: "Aspirin", date: "2024-01-09", dosage: 90 },
  { medication: "Ibuprofen", date: "2024-01-07", dosage: 60 },
];

// Function to calculate days from zero day
const calculateDaysFromZero = (data, zeroDay) => {
  const zeroDate = new Date(zeroDay);
  return data.map(item => ({
    ...item,
    day: Math.floor((new Date(item.date) - zeroDate) / (1000 * 60 * 60 * 24)),
  }));
};

// Setting zero day as "2024-01-01" for this example
const processedData = calculateDaysFromZero(medicationData, "2024-01-01");

export default function OmopMedicationChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    // Initialize the chart
    const chartInstance = echarts.init(chartRef.current);

    // Prepare data for chart display
    const days = Array.from(new Set(processedData.map(item => `Day ${item.day}`))); // Unique day labels
    const aspirinData = processedData
      .filter(item => item.medication === "Aspirin")
      .map(item => item.dosage);
    const ibuprofenData = processedData
      .filter(item => item.medication === "Ibuprofen")
      .map(item => item.dosage);

    // Define the chart options
    const options = {
      title: {
        text: 'Medication Usage Relative to Day 0',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: days,
        name: 'Days from Zero',
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: 'Dosage (mg)'
      },
      series: [
        {
          name: 'Aspirin',
          type: 'bar',
          data: aspirinData,
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#3498db'
          }
        },
        {
          name: 'Ibuprofen',
          type: 'bar',
          data: ibuprofenData,
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#1abc9c'
          }
        }
      ],
      legend: {
        data: ['Aspirin', 'Ibuprofen'],
        top: 'bottom'
      }
    };


    // Set options
    chartInstance.setOption(options);

    // Resize chart on window resize
    const handleResize = () => chartInstance.resize();
    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.dispose();
    };
  }, []);

  return (

    <Card sx={{ height: "100%", width: "100%" }}>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Medication (Aspirin, Ibuprofen)
      </Typography>

      <div>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '320px', marginTop: '10px' }}
      />
    </div>
    </CardContent>
  </Card>
    
  );
}
