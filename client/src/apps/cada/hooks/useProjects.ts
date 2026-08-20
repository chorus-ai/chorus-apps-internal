import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { useQuery } from '../../../hooks/useApiQuery';
import { useMutation } from '../../../hooks/useApiMutation';
import * as projectsApi from '../api/projects';
import type { 
  Project, 
  ProjectWithRoles, 
  ProjectUserRole, 
  ProjectCreatePayload 
} from '../types';
import { 
  setProjects, 
  setUserProjects, 
  setUserRoles, 
  setUserProjectRoles, 
  setProjectUsers, 
  showAlert 
} from '../store/slicer';

export function useUserProjects(uid: number) {
  const dispatch = useAppDispatch();
  const userProjects = useAppSelector((state) => state.cada.userProjects);
  const userRoles = useAppSelector((state) => state.cada.userRoles);

  const hasData = Object.keys(userProjects).length > 0;

  const { isLoading, error } = useQuery(
    async () => {
      const data = await projectsApi.getByUser(uid);
      const proj: Record<string, ProjectWithRoles> = {};
      let roles: ProjectUserRole[] = [];
      data.forEach((p) => {
        proj[String(p.id)] = p;
        roles = roles.concat(p.cadaProjectUsers);
      });
      dispatch(setUserProjects(proj));
      dispatch(setUserRoles(roles));
      return proj;
    },
    [uid],
    { enabled: !hasData && uid > 0 },
  );

  if (error) dispatch(showAlert(error.message, "warning"));

  return { userProjects, userRoles, isLoading };
}

export function useProjects() {
  const projects = useAppSelector((state) => state.cada.projects);
  const dispatch = useAppDispatch();

  const { isLoading, error, refetch } = useQuery(
    async () => {
      const data = await projectsApi.getAll();
      dispatch(setProjects(data));
      return data;
    },
    [],
    { enabled: projects.length === 0 },
  );

  if (error) dispatch(showAlert(error.message, "warning"));

  return { projects, isLoading, refetch };
}

export function useProjectUsers(pid: number) {
  const projectUsers = useAppSelector((state) => state.cada.projectUsers);
  const users = projectUsers[String(pid)];
  const dispatch = useAppDispatch();

  const { isLoading, error, refetch } = useQuery(
    async () => {
      const data = await projectsApi.getUsers(pid);
      dispatch(setProjectUsers(String(pid), data));
      return data;
    },
    [pid],
    { enabled: !users && pid > 0 },
  );

  if (error) dispatch(showAlert(error.message, "warning"));

  return { users: users || [], isLoading, refetch };
}

export function useCreateProject() {
  const projects = useAppSelector((state) => state.cada.projects);
  const dispatch = useAppDispatch();

  return useMutation(
    async ({
      payload,
      form,
    }: {
      payload: ProjectCreatePayload;
      form: Array<{
        label: string;
        type: string;
        required: boolean;
        options?: Record<string, string[]> | string[] | null;
      }> | null;
    }) => {
      const newProject = await projectsApi.create(payload, form);
      dispatch(setProjects([...projects, newProject]));
      dispatch(showAlert("New project added!", "success"));
      return newProject;
    },
  );
}

export function useUpdateProject() {
  const projects = useAppSelector((state) => state.cada.projects);
  const dispatch = useAppDispatch();

  return useMutation(
    async ({ id, payload }: { id: number; payload: Partial<Project> }) => {
      const updated = await projectsApi.update(id, payload);
      dispatch(
        setProjects(projects.map((p) => (p.id === updated.id ? updated : p))),
      );
      dispatch(showAlert("Project updated!", "success"));
      return updated;
    },
  );
}

export function useRemoveProject() {
  const projects = useAppSelector((state) => state.cada.projects);
  const dispatch = useAppDispatch();

  return useMutation(async (id: number) => {
    await projectsApi.remove(id);
    dispatch(setProjects(projects.filter((p) => p.id !== id)));
    dispatch(showAlert("Project removed!", "success"));
  });
} 

// get roles/projects for a specific user
export function useUserProjectRoles(userId: number) {
  const dispatch = useAppDispatch();
  const userProjectRoles = useAppSelector(
    (state) => state.cada.userProjectRoles,
  );
  const roles = userProjectRoles[String(userId)] ?? null;

  const { isLoading, error, refetch } = useQuery(
    async () => {
      const data = await projectsApi.getByUser(userId);
      dispatch(setUserProjectRoles({ userId: String(userId), roles: data }));
      return data;
    },
    [userId],
    { enabled: userId > 0 && roles === null },
  );

  if (error) {
    dispatch(
      showAlert({
        message: error.message,
        severity: "warning",
      }),
    );
  }

  return { roles, isLoading, refetch };
}

// add a role to a user in a project
export function useAddProjectUserRole() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.cada.projects);
  const userProjectRoles = useAppSelector(
    (state) => state.cada.userProjectRoles,
  );

  return useMutation(
    async ({
      projectId,
      userId,
      role,
    }: {
      projectId: number;
      userId: number;
      role: string;
    }) => {
      const userRole = await projectsApi.addUserRole(projectId, userId, role);

      const currentRoles =
        (userProjectRoles[String(userId)] as ProjectWithRoles[] | undefined) ??
        [];

      const matchedProject = currentRoles.find(
        (project) => project.id === userRole.cadaProjectId,
      );

      const nextRoles: ProjectWithRoles[] = matchedProject
        ? currentRoles.map((project) =>
            project.id === userRole.cadaProjectId
              ? {
                  ...project,
                  cadaProjectUsers: [...project.cadaProjectUsers, userRole],
                }
              : project,
          )
        : [
            ...currentRoles,
            {
              ...(projects.find(
                (project) => project.id === userRole.cadaProjectId,
              ) as Project),
              cadaProjectUsers: [userRole],
            } as ProjectWithRoles,
          ];

      dispatch(
        setUserProjectRoles({ userId: String(userId), roles: nextRoles }),
      );

      return userRole;
    },
    {
      onError: (err) => {
        dispatch(
          showAlert({
            message: err.message,
            severity: "warning",
          }),
        );
      },
    },
  );
}

// remove a role from a user in a project
export function useRemoveProjectUserRole() {
  const dispatch = useAppDispatch();
  const userProjectRoles = useAppSelector(
    (state) => state.cada.userProjectRoles,
  );

  return useMutation(
    async (payload: ProjectUserRole) => {
      await projectsApi.removeUserRole(
        payload.cadaProjectId,
        payload.userId,
        payload.role,
      );

      const currentRoles =
        (userProjectRoles[String(payload.userId)] as
          | ProjectWithRoles[]
          | undefined) ?? [];

      const nextRoles = currentRoles.map((project) =>
        project.id === payload.cadaProjectId
          ? {
              ...project,
              cadaProjectUsers: project.cadaProjectUsers.filter(
                (user) => user.id !== payload.id,
              ),
            }
          : project,
      );

      dispatch(
        setUserProjectRoles({
          userId: String(payload.userId),
          roles: nextRoles,
        }),
      );

      return payload;
    },
    {
      onError: (err) => {
        dispatch(
          showAlert({
            message: err.message,
            severity: "warning",
          }),
        );
      },
    },
  );
}