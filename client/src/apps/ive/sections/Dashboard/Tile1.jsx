
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Label from '../../../cada/common/Label';
// import React, { Component } from 'react';
// import { LayoutButton } from 'react-viewerbase';

// class Example extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       selectedCell: {
//         className: 'hover',
//         col: 1,
//         row: 1,
//       },
//     };
//   }

//   render() {
//     return (
//       <LayoutButton
//         selectedCell={this.state.selectedCell}
//         onChange={cell => this.setState({ selectedCell: cell })}
//       />
//     );
//   }
// }


export default function BasicCard() {
  return (
    <Card sx={{ height: "100%", width: "100%" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          NLP Concepts
           {' '}
      <Chip label="24" size="small" />
        </Typography>
        {[
      {
        "event_id": 196,
        "concept_id": 2,
        "concept_index": 6,
        "trigger_word": "atrial fibrillation",
        "concept": "Atrial Fibrillation"
      },
      {
        "event_id": 196,
        "concept_id": 3,
        "concept_index": 7,
        "trigger_word": "CHF",
        "concept": "Congestive heart failure"
      },
      {
        "event_id": 196,
        "concept_id": 7,
        "concept_index": 38,
        "trigger_word": "Cardiac arrest",
        "concept": "Cardiac Arrest"
      },
      {
        "event_id": 196,
        "concept_id": 8,
        "concept_index": 4,
        "trigger_word": "mitral valve prolapse",
        "concept": "Mitral Valve Prolapse Syndrome"
      },
      {
        "event_id": 196,
        "concept_id": 10,
        "concept_index": 33,
        "trigger_word": "pneumothorax",
        "concept": "Pneumothorax"
      },
      {
        "event_id": 196,
        "concept_id": 11,
        "concept_index": 2,
        "trigger_word": "cardiomyopathy",
        "concept": "Cardiomyopathies"
      },
      {
        "event_id": 196,
        "concept_id": 12,
        "concept_index": 10,
        "trigger_word": "palpitations",
        "concept": "Intermittent palpitations"
      },
      {
        "event_id": 196,
        "concept_id": 14,
        "concept_index": 13,
        "trigger_word": "lightheadedness",
        "concept": "Dizziness"
      },
      {
        "event_id": 196,
        "concept_id": 15,
        "concept_index": 14,
        "trigger_word": "lightheadedness",
        "concept": "Lightheadedness"
      },
      {
        "event_id": 196,
        "concept_id": 16,
        "concept_index": 16,
        "trigger_word": "pneumonia",
        "concept": "Pneumonia"
      },
      {
        "event_id": 196,
        "concept_id": 17,
        "concept_index": 12,
        "trigger_word": "chest pain",
        "concept": "Chest Pain"
      },
      {
        "event_id": 196,
        "concept_id": 18,
        "concept_index": 42,
        "trigger_word": "Hyponatremia",
        "concept": "Hyponatremia"
      },
      {
        "event_id": 196,
        "concept_id": 20,
        "concept_index": 15,
        "trigger_word": "symptoms",
        "concept": "Symptoms"
      },
      {
        "event_id": 196,
        "concept_id": 23,
        "concept_index": 22,
        "trigger_word": "dyspnea on exertion",
        "concept": "Dyspnea on exertion"
      },
      {
        "event_id": 196,
        "concept_id": 24,
        "concept_index": 21,
        "trigger_word": "dysuria",
        "concept": "Dysuria"
      },
      {
        "event_id": 196,
        "concept_id": 26,
        "concept_index": 24,
        "trigger_word": "presyncope",
        "concept": "Presyncope"
      },
      {
        "event_id": 196,
        "concept_id": 27,
        "concept_index": 29,
        "trigger_word": "scoliosis",
        "concept": "Scoliosis, unspecified"
      },
      {
        "event_id": 196,
        "concept_id": 28,
        "concept_index": 23,
        "trigger_word": "syncope",
        "concept": "Syncope"
      },
      {
        "event_id": 196,
        "concept_id": 29,
        "concept_index": 30,
        "trigger_word": "wheezes",
        "concept": "Wheezing"
      },
      {
        "event_id": 196,
        "concept_id": 30,
        "concept_index": 36,
        "trigger_word": "rapid",
        "concept": "rapid ventricular response"
      },
      {
        "event_id": 196,
        "concept_id": 31,
        "concept_index": 35,
        "trigger_word": "rapid ventricular response",
        "concept": "Atrial fibrillation with rapid ventricular response"
      },
      {
        "event_id": 196,
        "concept_id": 32,
        "concept_index": 18,
        "trigger_word": "fevers/chills",
        "concept": "Fever with chills"
      },
      {
        "event_id": 196,
        "concept_id": 33,
        "concept_index": 37,
        "trigger_word": "disease of the aortic",
        "concept": "Aortic Diseases"
      },
      {
        "event_id": 196,
        "concept_id": 39,
        "concept_index": 49,
        "trigger_word": "cardiac arrest",
        "concept": "VENTRICULAR Fibrillation cardiac ARREST"
      },
      {
        "event_id": 196,
        "concept_id": 42,
        "concept_index": 41,
        "trigger_word": "myalgias",
        "concept": "Myalgia"
      },
      {
        "event_id": 196,
        "concept_id": 43,
        "concept_index": 43,
        "trigger_word": "hyponatremic",
        "concept": "hyponatremic"
      },
      {
        "event_id": 196,
        "concept_id": 47,
        "concept_index": 20,
        "trigger_word": "postnasal drip",
        "concept": "Posterior rhinorrhea"
      },
      {
        "event_id": 196,
        "concept_id": 49,
        "concept_index": 48,
        "trigger_word": "pain",
        "concept": "Pain"
      },
      {
        "event_id": 196,
        "concept_id": 50,
        "concept_index": 46,
        "trigger_word": "intertrigo",
        "concept": "Intertrigo"
      }
    ].map((concept) => {
      return <Label sx={{m:0.7}} color={[
        "default",
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
      ][Math.floor(Math.random() * 7)]} variant="soft">{concept.concept}</Label>
    })}
        <Stack sx={{ width: '100%', color: 'grey.500' , flexGrow:1}} spacing={2}>
        
              {/* <LinearProgress color="success" /> */}
            </Stack>
      </CardContent>
    </Card>
  );
}