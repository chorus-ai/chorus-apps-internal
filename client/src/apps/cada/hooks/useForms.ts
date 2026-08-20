import { useQuery } from '../../../hooks/useApiQuery';
import { useMutation } from '../../../hooks/useApiMutation';
import * as formsApi from '../api/forms';
import type { FormDetail, FormField, EditFormField } from '../types';

export function useForm(formId: number | null) {
  const { data, isLoading, error, refetch } = useQuery<FormDetail>(
    () => formsApi.get(formId!),
    [formId],
    { enabled: !!formId && formId > 0 }
  );

  return { form: data, isLoading, error, refetch };
}

export function useSaveForm() {
  return useMutation(
    async ({
      form,
      editFields,
    }: {
      form: FormDetail;
      editFields: EditFormField[];
    }) => {
      const originalFields = form.formFields;
      const originalIds = new Set(originalFields.map((f) => f.id));
      const editedIds = new Set(
        editFields.filter((f) => f._id).map((f) => f._id!)
      );

      // 1. Delete removed fields
      for (const orig of originalFields) {
        if (!editedIds.has(orig.id)) {
          await formsApi.deleteField(orig.id);
        }
      }

      // 2. Update existing fields and add new ones
      for (let i = 0; i < editFields.length; i++) {
        const field = editFields[i];
        if (field._id && originalIds.has(field._id)) {
          await formsApi.replaceField(field._id, {
            label: field.label,
            type: field.type,
            required: field.required,
            options: field.options,
          });
        } else {
          const triggerData =
            field.triggers
              ?.map((t) => {
                const targetField = editFields.find(
                  (f) => f.label === t.field
                );
                return targetField?._id
                  ? {
                      targetFieldId: targetField._id,
                      condition: t.condition,
                      action: t.action,
                    }
                  : null;
              })
              .filter((t): t is { targetFieldId: number; condition: string; action: string } => t !== null) || [];

          await formsApi.createField({
            formId: form.id,
            label: field.label,
            type: field.type,
            required: field.required,
            order: i + 1,
            options: field.options,
            triggers: triggerData,
          });
        }
      }

      // 3. Update field order
      const updatedForm = await formsApi.get(form.id);
      const updatedFields = updatedForm.formFields;

      if (updatedFields.length > 0) {
        const orderUpdates = updatedFields.map((f: FormField, idx: number) => ({
          id: f.id,
          order: idx + 1,
        }));
        await formsApi.updateFieldOrder(orderUpdates);
      }

      // Return refreshed form
      return formsApi.get(form.id);
    }
  );
}
