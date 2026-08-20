import { Box, createTheme, FormLabel, Grid, IconButton, Paper, Typography } from '@mui/material';
import MultipleChoice from './MultipleChoice';
import Text from './Text';
import Datetime from './Datetime';
import Checklist from './Checklist';
import { IoMdSettings } from "react-icons/io";

const theme = createTheme();

const useStyles = {
  papers: {
    p: 2,
    color: theme.palette.text.secondary,
    display: "flex",
    flexDirection: "column"
  },
};

function formFieldRenderer(field: any) {
  switch (field.type) {
    case 'multiple choice':
      return (
        <MultipleChoice
          field={field}
          edit={true}
        />
      );
    case 'checklist':
      return (
        <Checklist
          field={field}
          edit={true}
        />
      );
    case 'text':
      return (
        <Text
          field={field}
          edit={true}
        />
      );
    case 'datetime':
      return (
        <Datetime
          field={field}
          edit={true}
        />
      );
    default:
      return <></>;
  }
};

export default function FormDisplay({ form }: { form: any }) {

  return (
    <>
      <Grid container spacing={2}>
        {form && form.formFields.map((field: any) => {
          return (
            <Grid key={field.id} size={12}>
              <Paper sx={useStyles.papers}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <FormLabel sx={{ fontSize: "1.1rem" }}>
                    {field.label} {field.required ? "*" : ""}
                  </FormLabel>
                  <IconButton>
                    <IoMdSettings />
                  </IconButton>
                </Box>
                {formFieldRenderer(field)}
                {
                  field.triggers.length > 0 &&
                  <>
                    <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                      Triggers:
                    </Typography>
                    {field.triggers.map((trigger: any, index: any) => (
                      <Box key={index}>
                        <Typography variant="body1" color="textSecondary">
                          When "{form?.formFields?.find((f: any) => f.id === trigger.id)?.label || "not found"}" is "{trigger.formFieldTrigger.condition}", {trigger.formFieldTrigger.action}
                        </Typography>
                      </Box>
                    ))}
                  </>
                }
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
};
