import { apiFetch } from '../../../hooks/useApiFetch';
import type { FormDetail, FormField, FormFieldCreatePayload, FormFieldReplacePayload } from '../types';

export async function get(formId: number): Promise<FormDetail> {
  return apiFetch<FormDetail>(`/api/form/form/${formId}`);
}

export async function deleteField(fieldId: number): Promise<void> {
  await apiFetch<void>(`/api/form/field/${fieldId}`, { method: 'DELETE' });
}

export async function replaceField(
  fieldId: number,
  content: FormFieldReplacePayload
): Promise<FormField> {
  return apiFetch<FormField>(`/api/form/field/replace/${fieldId}`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function createField(
  payload: FormFieldCreatePayload
): Promise<FormField> {
  return apiFetch<FormField>('/api/form/field', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateFieldOrder(
  contents: Array<{ id: number; order: number }>
): Promise<void> {
  await apiFetch<void>('/api/form/field/order', {
    method: 'PUT',
    body: JSON.stringify({ contents }),
  });
}
