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

import { useLocation, useNavigate } from "react-router-dom";
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

const Detail = ({ table, type, pid }) => {
  const [searchKey, setSearchKey] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [unCheckedItems, setUnCheckedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/omop/${table}/${type}/${pid}`);
        if (!response.data || response.data.length === 0) {
          setData([]); // Ensure data is empty and prevent rendering
          return;
        }
        setData(response.data);
        setFilteredData(response.data); // Initialize filtered data
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [table, pid]);

  useEffect(() => {
    if (!searchKey.trim()) {
      setFilteredData(data);
    } else {
      const lowerSearchKey = searchKey.toLowerCase();
      const filtered = data.filter((row) =>
        Object.values(row).some(
          (value) =>
            value && value.toString().toLowerCase().includes(lowerSearchKey)
        )
      );
      setFilteredData(filtered);
    }
  }, [searchKey, data]);

  const handleCheckedItem = (item) => {
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

  // If there's no data and not loading, prevent rendering the component entirely
  if (!isLoading && data.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <br />
      <Typography color="inherit" variant="h6" component="h2">{table}</Typography>
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
                onChange={(e) => setSearchKey(e.target.value)}
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
                <MdOutlineViewColumn onClick={handleOpenFilter} />
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
        ) : (
          <>
            <div style={{ overflow: "auto" }}>
              <CommonTable
                table={table}
                headers={filteredData.length > 0 ? Object.keys(filteredData[0]) : []}
                data={filteredData}
                columns={filteredData.length > 0 ? Object.keys(filteredData[0]).filter(
                  (item) => !unCheckedItems.includes(item)
                ) : []}
              />
            </div>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={filteredData.length}
              rowsPerPage={pageSize}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setPageSize(parseInt(event.target.value, 10));
                setPage(0);
              }}
              disabled={isLoading}
            />
            <UtilSidebar
              header="Columns"
              footer="Clear All"
              data={data.length > 0 ? Object.keys(data[0]) : []}
              openFilter={openFilter}
              onCloseFilter={handleCloseFilter}
              handleCheckedItem={handleCheckedItem}
            />
          </>
        )}
      </TableContainer>
    </Container>
  );
};

export default Detail;
