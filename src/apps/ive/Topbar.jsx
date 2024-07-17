import React from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Avatar as MuiAvatar,
  IconButton,
  Link,
  Toolbar,
  Tooltip,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdMenu as MenuIcon } from "react-icons/md";
import { MdNotifications as NotificationsIcon } from "react-icons/md";
import { MdApps as AppsIcon } from "react-icons/md";

import Avatar, { genConfig } from "react-nice-avatar";

export default function Topbar(props) {
  const {drawerWidth, onDrawerToggle } = props;
  const navigate = useNavigate();
  const user = useSelector((state) => state.main.user);

  if (user) {
    const isAdmin = Object.values(user.featureUsers).some(
      (featureUser) =>
        featureUser.app === "ive" && featureUser.role === "admin"
    );
    return (
      <AppBar  
      position="sticky"
        elevation={0}
        color="transparent"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` }
        }}
      >
        <Toolbar >
          {isAdmin ? (
            <IconButton 
              sx={{ mr: 2, display: { lg: "none" } }}
              color="inherit" 
              onClick={onDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton  
              sx={{ mr: 2, display: { lg: "none" } }}
              color="inherit" 
              onClick={() => navigate("/ive")}
            >
              <AppsIcon />
            </IconButton>
          )}
          <div style={{ flex: "1 1 auto" }} />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Link
              href="/docs"
              variant="body2"
              style={{
                textDecoration: "none",
                color: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  color: "common.white",
                },
              }}
              rel="noopener noreferrer"
              target="_blank"
            >
              APIs
            </Link>
            <Tooltip title="Notifications • 0">
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={user.firstName + " " + user.lastName}>
              {user.avatar ? (
                <MuiAvatar key={user.id}>
                  <Avatar
                    style={{ width: "29px", height: "29px" }}
                    {...genConfig(JSON.parse(user.avatar))}
                  />
                </MuiAvatar>
              ) : (
                <MuiAvatar sx={{ bgcolor: "secondary.main" }}>
                  {user.firstName.charAt(0).toUpperCase() +
                    user.lastName.charAt(0).toUpperCase()}
                </MuiAvatar>
              )}
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
    );
  } else return null;
}

Topbar.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};
