import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const VisitDetailTable = () => {
    const visitDetails = [
        {
          visit_detail_id: 1,
          person_id: 123,
          visit_occurrence_id: 456,
          visit_detail_concept_id: 'Inpatient',
          visit_detail_start_date: '2023-06-01',
          visit_detail_end_date: '2023-06-05',
          visit_detail_type_concept_id: 'Admission',
          provider_id: 789,
          care_site_id: 987,
          visit_source_value: 'Hospital A',
        },
        {
          visit_detail_id: 2,
          person_id: 456,
          visit_occurrence_id: 789,
          visit_detail_concept_id: 'Outpatient',
          visit_detail_start_date: '2023-06-02',
          visit_detail_end_date: '2023-06-02',
          visit_detail_type_concept_id: 'Consultation',
          provider_id: 654,
          care_site_id: 321,
          visit_source_value: 'Clinic B',
        },
      ];

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Visit Detail ID</TableCell>
          <TableCell>Person ID</TableCell>
          <TableCell>Visit Occurrence ID</TableCell>
          <TableCell>Visit Detail Concept ID</TableCell>
          <TableCell>Start Date</TableCell>
          <TableCell>End Date</TableCell>
          <TableCell>Visit Detail Type Concept ID</TableCell>
          <TableCell>Provider ID</TableCell>
          <TableCell>Care Site ID</TableCell>
          <TableCell>Visit Source Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {visitDetails.map((detail) => (
          <TableRow key={detail.visit_detail_id}>
            <TableCell>{detail.visit_detail_id}</TableCell>
            <TableCell>{detail.person_id}</TableCell>
            <TableCell>{detail.visit_occurrence_id}</TableCell>
            <TableCell>{detail.visit_detail_concept_id}</TableCell>
            <TableCell>{detail.visit_detail_start_date}</TableCell>
            <TableCell>{detail.visit_detail_end_date}</TableCell>
            <TableCell>{detail.visit_detail_type_concept_id}</TableCell>
            <TableCell>{detail.provider_id}</TableCell>
            <TableCell>{detail.care_site_id}</TableCell>
            <TableCell>{detail.visit_source_value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VisitDetailTable;
