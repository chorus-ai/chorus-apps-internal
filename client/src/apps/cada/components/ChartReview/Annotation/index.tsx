import React from "react";
import { useEffect } from "react";
import {
  AppBar,
  Typography,
  Button,
  Toolbar,
  Box,
  LinearProgress,
} from "@mui/material";
import Panel from "./Panel";
import useDidMountEffect from "../../../../../hooks/useDidMountEffect";
import { getAnnotationEvents } from "../../../store/thunk";
import { NoContent } from "../../../common/NoContent";
import { Download } from "../../../common/Download";
import { useAppSelector, useAppDispatch } from "../../../../../hooks/redux";
;

export default function Annotation({ pid }: { pid: string }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const events = useAppSelector((state) =>
    state.cada.ann_events[pid] ? state.cada.ann_events[pid] : null
  );
  const user = useAppSelector((state) => state.main.user);
  const project = useAppSelector((state) => state.cada.userProjects[pid]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("useEffect: Annotation");
    if (events === null) {
      dispatch(getAnnotationEvents(pid, user?.id));
    } else {
      setIsLoading(false);
    }
  }, []);

  useDidMountEffect(() => {
    console.log("useDidMountEffect: Annotation", events);
    setIsLoading(false);
  }, [events]);

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <>
      {project && events && Object.keys(events).length > 0 && (
        <>
          <AppBar
            component="div"
            sx={{ pl: 1 }}
            position="static"
            elevation={0}
          >
            <Toolbar>
              <Typography color="inherit" variant="h6" component="h1">
                {(project as any).name} Annotation
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
                      user: user?.email,
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
            sx={{ px: 1, height: 10 }}
            position="static"
            elevation={0}
          />

          <Panel events={events} user={undefined} project={undefined} />
        </>
      )}
      {project && events && Object.keys(events).length === 0 && (
        <NoContent
          text="There are no assignments!"
          subtext="Contact your admin for assignments!"
        />
      )}
    </>
  );
}
