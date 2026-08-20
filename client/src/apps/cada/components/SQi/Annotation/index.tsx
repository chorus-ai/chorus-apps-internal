import React from "react";
import { useEffect } from "react";
import {
  AppBar,
  Typography,
  Grid,
  Button,
  IconButton,
  Toolbar,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Panel from "./Panel";
import useDidMountEffect from "../../../../../hooks/useDidMountEffect";

import { Download } from "../../../common/Download";

import { getAnnotationEvents } from "../../../store/thunk";
import { createTheme } from "@mui/material/styles";
import { useAppSelector, useAppDispatch } from "../../../../../hooks/redux";

const theme = createTheme();

function Annotation() {
  const params = useParams();
  const [_value, setValue] = React.useState(0);
  const [_isLoading, setIsLoading] = React.useState(false);
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.main.user);
  const events = useAppSelector((state) =>
    state.cada.ann_events[parseInt(params.pid, 10)]
      ? state.cada.ann_events[parseInt(params.pid, 10)]
      : null
  );
  const project = useAppSelector((state) => state.cada.userProjects[params.pid]);

  const ____handleChange = (_event: any, newValue: any) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log("useEffect: ");
    if (!events) {
      dispatch(getAnnotationEvents(params.pid, user.id));
      setIsLoading(true);
    } else {
    }
  }, [params]);

  useDidMountEffect(() => {
    console.log("useDidMountEffect:    ");
    setIsLoading(false);
  }, [events]);

  console.log("events:", events);

  if (project && events && Object.keys(events).length > 0) {
    return (
      <>
        <AppBar
          component="div"
          sx={{ px: theme.spacing(1) }}
          position="static"
          elevation={0}
        >
          <Toolbar>
            <Typography color="inherit" variant="h6" component="h1">
              {project.name} Annotation
            </Typography>
            <div style={{ flex: "1 1 auto" }} />
            <Download
              data={events['true']
                .filter(
                  (e: any) => e.cadaAnnotations[0].cadaAnnotationValues.length > 0
                )
                .map((e: any) => {
                  let latestElement =
                    e.cadaAnnotations[0].cadaAnnotationValues.length > 0
                      ? e.cadaAnnotations[0].cadaAnnotationValues.sort(
                          (a: any, b: any) => b.id - a.id
                        )[0]
                      : null;
                  return {
                    user: user.email,
                    file: e.cadaFile.path,
                    field: latestElement.field,
                    createAt: latestElement.createdAt,
                    value: latestElement.value,
                  };
                })}
            />

            <Button variant="outlined" color="inherit" size="small">
              Report
            </Button>
          </Toolbar>
        </AppBar>
        <AppBar
          component="div"
          sx={{ px: theme.spacing(1), height: 10 }}
          position="static"
          elevation={0}
        >
          {/* <Tabs value={value} onChange={handleChange}>
            {events && events['false'] && (
              <Tab
                disableRipple
                label={
                  <div>
                    Assigned
                    <Chip
                      color="primary"
                      size="small"
                      sx={{
                        ml: 1,
                        bgcolor: "primary.light",
                        color: "primary.contrastText",
                      }}
                      label={events['false'].length}
                    />
                  </div>
                }
              />
            )}
            {events && events['true'] && (
              <Tab
                disableRipple
                label={
                  <div>
                    Completed
                    <Chip
                      size="small"
                      sx={{
                        ml: 1,
                        bgcolor: "secondary.light",
                        color: "secondary.contrastText",
                      }}
                      label={events['true'].length}
                    />
                  </div>
                }
              />
            )}
          </Tabs> */}
        </AppBar>
        <Panel events={events} project={project} />
      </>
    );
  } else return "";
}

export default Annotation;
