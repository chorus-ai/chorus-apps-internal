import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';


export default function BasicCard() {


  // Sample OMOP person profile data
  const omopPerson = {
    personId: 56646,
    name: "Person 56646",
    gender: "Female",
    birthDate: "1985-05-12",
    race: "White",
    ethnicity: "Non-Hispanic",
  };

  return (
    <Card sx={{ height: "100%", width: "100%" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Person
        </Typography>

          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Person ID:</strong> {omopPerson.personId}
            </Typography>
            <Typography variant="body2">
              <strong>Gender:</strong> {omopPerson.gender}
            </Typography>
            <Typography variant="body2">
              <strong>Birth Date:</strong> {omopPerson.birthDate}
            </Typography>
            <Typography variant="body2">
              <strong>Race:</strong> {omopPerson.race}
            </Typography>
            <Typography variant="body2">
              <strong>Ethnicity:</strong> {omopPerson.ethnicity}
            </Typography>
          </Stack>
      </CardContent>
    </Card>
  );
}
