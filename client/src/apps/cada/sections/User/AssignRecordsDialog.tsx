import React, { useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Toolbar,
  Tooltip,
  Checkbox,
  FormControlLabel,
  IconButton,
  Box,
  Chip,
  Switch,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import { MdFilterList as FilterListIcon } from "react-icons/md";
import { createTheme } from "@mui/material/styles";
import * as eventsApi from "../../api/events";
import type { CadaEvent, CadaAnnotation } from "../../types";

const theme = createTheme();

type Order = 'asc' | 'desc';

const useStyles = {
  root: {
    minWidth: 800,
    padding: theme.spacing(2),
  },
  paper: {
    width: "100%",
  },
  table: {
    minWidth: 800,
  },
};

function descendingComparator<T extends Record<string, unknown>>(a: T, b: T, orderBy: string) {
  if ((b[orderBy] ?? '') < (a[orderBy] ?? '')) {
    return -1;
  }
  if ((b[orderBy] ?? '') > (a[orderBy] ?? '')) {
    return 1;
  }
  return 0;
}

function getComparator<T extends Record<string, unknown>>(order: Order, orderBy: string): (a: T, b: T) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "id", numeric: false, disablePadding: true, label: "ID" },
  { id: "path", numeric: false, disablePadding: false, label: "File" },
  { id: "assignees", numeric: false, disablePadding: false, label: "Assigned To" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
];

interface EnhancedTableHeadProps {
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  numSelected: number;
  rowCount: number;
  onRequestSort: (event: React.MouseEvent<HTMLElement>, property: string) => void;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: string) => (event: React.MouseEvent<HTMLElement>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="secondary"
            size="small"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all records",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  onAssignClick: () => void;
}

const EnhancedTableToolbar = ({ numSelected, onAssignClick }: EnhancedTableToolbarProps) => {

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.secondary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Records
        </Typography>
      )}

      {numSelected > 0 ? (
        <FormControlLabel
          onClick={onAssignClick}
          style={{ paddingRight: 10, fontSize: 10 }}
          control={
            <Button
              sx={{ flex: "1 1 100%" }}
              color="secondary"
              variant="contained"
            >
              Assign
            </Button>
          }
          label={""}
          labelPlacement="start"
        />
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

interface EnhancedTableProps {
  userId: number;
  projectId: number;
  handleClose: () => void;
}

function EnhancedTable({ userId, projectId, handleClose }: EnhancedTableProps) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showOnlyUnassigned, setShowOnlyUnassigned] = React.useState(true);
  const [files, setFiles] = React.useState<CadaEvent[]>([]);

  useEffect(() => {
    const getFiles = async (id: number) => {
      const allEvents = await eventsApi.getAllPaginated(id);

      const sorted = allEvents.sort((a: CadaEvent, b: CadaEvent) => {
        const getNumber = (path: string | undefined) => {
          const match = path?.match(/(\d+)\.json$/);
          return match ? parseInt(match[1], 10) : 0;
        };
        return getNumber(a.cadaFile?.path) - getNumber(b.cadaFile?.path);
      });
      setFiles(sorted);
    };

    if (projectId !== 0) {
      getFiles(projectId);
    }
  }, [projectId]);

  const isAssignedToUser = (event: CadaEvent) => {
    return event.cadaAnnotations?.some((a: CadaAnnotation) => a.userId === userId);
  };

  const getAssignees = (event: CadaEvent) => {
    if (!event.cadaAnnotations || event.cadaAnnotations.length === 0) return [];
    return event.cadaAnnotations.map((a: CadaAnnotation) => ({
      userId: a.userId,
      completed: a.completed,
      userName: a.user ? `${a.user.firstName} ${a.user.lastName}` : `User ${a.userId}`,
    }));
  };

  const displayedFiles = showOnlyUnassigned
    ? files.filter((f: CadaEvent) => !isAssignedToUser(f))
    : files;

  const handleRequestSort = (_event: React.MouseEvent<HTMLElement>, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = displayedFiles
        .filter((f: CadaEvent) => !isAssignedToUser(f))
        .map((n: CadaEvent) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<HTMLTableRowElement>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((s) => s !== id);
    }

    setSelected(newSelected);
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAssignClick = async () => {
    try {
      await eventsApi.assignToUser(userId, selected);
      handleClose();
    } catch (err) {
      console.error("Assignment failed:", err);
    }
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, displayedFiles.length - page * rowsPerPage);

  return (
    <div style={{ ...useStyles.root }}>
      {projectId !== 0 && (
        <Paper style={{ ...useStyles.paper }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            onAssignClick={handleAssignClick}
          />
          <Box sx={{ px: 2, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={showOnlyUnassigned}
                  onChange={(e) => {
                    setShowOnlyUnassigned(e.target.checked);
                    setSelected([]);
                    setPage(0);
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  Show only unassigned events
                </Typography>
              }
            />
            <Typography variant="body2" color="text.secondary">
              {displayedFiles.length} of {files.length} events
            </Typography>
          </Box>
          <TableContainer>
            <Table
              style={{ ...useStyles.table }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={displayedFiles.filter((f: CadaEvent) => !isAssignedToUser(f)).length}
              />
              <TableBody>
                {stableSort(displayedFiles, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: CadaEvent, index: number) => {
                    const alreadyAssigned = isAssignedToUser(row);
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const assignees = getAssignees(row);

                    return (
                      <TableRow
                        hover
                        onClick={(event) => !alreadyAssigned && handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ opacity: alreadyAssigned ? 0.5 : 1 }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            disabled={alreadyAssigned}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.id}
                        </TableCell>
                        <TableCell>{row.cadaFile.path}</TableCell>
                        <TableCell>
                          {assignees.length > 0 ? (
                            assignees.map((a: { userId: number; completed: boolean; userName: string }, i: number) => (
                              <Chip
                                key={i}
                                size="small"
                                label={a.userName}
                                color={a.completed ? "success" : "default"}
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">Unassigned</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {alreadyAssigned ? (
                            <Chip size="small" label="Assigned" color="info" />
                          ) : (
                            <Chip size="small" label="Available" variant="outlined" />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={displayedFiles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </div>
  );
}

export default EnhancedTable;
