import { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import FormBuilder from '../../../common/Form/FormBuilder';
import { useForm } from '../../../hooks';
import type { Project, FormSummary, FormValues } from '../../../types';

export default function Preview({ project }: { project: Project | null | undefined }) {
  const formId = project?.forms?.length > 0
    ? project.forms.sort((a: FormSummary, b: FormSummary) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      )[0].id
    : null;

  const { form } = useForm(formId);
  const [values, setValues] = useState<FormValues>({});

  if (!form) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No form associated with this project.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          This is a preview of the annotation form as seen by annotators. Changes here are not saved.
        </Typography>
      </Paper>
      <FormBuilder
        form={form}
        values={values}
        setValues={setValues}
      />
    </Box>
  );
}
