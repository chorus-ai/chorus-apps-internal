import { TextField } from '@mui/material';
import React from 'react'

export default function TextFieldBuilder({ value, onChange }) {
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
      />
    </>
  );
};
