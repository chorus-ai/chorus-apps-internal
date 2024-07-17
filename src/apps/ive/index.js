import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useMediaQuery, useTheme } from '@mui/material';
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// ----------------------------------------------------------------------

const drawerWidth = 250;

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright ©  CHoRUS Equitable AI "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

// ----------------------------------------------------------------------

export default function IVeLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));

  const alert = useSelector((state) =>state.cada.alert);

  const handleDrawerToggle = () => {
    console.log("here", drawerOpen)
    setDrawerOpen(!drawerOpen);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  useEffect(() => {
    alert ? setAlertOpen(true) : setAlertOpen(false);
  }, [alert]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <Box component="nav" 
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
       <Sidebar
          variant={isLarge ? "permanent" : "temporary"}
          sx={{
            bgColor: "blue",
            display: {
              xs: drawerOpen ? "block" : "none",
              sm: drawerOpen ? "block" : "none",
              md: drawerOpen ? "block" : "none",
              lg: "block",
            },
            "& .MuiDrawer-paper": {
              width: `${drawerWidth}px`,
            },
          }}
          open={drawerOpen}
          onClose={handleDrawerToggle}
        />
      </Box>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar drawerWidth={drawerWidth} onDrawerToggle={handleDrawerToggle} />
        <Box component="main" sx={{ flex: 1 }}>
          {alert && (
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            open={alertOpen}
            autoHideDuration={2000}
          >
          <Alert
              variant="filled"
              severity={alert.severity} 
              onClose={handleCloseAlert}
            >
              {alert.message}
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
