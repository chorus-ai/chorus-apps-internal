import React, { useEffect } from "react";
import { alpha } from "@mui/material/styles";
import {
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
} from "@mui/material";

import { visuallyHidden } from "@mui/utils";
import axios from "axios";

import { createTheme } from "@mui/material/styles";
import { MdKeyboardArrowRight, MdFilterList } from "react-icons/md";

const theme = createTheme();

const useStyles = {
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
  },
  table: {
    minWidth: 800,
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
  addUserButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  searchBar: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    marginTop: theme.spacing(5),
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  searchIcon: {
    marginLeft: theme.spacing(2),
    color: "rgba(0, 0, 0, 0.5)",
    display: "block",
  },
  tableHeader: {
    paddingTop: 10,
  },
  userTable: {},
  projectTable: {
    marginLeft: theme.spacing(5),
  },
};

type Order = 'asc' | 'desc';

interface FileRecord {
  id: number;
  Type?: string;
  Ext?: string;
  path: string;
}

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
  { id: "Id", numeric: false, disablePadding: true, label: "Id" },
  { id: "Type", numeric: true, disablePadding: false, label: "Type" },
  { id: "Ext", numeric: true, disablePadding: false, label: "Ext" },
  { id: "Path", numeric: true, disablePadding: false, label: "Path" },
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
            align={headCell.numeric ? "right" : "left"}
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
          variant="body1"
          id="tableTitle"
          component="div"
        ></Typography>
      )}

      {numSelected > 0 ? (
        <FormControlLabel
          onClick={onAssignClick}
          style={{ paddingRight: 10, fontSize: 10 }}
          control={
            <MdKeyboardArrowRight
              name="adj"
              value="adjudicate"
              fontSize="small"
            />
          }
          label={
            <Typography
              style={{ flex: "1 1 100%" }}
              color="inherit"
              variant="body1"
              component="div"
            >
              Assign
            </Typography>
          }
          labelPlacement="start"
        />
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <MdFilterList />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

interface EnhancedTableProps {
  projectId: number;
  handleNeedEventsDialogClose: () => void;
  getEventsCount: (pid: number, count: number) => void;
}

function EnhancedTable({
  projectId,
  handleNeedEventsDialogClose,
  getEventsCount,
}: EnhancedTableProps) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState("Id");
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [search, _setSearch] = React.useState("");
  const [files, setFiles] = React.useState<FileRecord[]>([]);

  useEffect(() => {
    const geiles = async (search: string) => {
      console.log(`/api/cada/file?search=${search}`);
      const result = await axios(`/api/cada/file?search=${search}`);
      console.log(result);
      setFiles(result.data);
    };

    if (files.length === 0) {
      geiles(search);
    }
  }, []);

  const handleRequestSort = (_event: React.MouseEvent<HTMLElement>, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = files.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<HTMLTableRowElement>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
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

  const handleAssignClick = () => {
    console.log("selected: ", selected);
    console.log("projectId: ", projectId);
    const geiles = async (_search: number[]) => {
      console.log(`/api/cada/event?pid=${projectId}`);
      const result = await axios.post(
        `/api/cada/event?pid=${projectId}`,
        selected
      );
      console.log(result);
      if (result.status === 200) {
        getEventsCount(projectId, result.data.length);
        handleNeedEventsDialogClose();
      }
    };

    geiles(selected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, files.length - page * rowsPerPage);

  return (
    <div style={{ ...useStyles.root }}>
      <Paper style={{ ...useStyles.paper }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onAssignClick={handleAssignClick}
        />
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
              rowCount={files.length}
            />
            <TableBody>
              {stableSort(files, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: FileRecord, index: number) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
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
                      <TableCell align="right">{row.Type}</TableCell>
                      <TableCell align="right">{row.Ext}</TableCell>
                      <TableCell align="left">{row.path}</TableCell>
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
          count={files.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default EnhancedTable;
