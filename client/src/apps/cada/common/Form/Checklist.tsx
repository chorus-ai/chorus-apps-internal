import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material'

export default function Checklist({ field, value, setValue }: { field: any; value: any; setValue: any }) {
  return (
    <>
      <FormControl>
        <FormGroup>
          {field.options.map((option: any, idx: any) => (
            <FormControlLabel
              key={idx}
              control={
                <Checkbox
                  size="small"
                  checked={value?.includes(option) || false}
                  onChange={(e) => {
                    if (setValue) {
                      if (e.target.checked) {
                        if (!value) {
                          return setValue([option]);
                        }
                        return setValue([...value, option]);
                      }
                      return setValue(value.filter((v: any) => v !== option));
                    }
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
