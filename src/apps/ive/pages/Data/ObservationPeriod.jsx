import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ObservationPeriodTable = () => {
  // Dummy observation period data
  const observationPeriods = [
    { observation_period_id: 1, person_id: 1, observation_period_start_date: '2022-01-01', observation_period_end_date: '2022-12-31' },
    { observation_period_id: 2, person_id: 2, observation_period_start_date: '2023-01-01', observation_period_end_date: '2023-06-30' },
    // ...
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Observation Period ID</TableCell>
            <TableCell>Person ID</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {observationPeriods.map((period) => (
            <TableRow key={period.observation_period_id}>
              <TableCell>{period.observation_period_id}</TableCell>
              <TableCell>{period.person_id}</TableCell>
              <TableCell>{period.observation_period_start_date}</TableCell>
              <TableCell>{period.observation_period_end_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ObservationPeriodTable;
