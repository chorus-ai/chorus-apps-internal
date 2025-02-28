import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  TableCell, 
  Paper,
  Icon,
  AppBar,
  Grid,
  InputBase,
  FormControl,
  Container,
  Stack
} from "@mui/material";

import { tableCellClasses } from '@mui/material/TableCell';
import { styled, alpha } from "@mui/material/styles";
import { BiSearchAlt } from "react-icons/bi";
import { MdOutlineWidthWide, MdFilterList } from "react-icons/md";

import axios from "axios";

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
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.common.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.secondary.light, 0.10),
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 'solid 1',
  },
}));


const PersonTable = () => {
  const [searchKey, setSearchKey] = React.useState('');
  const [data, setData] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [fullWidth, setFullWidth] = React.useState(false);

  const handleSearch = (event) => {
    setSearchKey(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  }

  const handleRowsPerPageChange = (event) => {
    setPageSize(event.target.value);
  }

  useEffect(() => {
    axios({
      method: "get",
      url: `/api/omop/person?page=${page}&pageSize=${pageSize}`,
    }).then((res) => res.data)
    .then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    if (searchKey === "" || searchKey === 0) {
      axios({
        method: "get",
        url: `/api/omop/person?page=${page}&pageSize=${pageSize}`,
      }).then((res) => res.data)
      .then((data) => {
        setData(data);
      });
    } else {
      axios({
        method: "get",
        url: `/api/omop/person/concept/${searchKey}`,
      }).then((res) => res.data)
      .then((data) => {
        setData(data);
      });
    }
   
  }, [page, pageSize, searchKey]);



  return (
    <Container maxWidth={fullWidth ? "fullWidth" : "xl"}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AppBar
            sx={{ bgcolor: "rgba(0, 0, 0, 0)", mt: 7, mb: 3, pr: 1 }}
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
                    placeholder="Search with concept"
                    value={searchKey}
                    onChange={handleSearch}
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={1}>
                  <Icon>
                    <MdFilterList />
                  </Icon>
                  <Icon onClick={() => setFullWidth(!fullWidth)}>
                    <MdOutlineWidthWide />
                  </Icon>
                </Stack>
              </Grid>
            </Grid>
          </AppBar>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>person_id</StyledTableCell>
              <StyledTableCell>gender_concept_id</StyledTableCell>
              <StyledTableCell>year_of_birth</StyledTableCell>
              <StyledTableCell>month_of_birth</StyledTableCell>
              <StyledTableCell>day_of_birth</StyledTableCell>
              <StyledTableCell>birth_datetime</StyledTableCell>
              <StyledTableCell>race_concept_id</StyledTableCell>
              <StyledTableCell>ethnicity_concept_id</StyledTableCell>
              <StyledTableCell>location_id</StyledTableCell>
              <StyledTableCell>provider_id</StyledTableCell>
              <StyledTableCell>care_site_id</StyledTableCell>
              <StyledTableCell>person_source_value</StyledTableCell>
              <StyledTableCell>race_source_value</StyledTableCell>
              <StyledTableCell>race_source_concept_id</StyledTableCell>
              <StyledTableCell>gender_source_value</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{row.person_id}</StyledTableCell>
                  <StyledTableCell>{row.gender_concept_id}</StyledTableCell>
                  <StyledTableCell>{row.year_of_birth}</StyledTableCell>
                  <StyledTableCell>{row.month_of_birth}</StyledTableCell>
                  <StyledTableCell>{row.day_of_birth}</StyledTableCell>
                  <StyledTableCell>{row.birth_datetime}</StyledTableCell>
                  <StyledTableCell>{row.race_concept_id}</StyledTableCell>
                  <StyledTableCell>{row.ethnicity_concept_id}</StyledTableCell>
                  <StyledTableCell>{row.location_id}</StyledTableCell>
                  <StyledTableCell>{row.provider_id}</StyledTableCell>
                  <StyledTableCell>{row.care_site_id}</StyledTableCell>
                  <StyledTableCell>{row.person_source_value}</StyledTableCell>
                  <StyledTableCell>{row.race_source_value}</StyledTableCell>
                  <StyledTableCell>
                    {row.race_source_concept_id}
                  </StyledTableCell>
                  <StyledTableCell>{row.gender_source_value}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={1000}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>
    </Container>
  );
};

export default PersonTable;
