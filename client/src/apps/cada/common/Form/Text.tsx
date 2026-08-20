import { TextField } from '@mui/material'

export default function Text({ ____field, value, setValue }: { ____field?: any; value: any; setValue: any }) {
  return (
    <>
      <TextField
        // multiline
        // minRows={2}
        // maxRows={6}
        fullWidth
        variant='outlined'
        value={value || ""}
        onChange={(e) => setValue && setValue(e.target.value)}
        sx={{ mt: 1 }}
      />
    </>
  )
}
