import { useEffect, useState } from 'react';
import { Box, Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { MdGetApp } from 'react-icons/md';
import { useAllEvents, useForm } from '../../../hooks';
import type { Project, FormField, FormSummary, CadaEvent, CadaAnnotation, AnnotationValue } from '../../../types';

const csvEscape = (val: unknown) => {
  const str = String(val ?? '');
  return `"${str.replace(/"/g, '""')}"`;
};

const formatAnswer = (val: unknown): string => {
  if (val === null || val === undefined) return '';
  if (Array.isArray(val)) return val.join('; ');
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

export default function Events({ project }: { project: Project | null | undefined }) {

  const { events, isLoading } = useAllEvents(project?.id ?? 0);

  const formId = project?.forms?.length > 0
    ? project.forms.sort((a: FormSummary, b: FormSummary) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      )[0].id
    : null;
  const { form } = useForm(formId);
  const formFields = form?.formFields || [];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleDownloadAll = () => {
    if (events.length === 0) return;

    // Build field ID -> label map
    const fieldMap: Record<string, string> = {};
    formFields.forEach((f: FormField) => { fieldMap[String(f.id)] = f.label; });
    const fieldIds = formFields.map((f: FormField) => String(f.id));

    interface CsvRow {
      eventId: number;
      file: string;
      annotator: string;
      email: string;
      completed: boolean;
      concept: string;
      answers: Record<string, unknown>;
    }

    // Build rows: one row per event per annotator per concept
    const rows: CsvRow[] = [];

    events.forEach((event: CadaEvent) => {
      if (!event.cadaAnnotations || event.cadaAnnotations.length === 0) return;

      event.cadaAnnotations.forEach((annotation: CadaAnnotation) => {
        const userName = annotation.user
          ? `${annotation.user.firstName} ${annotation.user.lastName}`
          : `User ${annotation.userId}`;
        const userEmail = annotation.user?.email || `user-${annotation.userId}`;

        if (!annotation.cadaAnnotationValues || annotation.cadaAnnotationValues.length === 0) {
          rows.push({
            eventId: event.id,
            file: event.cadaFile?.path || '',
            annotator: userName,
            email: userEmail,
            completed: annotation.completed,
            concept: '',
            answers: {},
          });
          return;
        }

        // Group by concept (field index) and take most recent per concept
        const byConcept: Record<string, AnnotationValue> = {};
        annotation.cadaAnnotationValues.forEach((v: AnnotationValue) => {
          if (!byConcept[v.field] || v.id > byConcept[v.field].id) {
            byConcept[v.field] = v;
          }
        });

        Object.entries(byConcept).forEach(([concept, v]) => {
          let parsed: Record<string, unknown> = {};
          try { parsed = JSON.parse(v.value); } catch { parsed = {}; }

          rows.push({
            eventId: event.id,
            file: event.cadaFile?.path || '',
            annotator: userName,
            email: userEmail,
            completed: annotation.completed,
            concept,
            answers: parsed,
          });
        });
      });
    });

    if (rows.length === 0) return;

    // Build CSV with form questions as column headers
    const fixedHeaders = ['EventID', 'File', 'Annotator', 'Email', 'Completed', 'Concept'];
    const questionHeaders = fieldIds.map(id => fieldMap[id] || `Field ${id}`);
    const csvRows = [(fixedHeaders.concat(questionHeaders)).map(csvEscape).join(',')];

    rows.forEach(row => {
      const fixedCols = [
        row.eventId,
        row.file,
        row.annotator,
        row.email,
        row.completed,
        row.concept,
      ];
      const answerCols = fieldIds.map(id => formatAnswer(row.answers[id]));
      csvRows.push(fixedCols.concat(answerCols).map(csvEscape).join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name || 'project'}-annotations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalAnnotations = events.reduce((sum: number, e: CadaEvent) =>
    sum + (e.cadaAnnotations?.length || 0), 0);
  const completedAnnotations = events.reduce((sum: number, e: CadaEvent) =>
    sum + (e.cadaAnnotations?.filter((a) => a.completed)?.length || 0), 0);

  return (
    <>
      <Paper
        sx={{
          p: 2,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5">
            {events.length} Events
          </Typography>
          <Chip label={`${completedAnnotations}/${totalAnnotations} annotations completed`} color="primary" size="small" />
        </Box>
        <Button
          variant="outlined"
          startIcon={<MdGetApp />}
          onClick={handleDownloadAll}
          disabled={events.length === 0}
        >
          Download All Annotations
        </Button>
      </Paper>

      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Annotators</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((event: CadaEvent) => {
                const annotations = event.cadaAnnotations || [];
                const completed = annotations.filter((a) => a.completed).length;
                const total = annotations.length;

                return (
                  <TableRow key={event.id}>
                    <TableCell>{event.id}</TableCell>
                    <TableCell>{event.cadaFile?.path}</TableCell>
                    <TableCell>
                      {annotations.map((a: CadaAnnotation, i: number) => (
                        <Chip
                          key={i}
                          size="small"
                          label={a.user ? `${a.user.firstName} ${a.user.lastName}` : `User ${a.userId}`}
                          color={a.completed ? "success" : "default"}
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {total === 0 && (
                        <Typography variant="body2" color="text.secondary">Unassigned</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {total > 0 ? (
                        <Chip
                          size="small"
                          label={`${completed}/${total}`}
                          color={completed === total ? "success" : "warning"}
                        />
                      ) : (
                        <Chip size="small" label="No assignments" variant="outlined" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={events.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_e, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </>
  )
};
