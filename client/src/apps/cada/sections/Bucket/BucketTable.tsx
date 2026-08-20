import React, { useEffect, useState } from 'react';
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
  Input,
  Dialog,
} from "@mui/material";

import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import { FolderIcon, FileIcon } from "../../common/Icons";
import { MdFilterList, MdKeyboardArrowRight, MdVisibility } from "react-icons/md";
import AssignDialog from "./AssignFileDialog";
import FilePreview from "./FilePreview";
import * as filesApi from "../../api/files";
import * as eventsApi from "../../api/events";
import type { BucketFile } from "../../types";

function descendingComparator(a: BucketFile, b: BucketFile, orderBy: keyof BucketFile) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator(order: Order, orderBy: keyof BucketFile) {
  return order === "desc"
    ? (a: BucketFile, b: BucketFile) => descendingComparator(a, b, orderBy)
    : (a: BucketFile, b: BucketFile) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: BucketFile[], comparator: (a: BucketFile, b: BucketFile) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [BucketFile, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "Name", numeric: false, disablePadding: false, label: "Name" },
  { id: "Type", numeric: false, disablePadding: true, label: "Type" },
  { id: "Path", numeric: false, disablePadding: false, label: "Path" },
  { id: "Ext", numeric: false, disablePadding: false, label: "Ext" },
  { id: "Actions", numeric: false, disablePadding: true, label: "" },
];

interface EnhancedTableHeadProps {
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  numSelected: number;
  fileCount: number;
  onRequestSort: (event: React.MouseEvent, property: string) => void;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    fileCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: string) => (event: React.MouseEvent) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="secondary"
            size="small"
            indeterminate={numSelected > 0 && numSelected < fileCount}
            checked={fileCount > 0 && numSelected === fileCount}
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
  onFilterClick: (updater: (curr: BucketFile[]) => BucketFile[]) => void;
  reset: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, onAssignClick, onFilterClick, reset } = props;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleFilterClick = () => {
    const fromInt = Number(from);
    const toInt = Number(to);
    if (!Number.isInteger(fromInt) || !Number.isInteger(toInt) || fromInt > toInt) {
      return;
    }

    onFilterClick((curr) => curr.slice(fromInt - 1, toInt));
  }

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
        >
          Buckets
        </Typography>
      )}

      {numSelected > 0 ? (
        <FormControlLabel
          onClick={onAssignClick}
          style={{ paddingRight: 10, fontSize: 10 }}
          control={
            <MdKeyboardArrowRight
              name="adj"
              value="adjudicate"
              size={25}
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
        <>
          <div style={{ display: "flex" }}>
            <Typography
              sx={{ lineHeight: "32px", marginRight: 1 }}
              variant="body1"
              component="div"
            >
              From
            </Typography>
            <Input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <Typography
              sx={{ lineHeight: "32px", marginRight: 1, marginLeft: 1 }}
              variant="body1"
              component="div"
            >
              to
            </Typography>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <Tooltip title="Filter list">
            <IconButton onClick={handleFilterClick}>
              <MdFilterList />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset">
            <IconButton onClick={reset}>
              <MdFilterList />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  );
}

interface EnhancedTableProps {
  path: string;
  paths: BucketFile[];
  handleClickDir: (name: string) => void;
}

function EnhancedTable({ path, paths, handleClickDir }: EnhancedTableProps) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState("Id");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [dense, _setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currPaths, setCurrPaths] = useState(paths);

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [fileType, setFileType] = useState("");
  const [fileInfo, setFileInfo] = useState("");
  const [project, setProject] = useState(1);
  const [previewPath, setPreviewPath] = useState("");

  // Sync currPaths when paths prop changes (directory navigation)
  useEffect(() => {
    setCurrPaths(paths);
    setSelected([]);
    setPage(0);
  }, [paths]);

  const fileCount = currPaths.filter((p) => p.type === "file").length;

  const handleRequestSort = (_event: React.MouseEvent, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = currPaths
        .filter((p) => p.type === "file")
        .map((p) => p.path);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent, filePath: string) => {
    const selectedIndex = selected.indexOf(filePath);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, filePath];
    } else {
      newSelected = selected.filter((s) => s !== filePath);
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

  const handleAssign = async () => {
    try {
      const selectedFiles = selected.map(filePath => {
        const ext = filePath.split(".").pop() || "";
        return {
          path: `${path}/${filePath}`,
          type: fileType,
          info: fileInfo,
          ext,
        };
      });
      const cadaFiles = await filesApi.createBatch(selectedFiles);
      await eventsApi.createFromFiles(project, cadaFiles.map((f) => f.id));

      setAssignDialogOpen(false);
      setSelected([]);
    } catch (err) {
      console.error("Error assigning files: ", err);
    }
  };

  const isSelected = (filePath: string) => selected.indexOf(filePath) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, currPaths.length - page * rowsPerPage);

  return (
    <div>
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
      >
        <AssignDialog
          fileType={fileType}
          setFileType={setFileType}
          fileInfo={fileInfo}
          setFileInfo={setFileInfo}
          project={project}
          setProject={setProject}
          handleClose={() => setAssignDialogOpen(false)}
          handleAssign={handleAssign}
        />
      </Dialog>
      <FilePreview
        open={!!previewPath}
        onClose={() => setPreviewPath("")}
        filePath={previewPath}
      />
      <Paper>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onAssignClick={() => setAssignDialogOpen(true)}
          onFilterClick={setCurrPaths}
          reset={() => setCurrPaths(paths)}
        />
        <TableContainer>
          <Table
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
              fileCount={fileCount}
            />
            <TableBody>
              {currPaths && currPaths.length > 0 &&
                stableSort(currPaths, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const isItemSelected = row.type === "file" && isSelected(row.path);
                    const labelId = `enhanced-table-checkbox-${row.path}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => row.type === "file" ? handleClick(event, row.path) : handleClickDir(row.path)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.path}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            size="small"
                            checked={isItemSelected}
                            disabled={row.type !== "file"}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            {row.type === "file" ? <FileIcon /> : <FolderIcon style={{ marginRight: 5 }} />} {row.path}
                          </div>
                        </TableCell>
                        <TableCell padding="none">{row.type === 'dir' ? 'folder' : 'file'}</TableCell>
                        <TableCell>{path}</TableCell>
                        <TableCell>{row.path.split(".").pop()}</TableCell>
                        <TableCell padding="none">
                          {row.type === "file" && (
                            <Tooltip title="Preview">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewPath(path ? `${path}/${row.path}` : row.path);
                                }}
                              >
                                <MdVisibility size={18} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
              }
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
          count={currPaths.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <style>
        {`
        .MuiTableCell-body {
          user-select: none;
        }

        .MuiInput-input {
          width: 40px;
          margin: 0 5px;
        }
      `}
      </style>

    </div>
  );
}

export default EnhancedTable;
