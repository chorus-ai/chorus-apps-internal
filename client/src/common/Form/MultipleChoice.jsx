import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import React from 'react'

export default function MultipleChoice({ field, value, setValue, edit }) {
  return (
    <>
      <FormControl>
        <RadioGroup
          row
          value={value || ""}
          onChange={(e) => setValue && setValue(e.target.value)}
          sx={{ display: "flex", flexDirection: "column"}}
        >
          {field.options.map((option, idx) => (
            <FormControlLabel
              key={idx}
              value={option}
              control={<Radio size="small" />}
              label={option}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  )
}
