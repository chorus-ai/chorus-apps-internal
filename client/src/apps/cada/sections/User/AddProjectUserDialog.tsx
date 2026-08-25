import React, { useState } from "react";
import {
  CssBaseline,
  Grid,
  Button,
  TextField,
  MenuItem,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { useProjects } from "../../hooks";
import { useAppDispatch } from "../../../../hooks/redux";
import { setUserProjectRoles } from "../../store";
import * as projectsApi from "../../api/projects";
import type { Project, ProjectWithRoles, ProjectUserRole } from "../../types";

interface AddProjectUserFormProps {
  userId: number;
  userProjectRoles: ProjectWithRoles[];
  handleClose: () => void;
}

interface FormValues {
  cadaProjectId?: number | string;
  role?: string;
}

export default function AddProjectUserForm({
  userId,
  userProjectRoles,
  handleClose,
}: AddProjectUserFormProps) {
  const [values, setValues] = useState<FormValues>({});
  const { projects } = useProjects();
  const dispatch = useAppDispatch();

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.cadaProjectId || !values.role) return;

    const projectId = Number(values.cadaProjectId);

    const userRole = await projectsApi.addUserRole(
      projectId,
      userId,
      values.role
    );

    if (userRole) {
      let userProjects: ProjectWithRoles[];

      const matchedProject = userProjectRoles.find(
        (p: ProjectWithRoles) => Number(p.id) === Number(userRole.cadaProjectId)
      );

      if (matchedProject) {
        userProjects = userProjectRoles.map((p: ProjectWithRoles) =>
          Number(p.id) === Number(userRole.cadaProjectId)
            ? {
                ...p,
                cadaProjectUsers: [...p.cadaProjectUsers, userRole],
              }
            : p
        );
      } else {
        const baseProject = projects.find(
          (p: Project) => Number(p.id) === Number(userRole.cadaProjectId)
        );

        if (!baseProject) return;

        userProjects = [
          ...userProjectRoles,
          {
            ...baseProject,
            cadaProjectUsers: [userRole],
          } as ProjectWithRoles,
        ];
      }

      dispatch(
        setUserProjectRoles({
          userId: String(userId),
          roles: userProjects,
        })
      );

      handleClose();
    }
  };

  return (
    <>
      <CssBaseline />
      <DialogTitle id="form-dialog-title">Add Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add new project user role, please provide project name and role.{" "}
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <TextField
              select
              fullWidth
              label="Project"
              margin="dense"
              name="cadaProjectId"
              onChange={handleFormChange}
              required
              value={values.cadaProjectId ? values.cadaProjectId : ""}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            >
              {projects.map((project: Project) => {
                const existing = userProjectRoles.find(
                  (u: ProjectWithRoles) => Number(u.id) === Number(project.id)
                );
                return (
                  <MenuItem
                    disabled={!!(existing && existing.cadaProjectUsers.length >= 2)}
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <TextField
              select
              fullWidth
              label="Role"
              margin="dense"
              name="role"
              onChange={handleFormChange}
              required
              value={values.role ? values.role : ""}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            >
              {["annotator", "adjudicator"].map((role) => {
                const existingProject = values.cadaProjectId
                  ? userProjectRoles.find(
                      (u: ProjectWithRoles) =>
                        Number(u.id) === Number(values.cadaProjectId)
                    )
                  : undefined;

                const roleExists = existingProject?.cadaProjectUsers.find(
                  (x: ProjectUserRole) => x.role === role
                );

                return (
                  <MenuItem
                    disabled={!!roleExists}
                    key={role}
                    value={role}
                  >
                    {role}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!(values.cadaProjectId && values.role)}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
}
