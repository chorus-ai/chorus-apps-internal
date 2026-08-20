import { apiFetch } from '../../../hooks/useApiFetch';
import type {
  Project,
  ProjectCreatePayload,
  ProjectUpdatePayload,
  ProjectUserRole,
  ProjectUser,
  ProjectWithRoles,
} from '../types';

export async function getAll(): Promise<Project[]> {
  return apiFetch<Project[]>('/api/cada/project');
}

export async function getByUser(uid: number): Promise<ProjectWithRoles[]> {
  return apiFetch<ProjectWithRoles[]>(`/api/cada/project/users/${uid}`);
}

export async function create(
  payload: ProjectCreatePayload,
  form: Array<{ label: string; type: string; required: boolean; options?: Record<string, string[]> | string[] | null }> | null
): Promise<Project> {
  const newProject = await apiFetch<Project>('/api/cada/project', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (form) {
    const newForm = await apiFetch<{ id: number }>('/api/form/form/json', {
      method: 'POST',
      body: JSON.stringify({ form: { title: newProject.name, fields: form } }),
    });

    await apiFetch<void>(`/api/cada/project/form/${newProject.id}/${newForm.id}`, {
      method: 'POST',
    });
  }

  return newProject;
}

export async function update(
  id: number,
  payload: ProjectUpdatePayload
): Promise<Project> {
  return apiFetch<Project>(`/api/cada/project/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function remove(id: number): Promise<void> {
  await apiFetch<void>(`/api/cada/project/${id}`, {
    method: 'DELETE',
  });
}

export async function getUsers(pid: number): Promise<ProjectUser[]> {
  return apiFetch<ProjectUser[]>(`/api/cada/project/${pid}/users`);
}

export async function addUserRole(
  projectId: number,
  userId: number,
  role: string
): Promise<ProjectUserRole> {
  return apiFetch<ProjectUserRole>(
    `/api/cada/project/${projectId}/users/${userId}?role=${role}`,
    { method: 'POST' }
  );
}

export async function removeUserRole(
  projectId: number,
  userId: number,
  role: string
): Promise<ProjectUserRole> {
  return apiFetch<ProjectUserRole>(
    `/api/cada/project/${projectId}/users/${userId}?role=${role}`,
    { method: 'DELETE' }
  );
}
