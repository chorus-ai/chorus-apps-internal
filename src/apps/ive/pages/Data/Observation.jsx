import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const ObservationTable = () => {


const observations = [
  {
    observation_id: 1,
    person_id: 123,
    observation_concept_id: 'Blood Pressure',
    observation_date: '2023-06-01',
    observation_value: '120/80',
    observation_type_concept_id: 'Clinical Observation',
    observation_source_concept_id: 'N/A',
    unit_concept_id: 'mmHg',
    observation_source_value: 'Device A',
  },
  {
    observation_id: 2,
    person_id: 456,
    observation_concept_id: 'Heart Rate',
    observation_date: '2023-06-02',
    observation_value: '75',
    observation_type_concept_id: 'Clinical Observation',
    observation_source_concept_id: 'N/A',
    unit_concept_id: 'bpm',
    observation_source_value: 'Device B',
  },
];

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Observation ID</TableCell>
          <TableCell>Person ID</TableCell>
          <TableCell>Observation Concept ID</TableCell>
          <TableCell>Observation Date</TableCell>
          <TableCell>Observation Value</TableCell>
          <TableCell>Observation Type Concept ID</TableCell>
          <TableCell>Observation Source Concept ID</TableCell>
          <TableCell>Unit Concept ID</TableCell>
          <TableCell>Observation Source Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {observations.map((observation) => (
          <TableRow key={observation.observation_id}>
            <TableCell>{observation.observation_id}</TableCell>
            <TableCell>{observation.person_id}</TableCell>
            <TableCell>{observation.observation_concept_id}</TableCell>
            <TableCell>{observation.observation_date}</TableCell>
            <TableCell>{observation.observation_value}</TableCell>
            <TableCell>{observation.observation_type_concept_id}</TableCell>
            <TableCell>{observation.observation_source_concept_id}</TableCell>
            <TableCell>{observation.unit_concept_id}</TableCell>
            <TableCell>{observation.observation_source_value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ObservationTable;
