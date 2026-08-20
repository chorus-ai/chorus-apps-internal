import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useState } from "react";
;
import { MdAutorenew, MdInfo } from "react-icons/md";
import useDidMountEffect from "../../../../../hooks/useDidMountEffect";
import { useSaveAnnotation } from "../../../hooks";
import { NoContent } from "../../../common/NoContent";
import { Pages } from "../../../common/Pages";
import DataPanel from "./Data";

const theme = createTheme();

export default function AfibAnnotation({ user, project, events, events_count }: { user: any; project: any; events: any; events_count: any }) {
  const [data, setData] = useState<any[]>([]);
  const [eIdx, setEvent] = useState(0);
  const [completedTab, setCompletedTab] = useState(false);
  const [buttonsDisabled] = useState(false);
  const [resetButtonVisibility, setResetButtonVisibility] = useState(false);
  const [chartObjects, setChartObjects] = useState<any[]>([]);
  const [selectedRanges, setSelectedRanges] = useState<any>({});

  const saveAnnotation = useSaveAnnotation();

  const handleTabChange = (_e: any, newValue: any) => {
    if (newValue === false) {
      setCompletedTab(false);
      setEvent(0);
    } else {
      setCompletedTab(true);
      setSelectedRanges([]);
      setResetButtonVisibility(false);
    }
  };

  const handleSubmit = (e: any) => {
    setData([
      ...data,
      {
        user: user.Email,
        file: events[String(completedTab)][eIdx].cadaFile.path,
        field: project.name,
        value: e.currentTarget.value,
      },
    ]);

    saveAnnotation.mutate({
      projectId: project.id,
      eventId: events[String(completedTab)][eIdx].id,
      completed: completedTab,
      annotation: {
        field: project.name,
        value: e.currentTarget.value,
        cadaAnnotationId: events[String(completedTab)][eIdx].cadaAnnotations[0].id,
        createdAt: new Date(new Date().toUTCString()).toISOString(),
      },
    });
  };

  const handlePage = (_event: any, page: any) => {
    setEvent(page - 1);
  };

  const onSelectRange = (e: any) => {
    if (resetButtonVisibility === false) {
      setSelectedRanges({
        ...selectedRanges,
        min: e.axisX[0].viewportMinimum,
        max: e.axisX[0].viewportMaximum,
      });
      setResetButtonVisibility(true);
    }
  };

  const getChartObj = (obj: any, type: any) => {
    if (type === "add") {
      setChartObjects((chartObjects) => [...chartObjects, obj]);
    } else if (type === "remove") {
      setChartObjects((chartObjects) => {
        let copy = Object.assign([], chartObjects);

        for (let i = 0; i < copy.length; i++) {
          if (copy[i] === obj) {
            copy.splice(i, 1);
          }
        }
        return copy;
      });
    }
  };

  const handleResetButtonClick = () => {
    let charts = chartObjects;
    for (let i = 0; i < charts.length; i++) {
      charts[i].options.axisX.viewportMinimum = 0;
      charts[i].options.axisX.viewportMaximum = 30;
      charts[i].render();
      if (charts[i]._zoomButton.getAttribute("state") === "zoom") {
        charts[i]._zoomButton.click();
      }
    }
    setResetButtonVisibility(false);
  };

  useDidMountEffect(() => {
    if (chartObjects) {
      let charts = chartObjects;
      for (let i = 0; i < charts.length; i++) {
        charts[i].options.axisX.viewportMinimum = selectedRanges.min;
        charts[i].options.axisX.viewportMaximum = selectedRanges.max;
        charts[i].render();
        if (charts[i]._zoomButton.getAttribute("state") === "pan") {
          charts[i]._zoomButton.click();
        }
      }
    }
  }, [selectedRanges]);

  return (
    <>
      {events &&
      events[String(completedTab)] &&
      events[String(completedTab)][eIdx] &&
      events[String(completedTab)][eIdx].cadaAnnotations &&
      events[String(completedTab)][eIdx].cadaAnnotations[0].cadaAnnotationValues ? (
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Toolbar disableGutters>
            <Tabs
              textColor="primary"
              value={completedTab}
              onChange={handleTabChange}
            >
              <Tab
                disableRipple
                disabled={events['false'].length === 0}
                value={false}
                label={
                  <div>
                    Assigned
                    <Chip
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                      label={events_count[0]}
                    />
                  </div>
                }
              />

              <Tab
                disableRipple
                disabled={events['true'].length === 0}
                value={true}
                label={
                  <div>
                    Completed
                    <Chip
                      color="secondary"
                      size="small"
                      sx={{ ml: 1 }}
                      label={events_count[1]}
                    />
                  </div>
                }
              />
            </Tabs>

            <div style={{ flex: "1 1 auto" }} />

            {completedTab
              ? JSON.parse(project.attributes).Buttons.map((b: any, _i: any) => {
                  let latestElement =
                    events[String(completedTab)][eIdx].cadaAnnotations[0]
                      .cadaAnnotationValues.length > 0
                      ? events[String(completedTab)][
                          eIdx
                        ].cadaAnnotations[0].cadaAnnotationValues.sort(
                          (a: any, b: any) => b.id - a.id
                        )[0]
                      : null;
                  return (
                    <Button
                      variant="contained"
                      value={b.value}
                      size="small"
                      disabled={buttonsDisabled}
                      style={{
                        marginRight: 5,
                        backgroundColor:
                          latestElement && latestElement.value === b.value
                            ? b.color
                            : "#bdc3c7",
                        color: "#ecf0f1",
                      }}
                      onClick={handleSubmit}
                    >
                      {b.name}
                    </Button>
                  );
                })
              : JSON.parse(project.attributes).Buttons.map((b: any, i: any) => (
                  <Button
                    key={i}
                    variant="contained"
                    value={b.value}
                    size="small"
                    disabled={buttonsDisabled}
                    style={{
                      marginRight: 5,
                      backgroundColor: b.color,
                      color: "#ecf0f1",
                    }}
                    onClick={handleSubmit}
                  >
                    {b.name}
                  </Button>
                ))}
          </Toolbar>

          <Paper>
            <Toolbar>
              <div style={{ flex: "1 1 auto" }} />
              <Tooltip title="reset chart">
                <IconButton
                  color="primary"
                  onClick={handleResetButtonClick}
                  disabled={!resetButtonVisibility}
                  component="span"
                >
                  <MdAutorenew />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  `Filename: ` +
                  events[String(completedTab)][eIdx].cadaFile.path.split("/").pop()
                }
              >
                <IconButton color="default">
                  <MdInfo />
                </IconButton>
              </Tooltip>
            </Toolbar>

            {events[String(completedTab)].length > 0 ? (
              <DataPanel
                leadOrder={[]}
                completedTab={completedTab}
                viewportInterval={onSelectRange}
                getChartObj={getChartObj}
                range={30}
                fileLength={30}
                filename={events[String(completedTab)][eIdx].cadaFile.path}
                nextFilename={
                  typeof events[String(completedTab)][eIdx + 1] === "undefined"
                    ? ""
                    : events[String(completedTab)][eIdx + 1].cadaFile.path
                }
              />
            ) : (
              ""
            )}
          </Paper>

          {completedTab && (
            <Box
              style={{
                position: "fixed",
                padding: theme.spacing(2),
                left: 0,
                bottom: 0,
                right: 0,
              }}
              mt={8}
            >
              <Pages
                page={eIdx + 1}
                total={events[String(completedTab)].length}
                onChange={handlePage}
              />
            </Box>
          )}
        </Box>
      ) : (
        <NoContent
          text="There are chart data!"
          subtext="Check raw data exists!"
        />
      )}
    </>
  );
}
