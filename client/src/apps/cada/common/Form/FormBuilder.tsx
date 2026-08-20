import { createTheme, FormLabel, Grid, Paper } from '@mui/material';
import MultipleChoice from './MultipleChoice';
import Text from './Text';
import Datetime from './Datetime';
import Checklist from './Checklist';

const theme = createTheme();

const useStyles = {
  papers: {
    p: 2,
    color: theme.palette.text.secondary,
    display: "flex",
    flexDirection: "column"
  },
};

function formFieldRenderer(field: any, value: any, setValue: any) {
  switch (field.type) {
    case 'multiple choice':
      return (
        <MultipleChoice
          field={field}
          value={value}
          setValue={setValue}
        />
      );
    case 'checklist':
      return (
        <Checklist
          field={field}
          value={value}
          setValue={setValue}
        />
      );
    case 'text':
      return (
        <Text
          field={field}
          value={value}
          setValue={setValue}
        />
      );
    case 'datetime':
      return (
        <Datetime
          field={field}
          value={value}
          setValue={setValue}
        />
      );
    default:
      return <></>;
  }
};

export default function FormBuilder({ form, values, setValues }: { form: any; values: any; setValues: any }) {

  return (
    <>
      <Grid container spacing={2}>
        {form && form.formFields.map((field: any) => {
          if (field.triggers.length > 0) {
            for (const trigger of field.triggers) {
              if (values?.[trigger.id] !== trigger.formFieldTrigger.condition) {
                return null;
              }
            }
          }

          return (
            <Grid key={field.id} size={12}>
              <Paper sx={useStyles.papers}>
                <FormLabel sx={{ fontSize: "1.1rem", mb: 1 }}>
                  {field.label} {field.required ? "*" : ""}
                </FormLabel>
                {formFieldRenderer(field, values[field.id], (newValue: any) => setValues({ ...values, [field.id]: newValue }))}
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
};
