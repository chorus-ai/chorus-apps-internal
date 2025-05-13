import { TextField } from '@mui/material';
import React from 'react';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

export default function DateTimeBuilder({ value, onChange }) {
  return (
    <>
      <TextField
        fullWidth
        label="Label"
        margin="dense"
        name="label"
        onChange={onChange}
        required
        value={value}
        variant="standard"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker />
      </LocalizationProvider>
    </>
  );
};
