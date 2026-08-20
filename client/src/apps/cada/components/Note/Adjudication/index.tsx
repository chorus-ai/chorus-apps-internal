import React from "react";
import { useEffect, useState } from "react";
import {
  AppBar,
  Typography,
  Grid,
  Button,
  Toolbar,
  Tabs,
  Tab,
} from "@mui/material";

;
import { useParams } from "react-router-dom";

import { createTheme } from "@mui/material/styles";
import Overview from "./Overview";
import Selected from "./Selected";
import { indexStyles } from "./styles";
import { getAdjudicationEvents } from "../../../store/thunk";
import AnnotatorProgress from "./AnnotatorProgress";
import { useAppSelector, useAppDispatch } from "../../../../../hooks/redux";

const theme = createTheme();

export default function Adjudication() {

  const { pid } = useParams();

  const dispatch = useAppDispatch();

  const [annotatedNotes, _setAnnotatedNotes] = useState({});
  const [adjudicatedNotes, setAdjudicatedNotes] = useState({});
  const [annotationResult, _setAnnotationResult] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [tab, setTab] = useState(0);

  const events = useAppSelector((state) => state.cada.adj_events[pid]);
  const project = useAppSelector((state) => state.cada.userProjects[pid]);

  useEffect(() => {
    if (!events && pid !== undefined && pid !== null) {
      dispatch(getAdjudicationEvents(parseInt(pid)));
    }

  }, [getAdjudicationEvents, events, pid]);

  const handleChange = (_e: any, newValue: any) => {
    setTab(newValue);
  };

  const handleClickAdjudicate = (_e: any) => {
    setTab(2);
  };

  return (
    <div style={{ ...indexStyles.root }}>
      <React.Fragment>
        <AppBar
          component="div"
          sx={{ px: theme.spacing(1) }}
          position="static"
          elevation={0}
        >
          <Toolbar>
            <Grid container alignItems="center" spacing={1}>
              <Grid size="grow">
                <Typography color="inherit" variant="h6" component="h1">
                  {project?.name} Adjudication
                </Typography>
              </Grid>
              <Grid>
                <Button
                  style={{ ...indexStyles.button }}
                  variant="outlined"
                  color="inherit"
                  size="small"
                >
                  Report
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <AppBar
          component="div"
          sx={{ px: theme.spacing(1) }}
          position="static"
          elevation={0}
        >
          <Tabs value={tab} onChange={handleChange}>
            <Tab label="Overview" />
            <Tab label="Progress" />
            {selectedIds.length > 0 && tab === 2 && (
              <Tab disableRipple label={<>{selectedIds.length} selected</>} />
            )}
          </Tabs>
        </AppBar>
        {events && events.length > 0 && (tab === 0
          ? (
            <Overview
              project={project}
              events={events}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              handleClickAdjudicate={handleClickAdjudicate}
            />
          )
          : (tab === 1 ?
            <AnnotatorProgress
              pid={pid}
              events={events}
            /> :
            <Selected
              project={project}
              events={events.filter((e: any) => selectedIds.includes(e.id))}
              selectedIds={selectedIds}
              aNotes={annotatedNotes}
              adjNotes={adjudicatedNotes}
              annotationResult={annotationResult}
              setAdjudicationNotes={setAdjudicatedNotes}
            />
          ))}
      </React.Fragment>
    </div>
  )
}
