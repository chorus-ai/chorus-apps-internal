import { TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function DateTimeBuilder({ value, onChange }: { value: any; onChange: any }) {
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
