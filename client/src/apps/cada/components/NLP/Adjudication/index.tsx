import React from "react";
import { useEffect } from "react";
import {
  AppBar,
  Typography,
  Grid,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Tabs,
  Tab,
  TableCell,
} from "@mui/material";

import { MdCheck, MdHelp, MdRemove } from "react-icons/md";
import {
  getAdjudicationEvents,
  updateAdjudication,
} from "../../../store/thunk";
import { useParams } from "react-router-dom";
import useDidMountEffect from "../../../../../hooks/useDidMountEffect";
import { visuallyHidden } from "@mui/utils";
import { calculateAnnotationValues } from "../../../utils/adjudication_helper";
import { createTheme } from "@mui/material/styles";
import Selected from "./Selected";
import { NoContent } from "../../../common/NoContent";
import Overview from "./Overview";
import { useAppSelector, useAppDispatch } from "../../../../../hooks/redux";

const theme = createTheme();

const useStyles = {
  root: {
    padding: theme.spacing(0),
  },
  overview: {
    padding: theme.spacing(2),
  },
  detail: {
    padding: theme.spacing(2),
  },
  paper: {
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  secondaryBar: {
    zIndex: 0,
    paddingLeft: 20,
    padding: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing(0),
  },
  iconButtonAvatar: {
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover": {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  paper1: {
    position: "sticky",
    top: "1rem",
    minWidth: "275",
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  highlight1: {
    color: "rgba(0, 0, 0, 0.70)",
    fontSize: "18px",
    lineHeight: "2em",
    borderBottomStyle: "solid",
    borderBottomWidth: "4px",
    borderBottomColor: "#f57c00",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
  },
  highlight2: {
    backgroundColor: "#1abc9c",
    borderRadius: "5px",
    padding: "1px 4px",
    color: "white",
  },
  highlight3: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "5px",
    padding: "0px 6px",
    color: "white",
  },
  download: {
    border: "none",
    top: 5,
    borderRadius: 20,
    paddingInline: 10,
    paddingBlock: 8,
  },
  pages: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  customBadge: {
    backgroundColor: "#2ecc71",
  },
  footer: {
    position: "fixed",
    padding: theme.spacing(2),
    left: 0,
    bottom: 0,
    right: 0,
  },
  avatar: {
    color: "white",
  },
  noteDropdpwn: {
    minWidth: 100,
    paddingLeft: theme.spacing(1),
  },
  formControl: {
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
  row: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: "#f39c12",
    color: theme.palette.common.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  spacer: {
    flex: "1 1 auto",
  },
};

function ___calculateNoteAgreement(note: any) {
  let percentage = 0;
  let temp = [];
  let average = (array: any) => array.reduce((a: any, b: any) => a + b) / array.length;
  if (Object.keys(note).length === 0) {
    percentage = 0;
  } else {
    for (let con in note) {
      temp.push(note[con][1]);
    }
    percentage = average(temp);
  }

  return parseInt(percentage, 10);
}

function ___isAdjudicated(noteAdj: any) {
  if (noteAdj.length > 0) {
    return <MdCheck style={{ color: "#079992" }} />;
  }
  return <MdRemove />;
}

function ___getConceptValueRows(values: any, agreement: any) {
  return (
    <React.Fragment>
      <TableCell align="right">
        {Object.keys(values.isDetected).map((q, i) =>
          q === "" ? (
            ""
          ) : (
            <span key={i}>
              {q}
              <span
                style={{
                  color: "#fff",
                  backgroundColor: "rgba(26, 188, 156, 0.7)",
                  marginLeft: 1,
                  marginRight: 5,
                  paddingInline: "4px",
                  border: "1px solid",
                  borderRadius: "5px",
                  fontSize: 12,
                }}
              >
                {values.isDetected[q]}
              </span>
            </span>
          )
        )}
      </TableCell>
      <TableCell align="right">
        {Object.keys(values.isEncounter).map((q, i) =>
          q === "" ? (
            ""
          ) : (
            <span key={i}>
              {q}
              <span
                style={{
                  color: "#fff",
                  backgroundColor: "rgba(26, 188, 156, 0.7)",
                  marginLeft: 1,
                  marginRight: 5,
                  paddingInline: "4px",
                  border: "1px solid",
                  borderRadius: "5px",
                  fontSize: 12,
                }}
              >
                {values.isEncounter[q]}
              </span>
            </span>
          )
        )}
      </TableCell>
      <TableCell align="right">
        {Object.keys(values.isNegated).map((q, i) =>
          q === "" ? (
            ""
          ) : (
            <span key={i}>
              {q}
              <span
                style={{
                  color: "#fff",
                  backgroundColor: "rgba(26, 188, 156, 0.7)",
                  marginLeft: 1,
                  marginRight: 5,
                  paddingInline: "4px",
                  border: "1px solid",
                  borderRadius: "5px",
                  fontSize: 12,
                }}
              >
                {values.isNegated[q]}
              </span>
            </span>
          )
        )}
      </TableCell>
      <TableCell align="right">{agreement} %</TableCell>
    </React.Fragment>
  );
}

function NLP() {
  const params = useParams();
  const dispatch = useAppDispatch();

  const [annotatedNotes, setAnnotatedNotes] = React.useState({});
  const [adjudicatedNotes, setAdjudicatedNotes] = React.useState({});
  const [annotationResult, setAnnotationResult] = React.useState({});
  const [selectedIds, setSelected] = React.useState([]);
  const [tab, setTab] = React.useState(0);

  const adj_events = useAppSelector((state) =>
    state.cada.adj_events[parseInt(params.pid, 10)] &&
    state.cada.adj_events[parseInt(params.pid, 10)].length > 0
      ? state.cada.adj_events[parseInt(params.pid, 10)]
      : null
  );
  const project = useAppSelector((state) => state.cada.userProjects[params.pid]);

  const handleChange = (_e: any, newValue: any) => {
    setTab(newValue);
  };

  const handleClickAdjudicate = (_e: any) => {
    setTab(1);
  };

  useEffect(() => {
    console.log("useEffect: NLP");
    if (adj_events === null) {
      dispatch(getAdjudicationEvents(parseInt(params.pid, 10)));
    } else {
      if (
        Object.keys(annotatedNotes).length === 0 &&
        adj_events &&
        Object.keys(adj_events).length > 0
      ) {
        let ann = {};
        let adj = {};
        for (let i = 0; i < adj_events.length; i++) {
          ann[i] = {};
          for (let k = 0; k < adj_events[i].cadaAnnotations.length; k++) {
            if (
              adj_events[i].cadaAnnotations[k].completed === true &&
              adj_events[i].cadaAnnotations[k].cadaAnnotationValues.length > 0
            ) {
              for (
                let j = 0;
                j <
                adj_events[i].cadaAnnotations[k].cadaAnnotationValues.length;
                j++
              ) {
                ann[i][
                  adj_events[i].cadaAnnotations[k].cadaAnnotationValues[j].field
                ] = {
                  ...JSON.parse(
                    adj_events[i].cadaAnnotations[k].cadaAnnotationValues[j]
                      .value
                  ),
                  userId: adj_events[i].cadaAnnotations[k].userId,
                };
              }
            }
          }
        }
        for (let i = 0; i < adj_events.length; i++) {
          adj[i] = {};
          if (adj_events[i].cadaAdjudicationValues.length > 0) {
            for (
              let j = 0;
              j < adj_events[i].cadaAdjudicationValues.length;
              j++
            ) {
              adj[i][adj_events[i].cadaAdjudicationValues[j].field] = {
                ...JSON.parse(adj_events[i].cadaAdjudicationValues[j].value),
                userId: adj_events[i].cadaAdjudicationValues[j].userId,
              };
            }
          }
        }
        setAnnotationResult(calculateAnnotationValues(adj_events));
        setAnnotatedNotes(ann);
        setAdjudicatedNotes(adj);
      }
    }
  }, []);

  useDidMountEffect(() => {
    console.log("useDidMountEffect: NLP");

    let ann = {};
    let adj = {};
    for (let i = 0; i < adj_events.length; i++) {
      ann[i] = {};
      for (let k = 0; k < adj_events[i].cadaAnnotations.length; k++) {
        if (adj_events[i].cadaAnnotations[k].cadaAnnotationValues.length > 0) {
          for (
            let j = 0;
            j < adj_events[i].cadaAnnotations[k].cadaAnnotationValues.length;
            j++
          ) {
            ann[i][
              adj_events[i].cadaAnnotations[k].cadaAnnotationValues[j].field
            ] = {
              ...JSON.parse(
                adj_events[i].cadaAnnotations[k].cadaAnnotationValues[j].value
              ),
              userId: adj_events[i].cadaAnnotations[k].userId,
            };
          }
        }
      }
    }
    for (let i = 0; i < adj_events.length; i++) {
      adj[adj_events[i].id] = {};
      if (adj_events[i].cadaAdjudicationValues.length > 0) {
        for (let j = 0; j < adj_events[i].cadaAdjudicationValues.length; j++) {
          adj[adj_events[i].id][adj_events[i].cadaAdjudicationValues[j].field] =
            {
              ...JSON.parse(adj_events[i].cadaAdjudicationValues[j].value),
              userId: adj_events[i].cadaAdjudicationValues[j].userId,
            };
        }
      }
    }

    setAnnotationResult(calculateAnnotationValues(adj_events));
    setAnnotatedNotes(ann);
    setAdjudicatedNotes(adj);
  }, [adj_events]);

  if (
    project &&
    adj_events &&
    adj_events.length > 0 &&
    params.role === "adjudicator" &&
    Object.keys(annotationResult).length > 0
  ) {
    return (
      <div style={{ ...useStyles.root }}>
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
                    {project.name} Adjudication
                  </Typography>
                </Grid>
                <Grid>
                  <Button
                    style={{ ...useStyles.button }}
                    variant="outlined"
                    color="inherit"
                    size="small"
                  >
                    Report
                  </Button>
                </Grid>
                <Grid>
                  <Tooltip title="Help">
                    <IconButton color="inherit">
                      <MdHelp />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <AppBar
            component="div"
            sx={{ px: theme.spacing(1) }}
            position="sticky"
            elevation={0}
          >
            <Tabs value={tab} onChange={handleChange}>
              <Tab label="Overview" />
              {selectedIds.length > 0 && tab && (
                <Tab disableRipple label={<>{selectedIds.length} selected</>} />
              )}
            </Tabs>
          </AppBar>

          {tab === 0 ? (
            <Overview
              project={project}
              events={adj_events}
              selectedIds={selectedIds}
              setSelected={setSelected}
              handleClickAdjudicate={handleClickAdjudicate}
            />
          ) : (
            <Selected
              project={project}
              events={adj_events.filter((e) => selectedIds.includes(e.id))}
              selectedIds={selectedIds}
              aNotes={annotatedNotes}
              adjNotes={adjudicatedNotes}
              annotationResult={annotationResult}
              setAdjudicationNotes={setAdjudicatedNotes}
            />
          )}
        </React.Fragment>
      </div>
    );
  } else
    return (
      <NoContent
        text="There are no annotation values!"
        subtext="Have annotators start assignments."
      />
    );
}

export default NLP;
