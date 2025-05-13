import {
  Box,
  Button,
  Chip,
  Paper,
  Tab,
  Tabs,
  Toolbar,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateAnnotation } from "../../../redux/actions";
import { NoContent } from "../../../common/NoContent";
import { Pages } from "../../../common/Pages";
const theme = createTheme();

export default function AfibAnnotation({ user, project, events, events_count }) {
  const [data, setData] = useState([]);
  const [eIdx, setEvent] = useState(0);
  const [completedTab, setCompletedTab] = useState(false);
  const [buttonsDisabled] = useState(false);

  const dispatch = useDispatch();

  const handleTabChange = (e, newValue) => {
    if (newValue === false) {
      setCompletedTab(false);
      setEvent(0);
    } else {
      setCompletedTab(true);
    }
  };

  const handleSubmit = (e) => {
    let isComplete = true;
    setData([
      ...data,
      {
        user: user.Email,
        file: events[completedTab][eIdx].cadaFile.path,
        field: project.name,
        value: e.currentTarget.value,
      },
    ]);

    dispatch(
      updateAnnotation(
        project.id,
        events[completedTab][eIdx].id,
        completedTab,
        {
          field: project.name,
          value: e.currentTarget.value,
          cadaAnnotationId: events[completedTab][eIdx].cadaAnnotations[0].id,
          createdAt: new Date(new Date().toUTCString()).toISOString(),
        },
        isComplete
      )
    );
  };

  const handlePage = (event, page) => {
    setEvent(page - 1);
  };

  React.useEffect(() => {
    if (events?.[false]?.length === 0 && !completedTab) {
      setCompletedTab(true);
    }
  }, [events]);

  const StoneViewer = ({ studyId }) => {
    const orcURL = `${process.env.REACT_APP_ORTHANC}/stone-webviewer/index.html?study=${studyId}`;
    return (
      <div style={{ width: '100%', height: 'calc(100vh - 50px)' }}>
        <iframe
          src={orcURL}
          title="DICOM Viewer"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    );
  };
  
  return (
    <>
      {events?.[completedTab]?.length > 0 && events[completedTab][eIdx]?.cadaAnnotations?.[0]?.cadaAnnotationValues ? (
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Toolbar disableGutters>
            <Tabs
              textColor="primary"
              value={completedTab}
              onChange={handleTabChange}
            >
              <Tab
                disableRipple
                textColor="primary"
                disabled={events[false].length === 0}
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
                disabled={events[true].length === 0}
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
              ? JSON.parse(project.attributes).Buttons.map((b, i) => {
                  let latestElement =
                    events[completedTab][eIdx].cadaAnnotations[0]
                      .cadaAnnotationValues.length > 0
                      ? events[completedTab][
                          eIdx
                        ].cadaAnnotations[0].cadaAnnotationValues.sort(
                          (a, b) => b.id - a.id
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
              : JSON.parse(project.attributes).Buttons.map((b, i) => (
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
            {events[completedTab].length > 0 ? (
              <StoneViewer studyId={events[completedTab][eIdx].cadaFile.path} />
            ) : (
              <Box p={2} textAlign="center">
                <NoContent
                  text="No events in this tab."
                  subtext={completedTab ? "All assigned events are completed." : "No assigned events available."}
                />
              </Box>
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
                total={events[completedTab].length}
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
