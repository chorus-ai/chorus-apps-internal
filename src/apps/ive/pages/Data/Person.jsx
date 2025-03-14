import React, { useEffect } from "react";
import {
  TableContainer,
  TablePagination,
  Paper,
  Icon,
  AppBar,
  Grid,
  InputBase,
  FormControl,
  Container,
  Stack, 
  Typography,
  Toolbar,
  Badge
} from "@mui/material";

import { styled, alpha } from "@mui/material/styles";
import { BiSearchAlt } from "react-icons/bi";
import { MdFilterList, MdOutlineViewColumn } from "react-icons/md";
import axios from "axios";
import { CommonTable } from "../../common/Table";
import { NoData } from "../../common/Nodata";

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

const Table = ({table, total}) => {
  const [searchKey, setSearchKey] = React.useState("");
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const handleSearch = (event) => {
    setSearchKey(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(event.target.value);
  };

  useEffect(() => {
    axios({
      method: "get",
      url: `/api/omop/${table}?page=1&pageSize=10`,
    })
      .then((res) => res.data)
      .then((data) => {
        setData(data);
      });
  }, []);

  useEffect(() => {
    let url = `/api/omop/${table}?page=${page}&pageSize=${pageSize}`;

    if (searchKey) {
      url = `/api/omop/${table}?search=${searchKey}&page=${page}&pageSize=${pageSize}`;
    }

    axios
      .get(url)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, [page, pageSize, table, searchKey]);

  return (
    <Container maxWidth="xl">
       <AppBar
          component="div"
          sx={{ backgroundColor: "transparent", color: "ButtonText" }}
          position="static"
          elevation={0}
        >
          <Toolbar>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs>
                <Typography color="inherit" variant="h6" component="h2">
                  {table.charAt(0).toUpperCase() + table.slice(1)} 
                  <Badge badgeContent={total} max={1000000000} color="primary" sx={{ml: 5}}/>
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AppBar
            sx={{ bgcolor: "rgba(0, 0, 0, 0)", mt: 2, mb: 2, pr: 1 }}
            position="static"
            color="inherit"
            elevation={0}
          >
            <Grid container alignItems="center">
              <Grid item xs>
                <Search>
                  <SearchIconWrapper>
                    <BiSearchAlt />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search with"
                    value={searchKey}
                    onChange={handleSearch}
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={1}>
                  <Icon>
                    <MdFilterList style={{ padding: 1 }} />
                  </Icon>
                  <Icon>
                    <MdOutlineViewColumn />
                  </Icon>
                </Stack>
              </Grid>
            </Grid>
          </AppBar>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ width: "100%"}}>
        {data.length > 0 ? (
          <>
            <div style={{ overflow: "auto" }}>
              <CommonTable
                headers={data ? Object.keys(data[0]) : []}
                data={data}
              />
            </div>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={total}
              rowsPerPage={pageSize}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </>
        ) : (
          <NoData />
        )}
      </TableContainer>
    </Container>
  );
};

export default Table;
