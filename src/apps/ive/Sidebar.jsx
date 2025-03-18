import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Divider,
  Drawer,
  List,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@mui/material";

import {
  MdHome,
  MdSearch,
  MdPerson,
  MdSettings
} from "react-icons/md";
import { BsLayoutWtf } from "react-icons/bs";
import { LuGroup } from "react-icons/lu";
import { FaFileWaveform, FaFileImage } from "react-icons/fa6";
import { CiViewTable } from "react-icons/ci";

export default function Navigator(props) {
  const { ...other } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.main.user);

    return (
      <>
     {user && <Drawer variant="temporary" {...other}>
      <List disablePadding>
        <ListItem
          sx={{
            py: 1.3,
            px: 3,
            fontSize: 20,
            color: "#fff",
          }}
        >
          <span>
            <b style={{ color: "#4fc3f7" }}>I</b>
            <b>VE</b>
          </span>
        </ListItem>

        <ListItem component="a" onClick={() => navigate("/ive")}>
          <ListItemButton
            sx={{
              alignItems: "center",
              backgroundColor: "rgba(145, 158, 171, 0.16)",
              borderRadius: 1,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              p: "10px",
              textAlign: "left",
              ...("/ive" === location.pathname && {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
              }),
              color: "rgba(255, 255, 255, 0.5)",
              "&:hover, &:focus": {
                bgcolor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            <ListItemIcon
              component="span"
              sx={{
                alignItems: "center",
                color: "neutral.400",
                display: "inline-flex",
                justifyContent: "center",
                mr: 2,
                ...("/ive" === location.pathname && {color: "primary.main" }),
              }}
            >
              <MdHome />
            </ListItemIcon>
            <ListItemText
              component="span"
              sx={{
                color: "neutral.400",
                flexGrow: 1,
                fontSize: 14,
                fontWeight: 600,
                ...("/ive" === location.pathname && { color: "primary.contrastText" }),
              }}
            >
              {"Dashboard"}
            </ListItemText>
          </ListItemButton>
        </ListItem>

        <Divider sx={{ mt: 1 }} />
        {[
          {
            id: "",
            children: [
              {
                id: "Search",
                href: "/ive/search",
                icon: <MdSearch />,
              },{
                id: "Cohort",
                href: "/ive/cohort",
                icon: <LuGroup />,
              },{
                id: "iViewer",
                href: "/ive/iviewer",
                icon: <BsLayoutWtf style={{padding: 2}} />,
              },
            ],
          },
          {
            id: "Data",
            children: [
              {
                id: "Person",
                href: "/ive/person",
                icon: <CiViewTable />,
              },
              {
                id: "Death",
                href: "/ive/death",
                icon: <CiViewTable />,
              },
              {
                id: "Measurement",
                href: "/ive/measurement",
                icon: <CiViewTable />,
              },
              {
                id: "Observation",
                href: "/ive/observation",
                icon: <CiViewTable />,
              },
              {
                id: "Visit_occurrence",
                href: "/ive/visit_occurrence",
                icon: <CiViewTable />,
              },
              {
                id: "Visit_detail",
                href: "/ive/visit_detail",
                icon: <CiViewTable />,
              },
              {
                id: "Observation_period",
                href: "/ive/observation_period",
                icon: <CiViewTable />,
              },
              {
                id: "Procedure_occurrence",
                href: "/ive/procedure_occurrence",
                icon: <CiViewTable />,
              },
              {
                id: "Condition_occurrence",
                href: "/ive/condition_occurrence",
                icon: <CiViewTable />,
              },
              {
                id: "Device_exposure",
                href: "/ive/device_exposure",
                icon: <CiViewTable />,
              },
              {
                id: "Drug_exposure",
                href: "/ive/drug_exposure",
                icon: <CiViewTable />,
              },
              {
                id: "Note",
                href: "/ive/note",
                icon: <CiViewTable />,
              },
              {
                id: "Note_nlp",
                href: "/ive/note_nlp",
                icon: <CiViewTable />,
              },
              {
                id: "Waveform",
                href: "/ive/waveform",
                icon: <FaFileWaveform />,
              },
              {
                id: "Image",
                href: "/ive/image",
                icon: <FaFileImage />,
              }
            ],
          },{
            id: "Admin",
            children: [
              {
                id: "Users",
                href: "/ive/user",
                icon: <MdPerson />,
              },{
                id: "Settings",
                href: "/ive/settings",
                icon: <MdSettings />,
              },
            ],
          },
        ].map(({ id, children }) => (
          <Box key={id}>
            <ListSubheader sx={{ pt: 2, px: 4 }}>
              {id}
            </ListSubheader>
            {children.map(({ id: childId, href, icon }) => (
              <ListItem
                component="a"
                onClick={() => navigate(href)}
                key={childId}
                sx={{ px: 2, py: 0.1, }}
              >
                <ListItemButton
                  sx={{
                    alignItems: "center",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "flex-start",
                    px: 1,
                    py: 0,
                    textAlign: "left",
                    ...(href === location.pathname && {
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                    }),
                    color: "rgba(255, 255, 255, 0.5)",
                    "&:hover, &:focus": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  <ListItemIcon
                    component="span"
                    sx={{
                      ...(href === location.pathname && {
                        color: "primary.main",
                      }),
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    component="span"
                    sx={{ 
                      ...(href === location.pathname && {
                        color: "primary.contrastText",
                      }),
                    }}
                  >
                     {id==="Data" ? <span style={{fontSize: 12}}>
                      {childId} 
                    </span> :  <span> {childId}</span> }
                    
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}

            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}
      </List>
    </Drawer>}
    </>
    );
}
