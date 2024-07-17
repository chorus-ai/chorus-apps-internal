import React, { useState, useEffect } from "react";
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
  Pagination,
  Badge,
  PaginationItem,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useDidMountEffect from "../../../../hooks/useDidMountEffect";
import { Download } from "../../common/Download";
import { NoContent } from "../../common/NoContent";
import TextAnnotator from "./Panel";
import { useSelector, useDispatch } from "react-redux";
import { getAnnotationEvents } from "../../../../redux/cada/actions";
import { alpha, createTheme } from "@mui/material/styles";

const theme = createTheme();

const notes = require("../../assets/data.json");

const Panel = ({ children }) => (
  <div
    style={{
      boxShadow: "0 2px 4px rgba(0,0,0,.1)",
      backgroundColor: theme.palette.background.paper,
      width: "100%",
      marginTop: 2,
      padding: 20,
    }}
  >
    {children}
  </div>
);

const Pages = ({ total, page, onChange }) => {
  return (
    <Pagination
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      color="primary"
      size="small"
      count={total}
      page={page}
      showFirstButton
      showLastButton
      boundaryCount={2}
      onChange={onChange}
      renderItem={(item) =>
        item.type === "pages  " ? (
          <Badge variant="dot">
            <PaginationItem {...item} />
          </Badge>
        ) : (
          <PaginationItem {...item} />
        )
      }
    />
  );
};

export default function Annotation() {
  const [state, setState] = useState({});
  const [tag, setTag] = useState(0);
  const params = useParams();
  const [value, setValue] = React.useState(0);
  const [note, setNote] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const user = useSelector((state) => state.main.user);
  const events = useSelector((state) =>
    state.cada.ann_events[parseInt(params.pid, 10)]
      ? state.cada.ann_events[parseInt(params.pid, 10)]
      : null
  );
  const project = useSelector((state) => state.cada.userProjects[params.pid]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!events) {
      dispatch(getAnnotationEvents(params.pid, user.id));
      setIsLoading(true);
    } else {
    }
  }, [params]);

  useDidMountEffect(() => {
    setIsLoading(false);
  }, [events]);

  const handleChange = (value) => {
    setState({ ...state, [note]: value });
    console.log("handleChange: ", value);
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const handlePage = (event, page) => {
    setNote(page - 1);
  };

  if (project && events && Object.keys(events).length > 0) {
    const tags = JSON.parse(project.attributes).Buttons.map(function (obj) {
      return { name: obj.name, value: obj.value, color: obj.color };
    });

    return (
      <>
        <AppBar component="div" sx={{ pl: 1 }} position="static" elevation={0}>
          <Toolbar>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs>
                <Typography color="inherit" variant="h6" component="h1">
                  {project.name} Annotation
                </Typography>
              </Grid>
              <Grid item>
                <Download
                  data={Object.entries(state).flatMap(([key, value]) =>
                    value.map((childObj) => ({ ...childObj, noteIndex: key }))
                  )}
                  filename="data.csv"
                  style={{
                    border: "none",
                    float: "right",
                    backgroundColor: "rgba(0,0,0,0)",
                    borderRadius: 0,
                    padding: 0,
                  }}
                />
              </Grid>
              <Grid item>
                <Button variant="outlined" color="inherit" size="small">
                  Report
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <AppBar
          component="div"
          sx={{ px: 1, height: 10 }}
          position="static"
          elevation={0}
        />
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Toolbar disableGutters={true}>
            <Tabs value={value} onChange={handleChange}>
              {events[false] && events[false].length > 0 && (
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
                        label={events[false].length}
                      />
                    </div>
                  }
                />
              )}
              {events[true] && events[true].length > 0 && (
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
                        label={events[true].length}
                      />
                    </div>
                  }
                />
              )}
            </Tabs>
          </Toolbar>
          <Panel>
            {tags &&
              tags.map((b, i) => (
                <Button
                  key={i}
                  variant="contained"
                  value={i}
                  size="small"
                  sx={{
                    lineHeight: 1.5,
                    color: "white",
                    textTransform: "uppercase",
                    display: "inline-block",
                    marginRight: ".5rem",
                    fontSize: ".9rem",
                    fontWeight: 600,
                    bgcolor: i == tag ? b.color : "action.disabled",
                    "&:hover": {
                      bgcolor: alpha(b.color, 0.5),
                    },
                  }}
                  onClick={handleTagChange}
                >
                  {b.name}
                </Button>
              ))}

            <TextAnnotator
              style={{
                lineHeight: 2,
                fontSize: 16,
                padding: 4,
              }}
              markStyle={{
                padding: ".2em .2em",
                margin: "0 .25em",
                borderRadius: ".25em",
              }}
              tagStyle={{
                color: "white",
                textTransform: "uppercase",
                display: "inline-block",
                marginLeft: ".6rem",
                marginRight: ".5rem",
                fontSize: ".9rem",
                fontWeight: "600",
              }}
              content={notes[note].text}
              value={state[note] ? state[note] : []}
              onChange={handleChange}
              getSpan={(span) => ({
                ...span,
                tag: tags[tag].name,
                color: tags[tag].color,
              })}
            />
          </Panel>
          <Box
            sx={{
              position: "fixed",
              padding: theme.spacing(2),
              left: 0,
              bottom: 30,
              right: 0,
            }}
            mt={8}
          >
            <Pages
              total={events[value === 0 ? false : true].length}
              page={note + 1}
              onChange={handlePage}
            />
          </Box>
        </Box>
      </>
    );
  } else return;
  <NoContent
    text="There are no assignments!"
    subtext="Contact your admin for assignments!"
  />;
}
