import React, { useState } from "react";
import {
  AppBar,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Paper,
  TablePagination,
  Tabs,
  Tab,
  InputBase,
  FormControl,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { BiSearchAlt } from "react-icons/bi";
import Row from "../sections/User/UserTableRow";
import NewUser from "../sections/User/NewUser";
import { PlusIcon } from "../common/Icons";
import { useUsers, useRemoveUser } from "../hooks";
import type { User as CadaUser } from "../types";

// ----------------------------------------------------------------------

const Search = styled(FormControl)(({ theme }) => ({
  position: "relative",
  fontSize: theme.typography.fontSize,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  display: "flex",
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

// ----------------------------------------------------------------------

export default function User() {
  const { users } = useUsers();
  const removeUser = useRemoveUser();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchKey, setSearchKey] = useState("");

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(event.target.value);
    setPage(0);
  };

  const handleRemoveClick = (id: number) => {
    removeUser.mutate(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filteredUsers = users.filter((data: CadaUser) =>
    JSON.stringify(data).toLowerCase().includes(searchKey.toLowerCase()),
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <div>
      {open && <NewUser open={open} handleClose={handleClose} />}
      <AppBar component="div" sx={{ px: 1 }} position="static" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h6" component="h1">
                Users
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="inherit" size="small">
                Report
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar sx={{ pl: 1 }} component="div" position="static" elevation={0}>
        <Tabs value={value} onChange={handleChange}>
          <Tab disableRipple label="Overview" />
        </Tabs>
      </AppBar>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar
              sx={{ bgcolor: "rgba(0, 0, 0, 0)", mt: 7, mb: 3 }}
              position="static"
              color="inherit"
              elevation={0}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Search>
                    <SearchIconWrapper>
                      <BiSearchAlt />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search anything"
                      value={searchKey}
                      onChange={handleSearch}
                      inputProps={{ "aria-label": "search" }}
                    />
                  </Search>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleClickOpen}
                    variant="contained"
                    color="primary"
                    startIcon={<PlusIcon />}
                  >
                    New User
                  </Button>
                </Grid>
              </Grid>
            </AppBar>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ p: 2 }}>
          <Table size="small" aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>LoginType</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Detail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((row: CadaUser) => (
                <Row
                  key={row.id}
                  row={row}
                  handleRemoveClick={handleRemoveClick}
                />
              ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 30]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Container>
    </div>
  );
}