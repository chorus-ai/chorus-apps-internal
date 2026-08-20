import { useState } from 'react';
import { Button, Chip, Dialog, Grid, Paper, Typography } from '@mui/material';
import { MdOutlineLibraryAddCheck } from "react-icons/md";
import { useProjectUsers } from '../../../hooks';
import type { Project, ProjectUser, ProjectUserRole } from '../../../types';
import AssignRecordsDialog from '../../User/AssignRecordsDialog';

export default function Users({ project }: { project: Project | null | undefined }) {

  const { users: projectUsersList } = useProjectUsers(project?.id ?? 0);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleAssignRecords = (userId: number) => {
    setSelectedUserId(userId);
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedUserId(null);
  };

  return (
    <>
      <Dialog
        open={assignDialogOpen}
        onClose={handleCloseAssignDialog}
        maxWidth="lg"
      >
        {selectedUserId && (
          <AssignRecordsDialog
            userId={selectedUserId}
            projectId={project.id}
            handleClose={handleCloseAssignDialog}
          />
        )}
      </Dialog>

      {projectUsersList?.map((user: ProjectUser) => (
        <Paper
          key={user.id}
          sx={{
            p: 2,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center" flexDirection="row">
            <Grid alignItems="center" size={4}>
              <Typography variant="h6">
                {user.firstName} {user.lastName}
              </Typography>
            </Grid>
            <Grid alignItems="center" size={4}>
              {user.cadaProjectUsers.map((pu: ProjectUserRole) => (
                <Chip
                  key={pu.id}
                  label={pu.role}
                  size="small"
                  color={pu.role === 'annotator' ? 'primary' : 'secondary'}
                  sx={{ mr: 0.5 }}
                />
              ))}
            </Grid>
            <Grid size={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<MdOutlineLibraryAddCheck />}
                onClick={() => handleAssignRecords(user.id)}
              >
                Assign Records
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </>
  );
};
