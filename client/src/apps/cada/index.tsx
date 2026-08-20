import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { CssBaseline, Typography, Box, Snackbar, Alert } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAppSelector } from "../../hooks/redux";
import ThemeProvider from "./theme";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright ©  CHoRUS Equitable AI "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

const drawerWidth = 200;

function CadaLayoutInner() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const alert = useAppSelector((state) => state.cada.alert);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCloseAlert = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  useEffect(() => {
    document.title = "Hulab-Apps | CADA";
  }, []);

  useEffect(() => {
    setAlertOpen(Boolean(alert));
  }, [alert]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <Box component="nav">
        <Sidebar
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
        />
      </Box>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar onDrawerToggle={handleDrawerToggle} />
        <Box component="main" sx={{ flex: 1 }}>
          {alert && (
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              open={alertOpen}
              autoHideDuration={2000}
              onClose={handleCloseAlert}
            >
              <Alert
                variant="filled"
                severity={
                  alert.severity as "error" | "warning" | "info" | "success"
                }
                onClose={handleCloseAlert}
              >
                {typeof alert.message === "string"
                  ? alert.message
                  : String(alert.message)}
              </Alert>
            </Snackbar>
          )}

          <Outlet />
        </Box>

        <Box component="footer" sx={{ p: 2 }}>
          <Copyright />
        </Box>
      </Box>
    </Box>
  );
}

export default function CadaLayout() {
  return (
    <ThemeProvider>
      <CadaLayoutInner />
    </ThemeProvider>
  );
}
