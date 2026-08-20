import React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import {
  Grid,
  Button,
  TextField,
  MenuItem,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();

const useStyles = {
  layout: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(500 + theme.spacing(4) * 2)]: {
      width: 500,
      marginLeft: "auto",
      marginRight: "auto",
    },
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up(500 + theme.spacing(3) * 2)]: {
      padding: theme.spacing(2),
    },
  },
};

function AddProjectUserForm({ ____userId, projects, handleClose, ___addProjectUser }) {
  const [values, setValues] = React.useState({});

  const handleFormChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  console.log("values: ", values);
  console.log("projects: ", projects);

  return (
    <React.Fragment>
      <CssBaseline />
      <main style={{ ...useStyles.layout }}>
        <DialogTitle id="form-dialog-title">New Project User</DialogTitle>
        <DialogContent style={{ ...useStyles.content }}>
          <DialogContentText>To add new project user role</DialogContentText>

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
                {projects.map((option: any) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
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
                {["annotator", "adjudicator"].map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </main>
    </React.Fragment>
  );
}

export default AddProjectUserForm;
