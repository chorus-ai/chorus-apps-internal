import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material';
import { MdEdit, MdSave, MdCancel } from 'react-icons/md';
import FormDisplay from '../../../common/Form/FormDisplay';
import CreateForm from '../../../common/Form/CreateForm';
import { useAppSelector } from '../../../../../hooks/redux';
import { useForm, useSaveForm } from '../../../hooks';
import type { Project, EditFormField, FormField, FormFieldTrigger } from '../../../types';

const NoForm = () => {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="body1" color="text.secondary">
        No form associated with this project.
      </Typography>
    </Box>
  )
}

export default function Form({ project }: { project: Project | null | undefined }) {

  const formId = project?.forms?.[0]?.id ?? null;
  const { form, refetch: refetchForm } = useForm(formId);

  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState<EditFormField[]>([]);

  const saveForm = useSaveForm();

  const currentUser = useAppSelector((state) => state.main.user);
  const isAdmin = currentUser?.featureUsers &&
    Object.values(currentUser.featureUsers).some((f) => (f as { role: string }).role === "admin");

  const handleStartEdit = () => {
    if (!form?.formFields) return;
    // Convert form fields to the format CreateForm expects
    const fields: EditFormField[] = form.formFields
      .sort((a: FormField, b: FormField) => a.order - b.order)
      .map((field: FormField) => ({
        _id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options || null,
        triggers: field.triggers?.map((t: FormFieldTrigger) => ({
          field: form.formFields.find((f: FormField) => f.id === t.id)?.label || '',
          condition: t.formFieldTrigger?.condition || '',
          action: t.formFieldTrigger?.action || 'show',
        })) || [],
      }));
    setEditFields(fields);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditFields([]);
  };

  const handleSave = async () => {
    if (!form) return;

    try {
      await saveForm.mutate({ form, editFields });
      refetchForm();
      setEditing(false);
      setEditFields([]);
    } catch (err) {
      console.error("Failed to save form:", err);
    }
  };

  return (
    <div>
      {isAdmin && form && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
          {editing ? (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<MdCancel />}
                onClick={handleCancelEdit}
                disabled={saveForm.isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<MdSave />}
                onClick={handleSave}
                disabled={saveForm.isLoading}
              >
                {saveForm.isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              startIcon={<MdEdit />}
              onClick={handleStartEdit}
            >
              Edit Form
            </Button>
          )}
        </Box>
      )}

      {form ? (
        editing ? (
          <CreateForm form={editFields} setForm={setEditFields} />
        ) : (
          <FormDisplay form={form} />
        )
      ) : (
        <NoForm />
      )}
    </div>
  )
}
