import React, { useState } from "react";
import {
  Grid,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { useAddUser } from "../../hooks";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  loginType: string;
  role: string;
  isBot: boolean;
  username?: string;
}

interface NewUserProps {
  userData?: UserFormData;
  open: boolean;
  handleClose: () => void;
}

export default function NewUser({ userData, open, handleClose }: NewUserProps) {
  const addUserMutation = useAddUser();

  const [formData, setFormData] = useState<UserFormData>(
    userData ?? {
      firstName: "",
      lastName: "",
      email: "",
      loginType: "",
      role: "",
      isBot: false,
      username: "",
    },
  );

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    await addUserMutation.mutate({
      username: formData.username || formData.email,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      loginType: formData.loginType,
      isBot: formData.isBot,
      role: formData.role,
    });

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>New User</DialogTitle>

      <DialogContent>
        <DialogContentText>
          To add a new user, please enter first name, last name, email, login
          type, and role.
        </DialogContentText>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              margin="dense"
              name="firstName"
              onChange={handleFormChange}
              required
              value={formData.firstName}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              margin="dense"
              name="lastName"
              onChange={handleFormChange}
              required
              value={formData.lastName}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              required
              label="Email"
              margin="dense"
              name="email"
              onChange={handleFormChange}
              value={formData.email}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              label="Login Type"
              margin="dense"
              name="loginType"
              onChange={handleFormChange}
              required
              value={formData.loginType}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            >
              {["local", "github", "google"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {formData.loginType === "github" && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Git Handle"
                margin="dense"
                name="username"
                onChange={handleFormChange}
                required
                value={formData.username ?? ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              name="role"
              label="Role"
              value={formData.role}
              onChange={handleFormChange}
              variant="outlined"
              margin="dense"
              required
              InputLabelProps={{ shrink: true }}
            >
              {["admin", "user"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
