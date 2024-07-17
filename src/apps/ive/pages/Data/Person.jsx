import React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell, 
  Paper,
  Icon,
  AppBar,
  Grid,
  Button,
  TextField,
  TablePagination,
  MenuItem,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Alert,
  InputBase,
  FormControl,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Stack,
  Container,
} from "@mui/material";

import { tableCellClasses } from '@mui/material/TableCell';

import { styled, alpha } from "@mui/material/styles";
import { BiSearchAlt } from "react-icons/bi";
import { FilterIcon } from "../../../cada/common/Icons";

const centerStyle = {
  display: "flex",
  justifyContent: "center",
};

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
    border: 0,
  },
}));


const PersonTable = () => {
  const [searchKey, setSearchKey] = React.useState("");

  const data = [
    {
      person_id: 11646,
      gender_concept_id: 8507,
      year_of_birth: 1949,
      month_of_birth: 3,
      day_of_birth: 1,
      birth_datetime: "1949-03-01T05:00:00.000Z",
      race_concept_id: 8515,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 228818,
      gender_concept_id: 8532,
      year_of_birth: 1969,
      month_of_birth: 12,
      day_of_birth: 1,
      birth_datetime: "1969-12-01T05:00:00.000Z",
      race_concept_id: 0,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 425065,
      gender_concept_id: 8507,
      year_of_birth: 1997,
      month_of_birth: 4,
      day_of_birth: 1,
      birth_datetime: "1997-04-01T05:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 958705,
      gender_concept_id: 8507,
      year_of_birth: 1967,
      month_of_birth: 7,
      day_of_birth: 1,
      birth_datetime: "1967-07-01T04:00:00.000Z",
      race_concept_id: 8527,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 981423,
      gender_concept_id: 8532,
      year_of_birth: 1970,
      month_of_birth: 6,
      day_of_birth: 1,
      birth_datetime: "1970-06-01T04:00:00.000Z",
      race_concept_id: 8527,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 1070220,
      gender_concept_id: 8507,
      year_of_birth: 1974,
      month_of_birth: 12,
      day_of_birth: 1,
      birth_datetime: "1974-12-01T05:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 467618,
      gender_concept_id: 8507,
      year_of_birth: 1961,
      month_of_birth: 8,
      day_of_birth: 1,
      birth_datetime: "1961-08-01T04:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 756369,
      gender_concept_id: 8507,
      year_of_birth: 1955,
      month_of_birth: 3,
      day_of_birth: 1,
      birth_datetime: "1955-03-01T05:00:00.000Z",
      race_concept_id: 0,
      ethnicity_concept_id: 0,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 558405,
      gender_concept_id: 8507,
      year_of_birth: 1954,
      month_of_birth: 2,
      day_of_birth: 1,
      birth_datetime: "1954-02-01T05:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 245902,
      gender_concept_id: 8532,
      year_of_birth: 1974,
      month_of_birth: 1,
      day_of_birth: 1,
      birth_datetime: "1974-01-01T05:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 106573,
      gender_concept_id: 8507,
      year_of_birth: 1970,
      month_of_birth: 6,
      day_of_birth: 1,
      birth_datetime: "1970-06-01T04:00:00.000Z",
      race_concept_id: 8527,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 637546,
      gender_concept_id: 8532,
      year_of_birth: 1987,
      month_of_birth: 12,
      day_of_birth: 1,
      birth_datetime: "1987-12-01T05:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 186391,
      gender_concept_id: 8507,
      year_of_birth: 1971,
      month_of_birth: 1,
      day_of_birth: 1,
      birth_datetime: "1971-01-01T05:00:00.000Z",
      race_concept_id: 8527,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 510455,
      gender_concept_id: 8507,
      year_of_birth: 1945,
      month_of_birth: 12,
      day_of_birth: 1,
      birth_datetime: "1945-12-01T05:00:00.000Z",
      race_concept_id: 0,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 277703,
      gender_concept_id: 8507,
      year_of_birth: 1976,
      month_of_birth: 12,
      day_of_birth: 1,
      birth_datetime: "1976-12-01T05:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 1140452,
      gender_concept_id: 8532,
      year_of_birth: 1979,
      month_of_birth: 12,
      day_of_birth: 1,
      birth_datetime: "1979-12-01T05:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 393057,
      gender_concept_id: 8507,
      year_of_birth: 1958,
      month_of_birth: 5,
      day_of_birth: 1,
      birth_datetime: "1958-05-01T04:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 826000,
      gender_concept_id: 8532,
      year_of_birth: 1964,
      month_of_birth: 7,
      day_of_birth: 1,
      birth_datetime: "1964-07-01T04:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 785976,
      gender_concept_id: 8532,
      year_of_birth: 1969,
      month_of_birth: 4,
      day_of_birth: 1,
      birth_datetime: "1969-04-01T05:00:00.000Z",
      race_concept_id: 8515,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 52142,
      gender_concept_id: 8507,
      year_of_birth: 1987,
      month_of_birth: 3,
      day_of_birth: 1,
      birth_datetime: "1987-03-01T05:00:00.000Z",
      race_concept_id: 8527,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 1181189,
      gender_concept_id: 8532,
      year_of_birth: 1961,
      month_of_birth: 11,
      day_of_birth: 1,
      birth_datetime: "1961-11-01T05:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 880720,
      gender_concept_id: 8532,
      year_of_birth: 1954,
      month_of_birth: 1,
      day_of_birth: 1,
      birth_datetime: "1954-01-01T05:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 390437,
      gender_concept_id: 8507,
      year_of_birth: 1966,
      month_of_birth: 8,
      day_of_birth: 1,
      birth_datetime: "1966-08-01T04:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 72567,
      gender_concept_id: 8532,
      year_of_birth: 1980,
      month_of_birth: 9,
      day_of_birth: 1,
      birth_datetime: "1980-09-01T04:00:00.000Z",
      race_concept_id: 8516,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
    {
      person_id: 119335,
      gender_concept_id: 8507,
      year_of_birth: 1957,
      month_of_birth: 12,
      day_of_birth: 1,
      birth_datetime: "1957-12-01T05:00:00.000Z",
      race_concept_id: 8527,
      ethnicity_concept_id: 38003564,
      location_id: 1,
      provider_id: 1,
      care_site_id: 1,
      person_source_value: "",
      gender_source_value: "",
      gender_source_concept_id: null,
      race_source_value: "",
      race_source_concept_id: null,
      ethnicity_source_value: "",
      ethnicity_source_concept_id: null,
    },
  ];

  const handleSearch = (event) => {
    setSearchKey(event.target.value);
  };

  return (
    <div style={centerStyle}>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar
              sx={{ bgcolor: "rgba(0, 0, 0, 0)", mt: 7, mb: 3, pr: 1}}
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
                      placeholder="Search anything"
                      value={searchKey}
                      onChange={handleSearch}
                      inputProps={{ "aria-label": "search" }}
                    />
                  </Search>
                </Grid>
                <Grid item> 
                  <Icon >
                    <FilterIcon />  
                      </Icon>
                  </Grid>
              </Grid>
            </AppBar>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table >
            <TableHead >
              <StyledTableRow >
                <StyledTableCell>Person ID</StyledTableCell>
                <StyledTableCell >Gender Concept ID</StyledTableCell>
                <StyledTableCell >Year of Birth</StyledTableCell>
                <StyledTableCell >Month of Birth</StyledTableCell>
                <StyledTableCell >Day of Birth</StyledTableCell>
                <StyledTableCell >Birth Datetime</StyledTableCell>
                <StyledTableCell >Race Concept ID</StyledTableCell>
                <StyledTableCell >Ethnicity Concept ID</StyledTableCell>
                <StyledTableCell >Location ID</StyledTableCell>
                <StyledTableCell >Provider ID</StyledTableCell>
                <StyledTableCell >Care Site ID</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell >{row.person_id}</StyledTableCell>
                  <StyledTableCell >{row.gender_concept_id}</StyledTableCell>
                  <StyledTableCell >{row.year_of_birth}</StyledTableCell>
                  <StyledTableCell >{row.month_of_birth}</StyledTableCell>
                  <StyledTableCell >{row.day_of_birth}</StyledTableCell>
                  <StyledTableCell >{row.birth_datetime}</StyledTableCell>
                  <StyledTableCell >{row.race_concept_id}</StyledTableCell>
                  <StyledTableCell >{row.ethnicity_concept_id}</StyledTableCell>
                  <StyledTableCell >{row.location_id}</StyledTableCell>
                  <StyledTableCell >{row.provider_id}</StyledTableCell>
                  <StyledTableCell >{row.care_site_id}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default PersonTable;
