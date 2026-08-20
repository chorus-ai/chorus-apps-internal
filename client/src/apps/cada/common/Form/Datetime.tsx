import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

export default function Datetime({ ____field, value, setValue }: { ____field?: any; value: any; setValue: any }) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          disabled={setValue ? false : true}
          value={setValue ? (value ? (typeof value === "string" ? new Date(value) : value) : new Date()) : null}
          onChange={(newValue) => setValue && setValue(newValue)}
          inputFormat="yyyy-MM-dd HH:mm"
          sx={{ mt: 1 }}
        />
      </LocalizationProvider>
    </>
  )
}
