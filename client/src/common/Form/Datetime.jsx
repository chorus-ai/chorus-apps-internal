import React from 'react';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

export default function Datetime({ field, value, setValue }) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          value={value ? (typeof value === "string" ? new Date(value) : value) : new Date()}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          inputFormat="yyyy-MM-dd HH:mm"
          sx={{ mt: 1 }}
        />
      </LocalizationProvider>
    </>
  )
}
