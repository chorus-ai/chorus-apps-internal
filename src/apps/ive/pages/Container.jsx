import React, { useEffect, useState } from 'react';
import { Container, 
  Grid, 
  Typography, 
  MenuItem, 
  Select, 
  Card, 
  CardContent
} from '@mui/material';
import axios from 'axios';

const allTableColumns = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'container', headerName: 'Container', width: 150 },
  { field: 'mode', headerName: 'Mode', width: 100 },
  { field: 'size', headerName: 'Size (GB)', width: 100 },
  { field: 'extension', headerName: 'Extension', width: 100 },
  { field: 'year_modified', headerName: 'Year Modified', width: 100 },
  { field: 'month_modified', headerName: 'Month Modified', width: 100 },
  { field: 'quarter_modified', headerName: 'Quarter Modified', width: 100 },
  { field: 'last_modified', headerName: 'Last Modified', width: 150 },
];

const groupTableColumns = [
  { field: 'container', headerName: 'Container', width: 150 },
  { field: 'OMOP_SIZE', headerName: 'OMOP Size (GB)', width: 150 },
  { field: 'WAVEFORM_SIZE', headerName: 'Waveform Size (GB)', width: 150 },
  { field: 'IMAGE_SIZE', headerName: 'Image Size (GB)', width: 150 },
  { field: 'NOTE_SIZE', headerName: 'Note Size (GB)', width: 150 },
  // Other group table columns here...
  { field: 'MOST_RECENT_UPLOAD', headerName: 'Most Recent Upload', width: 200 },
];

function DataDeliveryDashboard() {
  const [data, setData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState('');

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('/'); // Replace with your data endpoint
      setData(response.data);
      setGroupData(response.groupData);
      setSelectedContainer(response.data[0]?.container || '');
    }
    fetchData();
  }, []);

  const handleContainerChange = (event) => {
    setSelectedContainer(event.target.value);
  };

  const filteredData = data.filter(row => row.container === selectedContainer);
  const filteredGroupData = groupData.filter(row => row.container === selectedContainer);

  return (
    <Container>
      <Typography variant="h3" gutterBottom>CHoRUS Data Delivery Dashboard</Typography>

      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Select a Site</Typography>
              <Select
                fullWidth
                value={selectedContainer}
                onChange={handleContainerChange}
              >
                {data.map((row) => (
                  <MenuItem key={row.container} value={row.container}>
                    {row.container}
                  </MenuItem>
                ))}
              </Select>
            </CardContent>
          </Card>
          
        </Grid>

        <Grid item xs={9}>
          <Typography variant="h5">Data Delivery Report for {selectedContainer}</Typography>
          <Typography variant="body1">Metadata refreshed daily.</Typography>
          <Typography variant="h6">Overview of aggregate upload characteristics</Typography>
          {/* <DataGrid
            rows={filteredGroupData}
            columns={groupTableColumns}
            pageSize={5}
            autoHeight
          />

          <Typography variant="h6" style={{ marginTop: '2em' }}>Overview of all files delivered</Typography>
          <DataGrid
            rows={filteredData}
            columns={allTableColumns}
            pageSize={5}
            autoHeight
          /> */}
        </Grid>
      </Grid>
    </Container>
  );
}

export default DataDeliveryDashboard;
