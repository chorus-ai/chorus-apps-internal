import React, { useEffect, useState } from "react";
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
import { useUpdateUser } from "../../hooks";
import type { User as UserType } from "../../types";

interface EditUserProps {
  userData: UserType;
  open: boolean;
  handleClose: () => void;
}

export default function EditUser({
  userData,
  open,
  handleClose,
}: EditUserProps) {
  const { mutate: updateUser } = useUpdateUser();

  const [formData, setFormData] = useState<UserType>(userData);
  const [role, setRole] = useState<string>(
    userData.featureUsers?.[0]?.role ?? "",
  );

  useEffect(() => {
    setFormData(userData);
    setRole(userData.featureUsers?.[0]?.role ?? "");
  }, [userData]);

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    if (name === "role") {
      setRole(value);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();

    updateUser({
      id: formData.id,
      payload: {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        loginType: formData.loginType,
        isBot: formData.isBot,
        role: formData.featureUsers?.[0]?.role,
      },
    });
    
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Update User</DialogTitle>

      <DialogContent>
        <DialogContentText>
          To update a user, modify first name, last name, email, login type, and
          role.
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
              value={formData.firstName ?? ""}
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
              value={formData.lastName ?? ""}
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
              value={formData.email ?? ""}
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
              value={formData.loginType ?? ""}
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
              value={role}
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
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
