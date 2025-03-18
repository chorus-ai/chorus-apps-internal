import React, { useState, useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import {
  getUsers,
  getProjects,
  addUser,
  removeUser,
  removeProjectUser,
} from "../../cada/redux/actions";
import { styled, alpha } from "@mui/material/styles";
import { BiSearchAlt } from "react-icons/bi";
import Row from "../sections/User/UserRow";
import NewUser from "../sections/User/NewUser";
import { PlusIcon } from "../common/Icons";

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

function User() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.cada.users);
  const projects = useSelector((state) => state.cada.projects);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    if (projects.length === 0) dispatch(getProjects());
  }, [projects, dispatch]);

  useEffect(() => {
    if (users.length === 0) dispatch(getUsers({ fid: 2 }));
  }, [users, dispatch]);

  const handleChange = (_, newValue) => setValue(newValue);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSearch = (event) => setSearchKey(event.target.value);

  return (
    <div>
      {open && <NewUser open={open} handleClose={handleClose} />}

      <Container maxWidth="xl">
        <AppBar component="div" sx={{ backgroundColor: "transparent", color: "ButtonText" }} position="static" elevation={0}>
          <Toolbar>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs>
                <Typography color="inherit" variant="h6" component="h2">
                  Users
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <AppBar
          sx={{ backgroundColor: "transparent", color: "ButtonText" }}
          component="div"
          position="static"
          elevation={0}>
          <Tabs value={value} onChange={handleChange}>
            <Tab disableRipple label="Overview" />
          </Tabs>
        </AppBar>

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
                  >
                    <PlusIcon /> User
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
                <TableCell>Username</TableCell>
                <TableCell>Login Type</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Detail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 && 
                users
                .filter((data) => JSON.stringify(data).toLowerCase().includes(searchKey.toLowerCase()))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <Row key={row.id} row={row} handleRemoveClick={() => dispatch(removeUser(row.id))} handleRemoveRoleClick={(payload) => dispatch(removeProjectUser(payload))} />
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 30]}
            component="div"
            count={users.length}
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

export default User;
