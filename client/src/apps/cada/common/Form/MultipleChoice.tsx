import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'

export default function MultipleChoice({ field, value, setValue, ___edit }: { field: any; value: any; setValue: any; ___edit?: any }) {
  return (
    <>
      <FormControl>
        <RadioGroup
          row
          value={value || ""}
          onChange={(e) => setValue && setValue(e.target.value)}
          sx={{ display: "flex", flexDirection: "column"}}
        >
          {field.options.map((option: any, idx: any) => (
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
