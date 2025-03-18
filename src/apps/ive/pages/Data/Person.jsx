import React, { useEffect, useState } from "react";
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
  Chip,
  CircularProgress
} from "@mui/material";

import { useLocation } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import { BiSearchAlt } from "react-icons/bi";
import { MdFilterList, MdOutlineViewColumn } from "react-icons/md";
import axios from "axios";
import { CommonTable } from "../../common/Table";
import { NoData } from "../../common/Nodata";
import { UtilSidebar } from "../../common/UtilSidebar";

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

const Person = ({ table, total }) => {
  const [searchKey, setSearchKey] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(0); 
  const [openFilter, setOpenFilter] = useState(false);
  const [unCheckedItems, setUnCheckedItems] = useState([]);

  const handleCheckedItem = (item) => {
    console.log('item: ', item);
    if (unCheckedItems.includes(item)) {
      setUnCheckedItems(unCheckedItems.filter((i) => i !== item));
      return;
    } 
    setUnCheckedItems([...unCheckedItems, item]);

  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    if (id) {
      setValue(1); // Automatically switch to the "Details" tab if id is present
      return; // Stop executing because details will be fetched in PersonDetails
    }

    setIsLoading(true);
    setError(null);

    let url = `/api/omop/${table}?page=${page}&pageSize=${pageSize}`;
    if (searchKey) {
      url = `/api/omop/${table}?search=${searchKey}&page=${page}&pageSize=${pageSize}`;
    }

    axios
      .get(url)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [page, pageSize, table, searchKey, id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearch = (event) => {
    setSearchKey(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  console.log('unCheckedItems: ', unCheckedItems);
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
                <Chip
                  color="primary"
                  size="small"
                  sx={{ ml: 1, borderRadius: 3 }}
                  label={total}
                />
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

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
                  placeholder="Search..."
                  value={searchKey}
                  onChange={handleSearch}
                  inputProps={{ "aria-label": "search" }}
                  disabled={isLoading}
                />
              </Search>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={1}>
                <Icon>
                  <MdFilterList style={{ padding: 1 }} />
                </Icon>
                <Icon>
                  <MdOutlineViewColumn  onClick={handleOpenFilter}  />
                </Icon>
              </Stack>
            </Grid>
          </Grid>
        </AppBar>

    <TableContainer component={Paper} sx={{ width: "100%", minHeight: "100px" }}>
      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ height: "400px" }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>Loading data...</Typography>
        </Stack>
      ) : error ? (
        <Typography variant="body1" color="error" sx={{ textAlign: "center", p: 2 }}>
          {error}
        </Typography>
      ) : data.length > 0 ? (
        <>
        
      <div style={{ overflow: "auto" }}>
          <CommonTable
            table={table}
            headers={data ? Object.keys(data[0]) : []}
            data={data}
            columns= {Object.keys(data[0]).filter((item) => !unCheckedItems.includes(item))}
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
            disabled={isLoading}
          />
          <UtilSidebar
            header="Columns"
            footer="Clear All"
            data={Object.keys(data[0])}
            openFilter={openFilter}
            onCloseFilter={handleCloseFilter} 
            handleCheckedItem={handleCheckedItem}      
          />
        </>
      ) : (
        <NoData />
      )}
    </TableContainer>
      
    </Container>
  );
};

export default Person;
