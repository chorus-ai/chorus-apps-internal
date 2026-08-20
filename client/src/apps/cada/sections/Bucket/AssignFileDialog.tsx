import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material'
import { createTheme } from "@mui/material/styles";
import { useProjects } from '../../hooks';

const theme = createTheme();

const useStyles = {
  root: {
    minWidth: 600,
    padding: theme.spacing(2),
  },
  paper: {
    width: "100%",
  },
};

interface AssignDialogProps {
  fileType: string;
  setFileType: (val: string) => void;
  fileInfo: string;
  setFileInfo: (val: string) => void;
  project: number;
  setProject: (val: number) => void;
  handleAssign: () => void;
  handleClose: () => void;
}

export default function AssignDialog({
  fileType,
  setFileType,
  fileInfo,
  setFileInfo,
  project,
  setProject,
  handleAssign,
  handleClose
}: AssignDialogProps) {
  const { projects } = useProjects();

  return (
    <div style={{ ...useStyles.root }}>
      <Paper sx={{ ...useStyles.paper }}>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Type"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Info"
              value={fileInfo}
              onChange={(e) => setFileInfo(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={project}
                label="Project"
                onChange={(e) => setProject(e.target.value)}
              >
                {projects.map((proj) => (
                  <MenuItem value={proj.id} key={proj.id}>{proj.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="error" sx={{ mr: 2 }} onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleAssign}>
            Assign
          </Button>
        </Box>
      </Paper>
    </div>
  )
}
