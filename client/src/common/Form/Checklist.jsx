import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material'
import React from 'react'

export default function Checklist({ field, value, setValue }) {
  return (
    <>
      <FormControl>
        <FormGroup>
          {field.options.map((option, idx) => (
            <FormControlLabel
              key={idx}
              control={
                <Checkbox
                  size="small"
                  checked={value?.includes(option) || false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      if (!value) {
                        return setValue([option]);
                      }
                      return setValue([...value, option]);
                    }
                    return setValue(value.filter((v) => v !== option));
                  }}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
      </FormControl>
    </>
  )
}
