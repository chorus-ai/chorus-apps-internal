import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormLabel,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { filterMostRecentByField } from "../../../utils/annotation_helper";
import FormBuilder from "../../../common/Form/FormBuilder";
import ResizablePaper from "../../../common/ResizablePaper";
import { useAppSelector } from "../../../../../hooks/redux";
import { useSaveAdjudication } from "../../../hooks";
import * as filesApi from "../../../api/files";
import type { CadaEvent, ProjectWithRoles, FileJsonData, FormSummary, FormField, CadaAnnotation, ConceptFormValues, FormValues } from "../../../types";

interface SelectedProps {
  project: ProjectWithRoles;
  events: CadaEvent[];
}

export default function Selected({ project, events }: SelectedProps) {
  const [eIdx, setEIdx] = useState(0);
  const [data, setData] = useState<FileJsonData>({});
  const [values, setValues] = useState<ConceptFormValues>({});
  const [cIdx, setCIdx] = useState(0);
  const saveAdjudication = useSaveAdjudication();
  const user = useAppSelector((state) => state.main.user);

  const event = events[eIdx];
  const info = data?.info;
  const metadata = data?.metadata;
  const form = project?.forms?.length > 0
    ? project.forms.sort((a: FormSummary, b: FormSummary) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())[0]
    : null;

  // Load file data and existing adjudication values
  useEffect(() => {
    if (!event) return;

    let filePath = event.cadaFile.path;
    if (filePath.startsWith("data/")) {
      filePath = filePath.replace("data/", "");
    }

    filesApi.getJson(filePath)
      .then(res => {
        setData(res);
        // Load existing adjudication values if any
        if (event.cadaAdjudicationValues?.length > 0) {
          const adjValues: ConceptFormValues = {};
          const recentByField = filterMostRecentByField(event.cadaAdjudicationValues);
          for (const v of recentByField) {
            adjValues[parseInt(v.field)] = JSON.parse(v.value) as FormValues;
          }
          setValues(adjValues);
        } else {
          setValues({});
        }
      })
      .catch(err => console.error("Failed to load file:", err));

    setCIdx(0);
  }, [eIdx, event]);

  // Get all annotators' values for current concept, grouped by field
  const getAnnotatorResponses = () => {
    if (!event?.cadaAnnotations) return [];

    return event.cadaAnnotations.map((annotation: CadaAnnotation) => {
      const userName = annotation.user
        ? `${annotation.user.firstName} ${annotation.user.lastName}`
        : `User ${annotation.userId}`;

      const mostRecent = filterMostRecentByField(annotation.cadaAnnotationValues || []);
      const fieldValues: Record<string, FormValues> = {};
      for (const v of mostRecent) {
        if (parseInt(v.field) === cIdx) {
          fieldValues[v.field] = JSON.parse(v.value) as FormValues;
        }
      }

      return {
        userName,
        userId: annotation.userId,
        completed: annotation.completed,
        values: fieldValues[cIdx.toString()] || {},
      };
    });
  };

  const handleSave = () => {
    if (!values[cIdx] || Object.keys(values[cIdx]).length === 0) return;

    saveAdjudication.mutate({
      projectId: project.id,
      eventId: event.id,
      completed: true,
      adjudication: {
        field: cIdx.toString(),
        value: JSON.stringify(values[cIdx]),
        userId: user.id as number,
        cadaEventId: event.id,
      },
    });
  };

  const handlePrev = () => {
    if (cIdx > 0) {
      setCIdx(cIdx - 1);
    } else if (eIdx > 0) {
      setEIdx(eIdx - 1);
    }
  };

  const handleNext = () => {
    if (info && cIdx < info.length - 1) {
      setCIdx(cIdx + 1);
    } else if (eIdx < events.length - 1) {
      setEIdx(eIdx + 1);
      setCIdx(0);
    }
  };

  const annotatorResponses = getAnnotatorResponses();

  if (!event) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Typography>No events selected for adjudication.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      {/* Navigation bar */}
      <Paper sx={{ p: 1, px: 2, mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body1">
          Event {eIdx + 1} of {events.length}
          {info && ` | Concept ${cIdx + 1} of ${info.length}`}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="secondary"
            disabled={eIdx === 0 && cIdx === 0}
            onClick={handlePrev}
          >
            Prev
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={eIdx === events.length - 1 && (!info || cIdx === info.length - 1)}
          >
            Next
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        {/* Left side - Data display */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ height: "calc(100vh - 300px)", overflowY: "auto", p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {event.cadaFile?.path?.split("/").pop()}
            </Typography>
            {info?.[cIdx]?.metadata && Object.entries(info[cIdx].metadata!).map(([key, value], index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {key}:
                </Typography>
                <Typography variant="body2">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </Typography>
              </Box>
            ))}
            {metadata && Object.entries(metadata).map(([key, value], index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {key}:
                </Typography>
                <Typography variant="body2">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Right side - Annotator responses + Adjudication form */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ height: "calc(100vh - 300px)", overflowY: "auto", p: 2 }}>
            {/* Annotator responses section */}
            <Typography variant="h6" gutterBottom>
              Annotator Responses
            </Typography>

            {annotatorResponses.length > 0 && form?.formFields ? (
              <Box sx={{ mb: 3 }}>
                {form.formFields.map((field: FormField) => {
                  const responses = annotatorResponses
                    .filter((r) => r.values[field.id] !== undefined)
                    .map((r) => ({
                      name: r.userName,
                      value: r.values[field.id],
                    }));

                  if (responses.length === 0) return null;

                  return (
                    <Box key={field.id} sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 'bold' }}>
                        {field.label}
                      </FormLabel>
                      <Box sx={{ mt: 0.5 }}>
                        {responses.map((r, i: number) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip
                              size="small"
                              label={r.name}
                              variant="outlined"
                              sx={{ minWidth: 100 }}
                            />
                            <Typography variant="body2">
                              {typeof r.value === 'object' ? JSON.stringify(r.value) : String(r.value)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No annotator responses available.
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Adjudication form */}
            <Typography variant="h6" gutterBottom>
              Your Adjudication
            </Typography>

            {form ? (
              <FormBuilder
                form={form}
                values={values[cIdx] || {}}
                setValues={(v: FormValues) => setValues((curr) => ({ ...curr, [cIdx]: v }))}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No form associated with this project.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
