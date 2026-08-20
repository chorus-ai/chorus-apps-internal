import { TextField } from '@mui/material';

export default function TextFieldBuilder({ value, onChange }: { value: any; onChange: any }) {
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
