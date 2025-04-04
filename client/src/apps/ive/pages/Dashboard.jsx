// import React, { useState, useEffect, useRef } from 'react';
// import { Container, 
//   Typography, 
//   Box, 
//   Accordion, 
//   AccordionSummary, 
//   AccordionDetails, 
//   Grid, 
//   MenuItem, 
//   Select, 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import Papa from 'papaparse';
// import * as echarts from 'echarts';

// const DashboardContainer = styled(Container)(({ theme }) => ({
//   padding: theme.spacing(4),
//   maxWidth: 'lg',
// }));

// const SectionBox = styled(Box)(({ theme }) => ({
//   marginTop: theme.spacing(4),
//   marginBottom: theme.spacing(4),
// }));

// const DataDeliveriesDashboard = () => {
//   const [df, setDf] = useState([]);
//   const [bySite, setBySite] = useState([]);
//   const [selectedContainer, setSelectedContainer] = useState('columbia');
//   const chartRef1 = useRef(null);
//   const chartRef2 = useRef(null);

//   useEffect(() => {
//     fetch('all_metadata.csv')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.text();
//       })
//       .then(text => {
//         Papa.parse(text, {
//           header: true,
//           complete: (result) => {
//             const data = result.data.map(item => ({
//               ...item,
//               year_modified: item.last_modified ? new Date(item.last_modified).getFullYear() : null,
//               month_modified: item.last_modified ? new Date(item.last_modified).getMonth() + 1 : null,
//               quarter_modified: item.last_modified ? Math.floor(new Date(item.last_modified).getMonth() / 3) + 1 : null,
//               mode: item.name ? 
//                     item.name.toLowerCase().includes("omop") ? "OMOP" :
//                     item.name.toLowerCase().includes("wave") ? "WAVEFORM" :
//                     item.name.toLowerCase().includes("image") ? "IMAGE" :
//                     item.name.toLowerCase().includes("note") ? "NOTE" : "NONE"
//                     : "NONE" // Default to "NONE" if item.name is undefined
//             }));
//             setDf(data);
//             setBySite(aggregateByContainer(data)); // Process data for grouped view
//           },
//         });
//       })
//       .catch(error => console.error("Error loading CSV file:", error));
//   }, []);
  

//   const aggregateByContainer = (data) => {
//     const byContainer = {};
//     data.forEach(item => {
//       const container = item.container;
//       if (!byContainer[container]) {
//         byContainer[container] = {
//           OMOP_SIZE: 0, WAVEFORM_SIZE: 0, IMAGE_SIZE: 0, NOTE_SIZE: 0,
//           OMOP_FILES: 0, WAVEFORM_FILES: 0, IMAGE_FILES: 0, NOTE_FILES: 0,
//           MOST_RECENT_UPLOAD: item.last_modified,
//         };
//       }
//       byContainer[container][`${item.mode}_SIZE`] += parseFloat(item.size || 0);
//       byContainer[container][`${item.mode}_FILES`] += 1;
//       if (new Date(item.last_modified) > new Date(byContainer[container].MOST_RECENT_UPLOAD)) {
//         byContainer[container].MOST_RECENT_UPLOAD = item.last_modified;
//       }
//     });
//     return Object.keys(byContainer).map(key => ({ container: key, ...byContainer[key] }));
//   };

//   const handleContainerChange = (event) => setSelectedContainer(event.target.value);

//   const renderChart = (chartContainer, title, data) => {
//     const chartInstance = echarts.init(chartContainer);
//     chartInstance.setOption({
//       title: { text: title, left: 'center' },
//       tooltip: { trigger: 'item' },
//       series: [{
//         name: 'Data Distribution', type: 'pie', radius: '50%', data,
//         emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }},
//       }],
//     });
//     window.addEventListener('resize', () => chartInstance.resize());
//   };

//   useEffect(() => {
//     if (chartRef1.current && chartRef2.current) {
//       renderChart(chartRef1.current, 'OMOP Data Size', [
//         { value: 40, name: 'OMOP' },
//         { value: 20, name: 'Waveform' },
//         { value: 20, name: 'Image' },
//         { value: 20, name: 'Note' },
//       ]);
//       renderChart(chartRef2.current, 'Waveform Data Size', [
//         { value: 10, name: 'OMOP' },
//         { value: 60, name: 'Waveform' },
//         { value: 10, name: 'Image' },
//         { value: 20, name: 'Note' },
//       ]);
//     }
//   }, [df]);

//   return (
//     <DashboardContainer>
//       <SectionBox>
//         <Typography variant="h4" align="center">CHoRUS Data Delivery Dashboard</Typography>   
//          <Typography>
//             The dashboard references files delivered to the storage container. Information is updated daily and accurate within a 24-hour window.
//           </Typography>
//       </SectionBox>

//       <SectionBox>
//         <Select value={selectedContainer} onChange={handleContainerChange} fullWidth>
//           {bySite.map((site) => (
//             <MenuItem key={site.container} value={site.container}>{site.container}</MenuItem>
//           ))}
//         </Select>
//       </SectionBox>


//       <SectionBox>
//         <Typography variant="h6" sx={{mb: 2}}>Overview of Aggregate Upload Characteristics</Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Container</TableCell>
//                 <TableCell align="right">OMOP Size (GB)</TableCell>
//                 <TableCell align="right">Waveform Size (GB)</TableCell>
//                 <TableCell align="right">Image Size (GB)</TableCell>
//                 <TableCell align="right">Note Size (GB)</TableCell>
//                 <TableCell align="right">Most Recent Upload</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {bySite.filter(site => site.container === selectedContainer).map((site, idx) => (
//                 <TableRow key={idx}>
//                   <TableCell>{site.container}</TableCell>
//                   <TableCell align="right">{site.OMOP_SIZE}</TableCell>
//                   <TableCell align="right">{site.WAVEFORM_SIZE}</TableCell>
//                   <TableCell align="right">{site.IMAGE_SIZE}</TableCell>
//                   <TableCell align="right">{site.NOTE_SIZE}</TableCell>
//                   <TableCell align="right">{site.MOST_RECENT_UPLOAD}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </SectionBox>

//       <SectionBox>
//         <Typography variant="h6" sx={{mb: 2}}>Data Upload Statistics</Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={6} md={3}><div ref={chartRef1} style={{ height: 300 }} /></Grid>
//           <Grid item xs={6} md={3}><div ref={chartRef2} style={{ height: 300 }} /></Grid>
//         </Grid>
//       </SectionBox>
//     </DashboardContainer>
//   );
// };

// export default DataDeliveriesDashboard;


import React, { useEffect } from "react";
import { Container, Typography, Grid, AppBar, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Tiles from "../sections/Dashboard/Tiles";
import IconButton from "@mui/material/IconButton";
import { TbDragDrop2 } from "react-icons/tb";


import { useState } from "react";
export default function Assignments() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.main.user);

// add disbale state for Tiles
  const [disabled, setDisabled] = useState(true);

  if (user) {
    return (
      <Container maxWidth="xl">
        <Grid container >
        <Grid item sm={12}>
          <AppBar
            sx={{ bgcolor: "rgba(0, 0, 0, 0)", mt: 5, mb: 3, pr: 1 }}
            position="static"
            color="inherit"
            elevation={0}
          >
            <Grid container alignItems="center">
              <Grid item xs>
             
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() => setDisabled(!disabled)}
                  color={disabled ? "info" : "neutral"}
                >
            <TbDragDrop2 />
          </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </AppBar>
        </Grid>
      </Grid>
        <Tiles disabled={disabled} />
      </Container>
    );
  } else {
    return (
      <Container
        sx={{
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          minHeight: "100vh",
          display: "flex",
        }}
      >
        <Typography variant="h3" paragraph>
          There are no data.
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          Contact your admin!
        </Typography>
      </Container>
    );
  }
}

