import { TextField } from '@mui/material'
import React from 'react'

export default function Text({ field, value, setValue }) {
  return (
    <>
      <TextField
        // multiline
        // minRows={2}
        // maxRows={6}
        fullWidth
        variant='outlined'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{ mt: 1 }}
      />
    </>
  )
}
