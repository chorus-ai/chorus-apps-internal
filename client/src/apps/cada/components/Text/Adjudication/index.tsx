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
  Box,
  Stack,
  Popover,
  Slider, 
  Tooltip, 
  styled,
  tooltipClasses
} from "@mui/material";
import useDidMountEffect from "../../../../../hooks/useDidMountEffect";
import { Download } from "../../../common/Download";
import { NoContent } from "../../../common/NoContent";
import { Pages } from "../../../common/Pages";
import { getAdjudicationEvents, updateAdjudication } from "../../../store/thunk";
import { useAppSelector, useAppDispatch } from "../../../../../hooks/redux";
import { alpha, createTheme } from "@mui/material/styles";
import axios from "axios";
import { LiaSlidersHSolid } from "react-icons/lia";
import { merge, sortBy } from "lodash";
import { use } from "echarts";

const theme = createTheme();

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: 14
  },
}));

// Helper function to merge overlapping intervals
const mergeIntervals = (intervals: any) => {
  intervals.sort((a: any, b: any) => a.start - b.start);
  let merged = [];

  for (let i = 0; i < intervals.length; i++) {
    let current = intervals[i];
    if (merged.length === 0 || merged[merged.length - 1].end < current.start) {
      merged.push(current);
    } else {
      let last = merged[merged.length - 1];
      last.end = Math.max(last.end, current.end);
      // Combine tags and models
      last.models = (last.models || []).concat(current.models || []);
    }
  }
  merged = merged.map((item) => {
    if (item.models) {
      //remove same model objects
      item.models = item.models.filter((model: any, index: any, self: any) =>
        index === self.findIndex((t: any) => (
          t.tag === model.tag && t.start === model.start && t.end === model.end && t.score === model.score
        ))
      );
    }
    return item
  }); 
  console.log('merged: ',merged);
  return merged;
};

const combineOffsets = (offsets: any, modelValues: any) => {

  let combinedOffsets = [];

  if (offsets.length === 0) {
    // If offsets are empty, process only modelValues to combine overlapping intervals
    combinedOffsets = mergeIntervals(modelValues.map((model: any) => ({
      ...model,
      start: Number(model.start),
      end: Number(model.end),
    })));
  } else {
    combinedOffsets = [...offsets, ...modelValues];
  }

  // First, process the offsets to include any overlapping modelValues
  for (let offset of offsets) {
    const start = Number(offset.start);
    const end = Number(offset.end);
    const overlappingModels = modelValues.filter((model: any) => Number(model.start) < end && Number(model.end) > start);
    if (overlappingModels.length > 0) {
      combinedOffsets.push({
        ...offset,
        start,
        end,
        models: overlappingModels
      });
    } else {
      combinedOffsets.push({
        ...offset,
        start,
        end,
      });
    }
  }

  // Then, add any modelValues that do not overlap with any existing offsets
  for (let model of modelValues) {
    const start = Number(model.start);
    const end = Number(model.end);
    const overlappingOffset = combinedOffsets.find((offset) => offset.start < end && offset.end > start);
    if (!overlappingOffset) {
      combinedOffsets.push({
        ...model,
        start,
        end,
      });
    }
  }

  // Merge overlapping intervals in the combinedOffsets array
  combinedOffsets = mergeIntervals(combinedOffsets);

  console.log('combinedOffsets: ',combinedOffsets);

  return combinedOffsets;
};


const splitWithOffsets = (text: any, offsets: any) => {
  let lastEnd = 0;
  const splits = [];

  // Sort the combined offsets by start position
  offsets = sortBy(offsets, ['start', 'end']);

  for (let offset of offsets) {
    const start = Number(offset.start);
    const end = Number(offset.end);

    // Handle non-overlapping part before the current offset
    if (lastEnd < start) {
      splits.push({
        start: lastEnd,
        end: start,
        content: text.slice(lastEnd, start),
      });
    }

    // Add the current offset to the splits
    splits.push({
      ...offset,
      start,
      end,
      mark: true,
      content: text.slice(start, end),
    });

    lastEnd = end;
  }

  // Handle the remaining part after the last offset
  if (lastEnd < text.length) {
    splits.push({
      start: lastEnd,
      end: text.length,
      content: text.slice(lastEnd, text.length),
    });
  }

  return splits;
};

const selectionIsEmpty = (selection: any) => {
  let position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
  return position === 0 && selection.focusOffset === selection.anchorOffset;
};

const selectionIsBackwards = (selection: any) => {
  if (selectionIsEmpty(selection)) return false;

  let position = selection.anchorNode.compareDocumentPosition(
    selection.focusNode
  );

  let backward = false;
  if (
    (!position && selection.anchorOffset > selection.focusOffset) ||
    position === Node.DOCUMENT_POSITION_PRECEDING
  )
    backward = true;

  return backward;
};

const Mark = (props: any) => {
  return (
    <span
      data-start={props.start}
      data-end={props.end}
      onClick={() => props.onClick({ start: props.start, end: props.end })}
      style={{ position: "relative", display: "inline-block" }}
    >
      {props.content && (
        <span
          style={{
            ...props.markStyle,
            borderBottom: `2px solid ${props.color}`,
          }}
        >
          {props.content}
        </span>
      )}

      {props.tag && (
        <sup style={{ ...props.tagStyle, color: props.color }}>
          {props.tag}{" "}
          {props.score && (
            <span
              style={{
                fontSize: ".9em",
                color: "white",
                padding: "0px 5px",
                borderRadius: "10px",
                backgroundColor: `${props.color}`,
              }}
            >
              {Number(props.score)}
            </span>
          )}
          {props.models && props.models.length > 1 && (
            <CustomTooltip
              title={
                <React.Fragment>
                  {props.models.map((model: any, i: any) => (
                    <div key={i}>
                      <span
                        style={{
                          ...props.markStyle,
                          borderBottom: `2px solid ${props.color}`,
                        }}
                      >
                        {model.content}
                      </span>
                      <sup
                        key={i}
                        style={{ ...props.tagStyle, color: props.color }}
                      >
                        {model.tag}{" "}
                        {model.score && (
                          <span
                            style={{
                              fontSize: "1em",
                              color: "white",
                              padding: "0px 5px",
                              borderRadius: "10px",
                              backgroundColor: `${model.color}`,
                            }}
                          >
                            {Number(model.score)}
                          </span>
                        )}
                      </sup>
                    </div>
                  ))}
                </React.Fragment>
              }
            >
              <span
                style={{
                  fontSize: "0.9em",
                  color: "white",
                  padding: "0 4px",
                  borderRadius: "4px",
                  backgroundColor: "#eb3b5a",
                }}
              >
                +{props.models.length}
              </span>
            </CustomTooltip>
          )}
        </sup>
      )}
    </span>
  );
};

const Split = (props: any) => {
  if (props.mark) return <Mark {...props} />;

  return (
    <span
      data-start={props.start}
      data-end={props.end}
      onClick={() => props.onClick({ start: props.start, end: props.end })}
    >
      {props.content}
    </span>
  );
};

const TextAnnotatorPanel = (props: any) => {

  const handleMouseUp = () => {
    if (!props.onChange) return;

    const selection = window.getSelection();

    if (selectionIsEmpty(selection)) return;

    let start = parseInt( selection.anchorNode.parentElement.getAttribute("data-start"), 10) + selection.anchorOffset;
    let end = parseInt(selection.focusNode.parentElement.getAttribute("data-start"),10) + selection.focusOffset;

    if (isNaN(end)) return;
    if (isNaN(start)) return;

    if (selectionIsBackwards(selection)) {
      [start, end] = [end, start];
    }

    props.onChange([
      ...props.value,
      props.getSpan({ start, end}),
    ]);

    window.getSelection().empty();
  };

  const handleSplitClick = ({ start, end }) => {
    const splitIndex = props.value.findIndex(
      (s: any) => s.start === start && s.end === end
    );
    if (splitIndex >= 0) {
      props.onChange([
        ...props.value.slice(0, splitIndex),
        ...props.value.slice(splitIndex + 1),
      ]);
    }
  };

  const splits = splitWithOffsets(props.content, props.value);

  return (
    <div style={props.style} onMouseUp={handleMouseUp}>
      {splits.map((split) => (
        <Split
          key={`${split.start}-${split.end}`}
          {...props}
          {...split}
          onClick={handleSplitClick}
        />
      ))}
    </div>
  );
};

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

export default function Annotation( {pid}) {
  const [state, setState] = useState({});
  const [saved, setSaved] = useState(true);
  const [tags, setTags] = useState({});
  const [activeTag, setActiveTag] = useState(0);
  const [tabValue, setTabValue] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [noteContent, setNoteContent] = React.useState({});
  const [_isLoading, setIsLoading] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sliderValue, setSliderValue] = useState(1.00);
  const [completedTab, _setCompletedTab] = useState(false);

  const handleModelIconClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSliderChange = (_event: any, newValue: any) => {
    setSliderValue(newValue);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const events = useAppSelector((state) =>
    state.cada.adj_events[pid]
      ? state.cada.adj_events[pid]
      : null
  );

  const user = useAppSelector((state) => state.main.user);
  const project = useAppSelector((state) => state.cada.userProjects[pid]);

  const dispatch = useAppDispatch();

  const handleSave = () => {
    let ___isComplete = true;

    const filteredState = state[page]
      .filter((item: any) => item.score === undefined)
      .map((item: any) => {
        return {
          tag: item.tag,
          start: item.start,
          end: item.end,
          color: item.color
        };
      });

    dispatch(
      updateAdjudication(
        project.id,
        events.sort((a: any, b: any) => a.id - b.id)[page].id,
        user.id,
        completedTab,
        {
          field: project.name,
          value: JSON.stringify(filteredState),
          userId: user.id,
          cadaEventId: events.sort((a: any, b: any) => a.id - b.id)[page].id,
          createdAt: new Date(new Date().toUTCString()).toISOString(),
        }
      )
    );
    setSaved(true);
  };

  const handleLabelChange = (value: any) => {
    if (JSON.stringify(state[page]) === JSON.stringify(value)) {
      return;
    }
    setState({ ...state, [page]: value });
    setSaved(false);
  };

  const handleTabChange = (_event: any, newValue: any) => {  
    setTabValue(newValue);
  };

  const handleTagChange = (e: any) => {
    setActiveTag(e.target.value);
  };

  const handlePageChange = (_event: any, page: any) => {
    setPage(page - 1);
  };

  const getNoteContent = async (events: any, page: any) => {
    const sortedEvents = events.sort((a: any, b: any) => a.id - b.id);
    const filePath = sortedEvents[page].cadaFile.path;
    const currentEvent = sortedEvents[page];
    let lastAnnotationValue = [];
    let lastAdjudicationValue = [];

    const result = await axios(`/api/cada/file/json?filename=${encodeURIComponent(filePath)}`);

    for (let i = 0; i < currentEvent.cadaAnnotations.length; i++) {
      console.log('i: ',i,currentEvent.cadaAnnotations[i]);
      
      if (currentEvent.cadaAnnotations[i]?.cadaAnnotationValues.length > 0) {
        // Sort the annotation values by 'id' in descending order and get the one with the highest id
        const sortedAnnotationValues = currentEvent.cadaAnnotations[i].cadaAnnotationValues.sort((a: any, b: any) => b.id - a.id);
        
        lastAnnotationValue.push(...JSON.parse(sortedAnnotationValues[0].value).map((item: any) => {
          return {
            tag: item.tag,
            start: item.start,
            end: item.end,
            color: item.color,
            score: currentEvent.cadaAnnotations[i].userId,
            content: result.data.text.slice(item.start, item.end)
          };
        }));
      }
    }

    if (currentEvent.cadaAdjudicationValues.length > 0) {
      // Sort the adjudication values by 'id' in descending order and get the one with the highest id
      const sortedAdjudicationValues = currentEvent.cadaAdjudicationValues.sort((a: any, b: any) => b.id - a.id);
      lastAdjudicationValue =JSON.parse(sortedAdjudicationValues[0].value).map((item: any) => {
        return {
          tag: item.tag,
          start: item.start,
          end: item.end,
          color: item.color,
          score: sortedAdjudicationValues[0].userId,
          content: result.data.text.slice(item.start, item.end)
        };
      });
    }


    console.log('lastAnnotationValue: ',lastAnnotationValue);
    console.log('lastAdjudicationValue: ',lastAdjudicationValue);
    let temp = combineOffsets(lastAnnotationValue, lastAnnotationValue);
    temp = sortBy(temp, ['start', 'end']);

    setState({ ...state, [page]: temp });
    setNoteContent(result.data);
  };

  useEffect(() => {
    if (!events) {
      dispatch(getAdjudicationEvents(pid, user.id, null, true));
      setIsLoading(true);
    } else {
      setIsLoading(false);
      getNoteContent(events, page);
    }
  }, events);

  useDidMountEffect(() => {
    getNoteContent(events, page);
  }, [page]);

  useEffect(() => {
    if (project) {
      const parsedTags = JSON.parse(project.attributes).Buttons.map(function (obj: any) {
        return { name: obj.name, value: obj.value, color: obj.color };
      });
      setTags(parsedTags);
    }
  }, [project]);

  console.log('state: ',state);

  if (project && events && Object.keys(events).length > 0) {
    return (
      <>
        <AppBar component="div" sx={{ pl: 1 }} position="static" elevation={0}>
          <Toolbar>
            <Grid container alignItems="center" spacing={1}>
              <Grid size="grow">
                <Typography color="inherit" variant="h6" component="h1">
                  {project.name} Annotation
                </Typography>
              </Grid>
              <Grid>
                <Download
                  data={Object.entries(state).flatMap(([key, value]) =>
                    value.map((childObj: any) => ({ ...childObj, noteIndex: events[key].cadaFile.path })) 
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
              <Grid>
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
            <Tabs value={tabValue} onChange={handleTabChange}>
              {events.length > 0 && (
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
                        label={events.length}
                      />
                    </div>
                  }
                />
              )}
            </Tabs>
            <div style={{ flex: "1 1 auto" }} />
              <Button
                onClick={() => handleSave()}
                size="small"
                variant="contained"
                color="primary"
                component="span"
                disabled={saved}
              >
                SAVE
              </Button>
            </Toolbar>
          
       {(noteContent.text && <Panel>

        <Stack direction="row" justifyContent="flex-end">
          <IconButton size="medium" onClick={handleModelIconClick}>
            <LiaSlidersHSolid />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ p: 2, width: 250 }}>
              <Typography> <b>Model: </b>Deid Roberta i2b2 </Typography>
              <Typography><b>Sensitivity:</b> {sliderValue.toFixed(2)}</Typography>
              <Slider
                value={sliderValue}
                onChange={handleSliderChange}
                min={0}
                max={1}
                step={0.01}
                valueLabelDisplay="auto"
                aria-labelledby="continuous-slider"
              />
            </Box>
          </Popover>
        </Stack>

            {tags &&
              tags.map((b: any, i: any) => (
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
                    bgcolor: i == activeTag ? b.color : "action.disabled",
                    "&:hover": {
                      bgcolor: alpha(b.color, 0.5),
                    },
                  }}
                  onClick={handleTagChange}
                >
                  {b.name}
                </Button>
              ))}
                <TextAnnotatorPanel
                  style={{
                    marginTop: 20,
                    lineHeight: 2.5,
                    padding: 4, 
                    whiteSpace: "pre-wrap", 
                  }}
                  markStyle={{
                    margin: "0 .1em",
                    borderRadius: ".25em"
                  }}
                  tagStyle={{
                    textTransform: "uppercase",
                    display: "inline-block",
                    marginLeft: ".2rem",
                    marginRight: ".1rem",
                    fontWeight: "600",
                  }}
                  content={noteContent.text}
                  value={state[page] ? [...state[page]] : []}
                  onChange={handleLabelChange}
                  getSpan={(span: any) => ({
                    ...span,
                    tag: tags[activeTag].name,
                    color: tags[activeTag].color,
                  })}
                />
            
          </Panel>)}
          <Box
              style={{
                position: "fixed",
                padding: theme.spacing(2),
                left: 0,
                bottom: 20,
                right: 0,
              }}
              mt={8}
            >
            <Pages
              total={events.length}
              page={page + 1}
              onChange={handlePageChange}
            />
          </Box>
        </Box>
      </>
    );
  } else 
  return <NoContent
    text="There are no assignments!"
    subtext="Contact your admin for assignments!"
  />;
}
