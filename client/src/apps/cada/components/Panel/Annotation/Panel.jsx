import { Box, Button, createTheme, Grid, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Form from './Form';
import { isEqual } from '../../../../../utils/objectFunctions';
import DataPanel from './Data';
import axios from 'axios';
import { filterMostRecentByField } from '../../../utils/annotation_helper';
import { useDispatch } from 'react-redux';
import { updateAnnotation } from '../../../redux/actions';

const theme = createTheme();

export default function Panel({ events, eIdx, setEIdx, project, user, type, form }) {

  useEffect(() => {
    const handleMouseDown = (event) => {
      event.preventDefault();
      // Start tracking the mousemove event
      document.addEventListener('mousemove', handleMouseMove);
      // When mouse is released anywhere in the document, stop resizing
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handle = document.querySelector('.handle');
    handle.addEventListener('mousedown', handleMouseDown);

    const handleMouseMove = (event) => {
      let scrollBar = 0;
      const panelBox = document.getElementById('panel-box');
      // get the box's padding
      const style = window.getComputedStyle(panelBox);
      const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

      const root = document.getElementById('root');
      if (root.scrollHeight > root.clientHeight) {
        scrollBar = 6;
      }
      const resizableBox = document.getElementById("resizableBox");
      // Calculate the new width based on cursor position
      const newWidth = window.innerWidth - event.clientX - 25;
      // setPanelWidth(newWidth);
      if (newWidth > window.innerWidth - padding - 15 - scrollBar) {
        resizableBox.style.width = `${window.innerWidth - padding - 15 - scrollBar}px`;
        return;
      }
      resizableBox.style.width = `${newWidth}px`;
    };

    const handleMouseUp = () => {
      // Remove the event listeners when mouse is released
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    return () => {
      // Clean up the event listeners when the component is unmounted
      handle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const [cIdx, setCIdx] = useState(0);
  const [values, setValues] = useState([]);
  const [originalValues, setOriginalValues] = useState([]);
  const [data, setData] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    let filePath = events[eIdx].cadaFile.path;
    if (filePath.startsWith("data/")) {
      filePath = filePath.replace("data/", "");
    }
    axios({
      method: "get",
      url: `/api/cada/file/json?filename=${encodeURIComponent(filePath)}`,
    })
      .then(res => {
        setData(res.data);
        const annotation = filterMostRecentByField(events[eIdx].cadaAnnotations[0].cadaAnnotationValues);
        const currValues = {};
        for (let v of annotation) {
          currValues[parseInt(v.field)] = JSON.parse(v.value);
        }
        setValues(currValues);
        setOriginalValues(currValues);
      })
  }, [eIdx, events]);

  const canSave = () => {
    if (!values?.[cIdx])
      return false;
    if (isEqual(values[cIdx], originalValues[cIdx]))
      return false;
    if (Object.keys(values[cIdx]).length === 0)
      return false;

    for (const formField of form.formFields) {
      if (formField.required && !values[cIdx]?.[formField.id]) {
        // if it's required but no value detected
        // check if the triggers are not met
        // if so, we don't care about the required field
        let triggered = true;
        for (const trigger of formField.triggers) {
          if (values[cIdx]?.[trigger.id] !== trigger.formFieldTrigger.condition) {
            triggered = false;
          }
        }

        // if triggered is false, we don't care about the required field
        // if triggered is true, return false
        if (triggered) {
          return false;
        }
      }
    }

    return true;
  };

  const handlePrev = () => {
    if (cIdx === 0) {
      setEIdx(curr => curr - 1);
      return;
    }
    setCIdx(curr => curr - 1);
  };

  const handleNext = () => {
    if (canSave())
      handleSave();

    if (cIdx === data?.info?.length - 1) {
      setEIdx(curr => curr + 1);
      setCIdx(0);
      return;
    }

    setCIdx(curr => curr + 1);
  };

  const handleSave = () => {
    if (!canSave())
      return;

    dispatch(
      updateAnnotation(project.id, events[eIdx].id, true, {
        field: cIdx.toString(),
        value: JSON.stringify(values[cIdx]),
        cadaAnnotationId: events[eIdx].cadaAnnotations[0].id,
        createdAt: new Date(new Date().toUTCString()).toISOString(),
        isComplete: true,
      })
    );
    setOriginalValues(values);
  };

  const onConceptChange = (conceptIdx) => {
    setCIdx(conceptIdx);
  }

  return (
    <>
      <Box id="panel-box" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container direction="row">
          <Grid item xs sx={{
            overflow: 'hidden',
            height: "calc(100vh - 250px)",
            overflowY: "scroll",
            backgroundColor: "white",
            padding: "0 1rem",
          }}>
            <DataPanel
              type={type}
              data={data}
              values={values}
              title={events[eIdx].cadaFile.path.split("/")[events[eIdx].cadaFile.path.split("/").length - 1]}
              onConceptChange={onConceptChange}
              selectedWord={cIdx}
            />
          </Grid>
          <Grid item>
            <div className="handle">
              <div className="knob"></div>
            </div>
          </Grid>
          <Grid item>
            <Box
              id="resizableBox"
              position="relative"
              sx={{
                height: "calc(100vh - 250px)",
                overflowY: "scroll",
                scrollbarWidth: "none",
                width: "550px",
              }}
            >
              <Paper
                sx={{
                  py: 1,
                  px: 2,
                  mb: 2,
                  color: theme.palette.text.secondary,
                  position: "sticky",
                  borderBottom: "1px solid #dfe6e9",
                  top: 0,
                  zIndex: 100,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>
                    <span>{cIdx + 1}</span>
                    {" of " + data?.info?.length}
                  </Typography>
                  <div className="btns">
                    {canSave() && <Button variant='contained' color='error' onClick={() => setValues(originalValues)}>Cancel</Button>}
                    <Button variant='contained' color="secondary" disabled={eIdx === 0 && cIdx === 0} onClick={handlePrev} >Prev</Button>
                    {canSave() && <Button variant='contained' disabled={isEqual(values, originalValues)} onClick={handleSave}>Save</Button>}
                    <Button variant='contained' onClick={handleNext}>{`${canSave() ? "Save & " : ""}Next`}</Button>
                  </div>
                </Stack>
              </Paper>
              <Form
                eIdx={eIdx}
                form={form}
                values={values?.[cIdx] || {}}
                setValues={(v) => setValues(curr => ({ ...curr, [cIdx]: v }))}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <style>
        {`
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          ::-webkit-scrollbar-track {
            background: transparent;
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.15);
            border-radius: 5px;
            transition: 0.3s;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.4);
          }

          .MuiButton-root {
            margin-left: 0.6rem;
          }

          .handle {
            display: flex;
            justify-content: center;
            width: 15px;
            height: calc(100vh - 250px);
            background-color: transparent;
            cursor: ew-resize;
            z-index: 100;
          }

          .handle .knob {
            align-self: center;
            width: 40%;
            height: 15%;
            background-color: #a4b0be;
            border-radius: 10px;
          }
        `}
      </style>
    </>
  )
}
