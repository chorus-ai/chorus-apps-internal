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


const MeasurementTable = () => {
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
        url: `/api/omop/measurement?page=${page}&pageSize=${pageSize}`,
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
                <StyledTableCell>measurement_id</StyledTableCell>
                <StyledTableCell>person_id</StyledTableCell>
                <StyledTableCell>measurement_concept_id</StyledTableCell>
                <StyledTableCell>measurement_date</StyledTableCell>
                <StyledTableCell>measurement_datetime</StyledTableCell>
                <StyledTableCell>measurement_time</StyledTableCell>
                <StyledTableCell>measurement_type_concept_id</StyledTableCell>
                <StyledTableCell>operator_concept_id</StyledTableCell>
                <StyledTableCell>value_as_number</StyledTableCell>
                <StyledTableCell>value_as_concept_id</StyledTableCell>
                <StyledTableCell>unit_concept_id</StyledTableCell>
                <StyledTableCell>range_low</StyledTableCell>
                <StyledTableCell>range_high</StyledTableCell>
                <StyledTableCell>provider_id</StyledTableCell>
                <StyledTableCell>visit_occurrence_id</StyledTableCell>
                <StyledTableCell>visit_detail_id</StyledTableCell>
                <StyledTableCell>measurement_source_value</StyledTableCell>
                <StyledTableCell>measurement_source_concept_id</StyledTableCell>
                <StyledTableCell>unit_source_value</StyledTableCell>
                <StyledTableCell>unit_source_concept_id</StyledTableCell>
                <StyledTableCell>value_source_value</StyledTableCell>
                <StyledTableCell>measurement_event_id</StyledTableCell>
                <StyledTableCell>meas_event_field_concept_id</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
          {data &&
            data.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{row.measurement_id}</StyledTableCell>
                <StyledTableCell>{row.person_id}</StyledTableCell>
                <StyledTableCell>{row.measurement_concept_id}</StyledTableCell>
                <StyledTableCell>{row.measurement_date}</StyledTableCell>
                <StyledTableCell>{row.measurement_datetime}</StyledTableCell>
                <StyledTableCell>{row.measurement_time}</StyledTableCell>
                <StyledTableCell>{row.measurement_type_concept_id}</StyledTableCell>
                <StyledTableCell>{row.operator_concept_id}</StyledTableCell>
                <StyledTableCell>{row.value_as_number}</StyledTableCell>
                <StyledTableCell>{row.value_as_concept_id}</StyledTableCell>
                <StyledTableCell>{row.unit_concept_id}</StyledTableCell>
                <StyledTableCell>{row.range_low}</StyledTableCell>
                <StyledTableCell>{row.range_high}</StyledTableCell>
                <StyledTableCell>{row.provider_id}</StyledTableCell>
                <StyledTableCell>{row.visit_occurrence_id}</StyledTableCell>
                <StyledTableCell>{row.visit_detail_id}</StyledTableCell>
                <StyledTableCell>{row.measurement_source_value}</StyledTableCell>
                <StyledTableCell>{row.measurement_source_concept_id}</StyledTableCell>
                <StyledTableCell>{row.unit_source_value}</StyledTableCell>
                <StyledTableCell>{row.unit_source_concept_id}</StyledTableCell>
                <StyledTableCell>{row.value_source_value}</StyledTableCell>
                <StyledTableCell>{row.measurement_event_id}</StyledTableCell>
                <StyledTableCell>{row.meas_event_field_concept_id}</StyledTableCell>
              </StyledTableRow>
            ))
          }
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

export default MeasurementTable;
