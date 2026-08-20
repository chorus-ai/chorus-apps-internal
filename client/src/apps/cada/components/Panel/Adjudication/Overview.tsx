import React, { useState } from "react";
import {
  Paper,
  Toolbar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Chip,
  Container,
} from "@mui/material";
import { MdCheck, MdRemove } from "react-icons/md";
import type { ProjectWithRoles, CadaEvent, CadaAnnotation } from "../../../types";

interface OverviewProps {
  project: ProjectWithRoles;
  events: CadaEvent[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  handleClickAdjudicate: () => void;
}

export default function Overview({ project, events, selectedIds, setSelectedIds, handleClickAdjudicate }: OverviewProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(events.map((ev: CadaEvent) => ev.id));
      return;
    }
    setSelectedIds([]);
  };

  const handleCheckboxClick = (id: number) => {
    setSelectedIds((prev: number[]) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isSelected = (id: number) => selectedIds.includes(id);

  const isAdjudicated = (event: CadaEvent) => {
    return event.cadaAdjudicationValues && event.cadaAdjudicationValues.length > 0;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Paper>
        <Toolbar
          sx={{
            pl: 2,
            pr: 1,
          }}
        >
          {selectedIds.length > 0 ? (
            <>
              <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1">
                {selectedIds.length} selected
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickAdjudicate}
              >
                Adjudicate
              </Button>
            </>
          ) : (
            <Typography sx={{ flex: "1 1 100%" }} variant="h6">
              Completed Events
            </Typography>
          )}
        </Toolbar>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    indeterminate={selectedIds.length > 0 && selectedIds.length < events.length}
                    checked={events.length > 0 && selectedIds.length === events.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Event ID</TableCell>
                <TableCell>File</TableCell>
                <TableCell align="center">Annotators</TableCell>
                <TableCell align="center">Completed</TableCell>
                <TableCell align="center">Adjudicated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((event: CadaEvent) => {
                  const selected = isSelected(event.id);
                  const annotations = event.cadaAnnotations || [];
                  const completed = annotations.filter((a: CadaAnnotation) => a.completed).length;
                  const adjudicated = isAdjudicated(event);

                  return (
                    <TableRow
                      key={event.id}
                      hover
                      role="checkbox"
                      aria-checked={selected}
                      selected={selected}
                      onClick={() => handleCheckboxClick(event.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox size="small" checked={selected} />
                      </TableCell>
                      <TableCell>{event.id}</TableCell>
                      <TableCell>{event.cadaFile?.path}</TableCell>
                      <TableCell align="center">{annotations.length}</TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={`${completed}/${annotations.length}`}
                          color={completed === annotations.length ? "success" : "warning"}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {adjudicated ? (
                          <MdCheck color="green" size={20} />
                        ) : (
                          <MdRemove color="gray" size={20} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
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
      </Paper>
    </Container>
  );
}
