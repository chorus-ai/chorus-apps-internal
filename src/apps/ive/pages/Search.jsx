import { useState } from "react";
import { Paper, IconButton, FormControl, Table, Grid, AppBar, TableBody, TableCell, TableContainer, TableHead, TableRow, Container, InputBase} from "@mui/material";

import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled, alpha } from "@mui/material/styles";
import { FilterIcon } from "../../cada/common/Icons";

import { tableCellClasses } from '@mui/material/TableCell';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import Label from "../../cada/common/Label";

// ----------------------------------------------------------------------

const SearchStyle = styled(FormControl)(({ theme }) => ({
  position: "relative", 
  color: theme.palette.common.black,
  fontSize: theme.typography.fontSize,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.5),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.80),
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  color: "inherit",
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    border: "none",
    transition: theme.transitions.create("width"),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(theme.palette.secondary.light, 0.80),
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

const filter = createFilterOptions();

const searchQuerys = [
  { title: 'Patient with sepsis', year: 1994 },
  { title: 'Codeblue', year: 1972 },
  { title: 'Female Codeblue', year: 1974 },
  { title: 'Sepsis', year: 2008 },
  { title: 'ARDS patinent from 2015-2017', year: 1957 },
  { title: "Sepsis 2017", year: 1993 },
  { title: 'ICP patient', year: 1994 }]

const dictionary = {
  words: ['All', 'patient', 'with', 'ICD10', 'patient', 'icu', 'pain', 'fall', 'test', 'this', 'that', 'those', 'working', 'is']
};

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

function Search() {
  const [prefix, setPrefix] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [value, setValue] = React.useState(null);
  const [open, toggleOpen] = React.useState(false);

  const handleClose = () => {
    setDialogValue({
      title: '',
      year: '',
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    title: '',
    year: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue({
      title: dialogValue.title,
      year: parseInt(dialogValue.year, 10),
    });
    handleClose();
  };
 

  const filterPatients = (searchValue) => {
    if (searchValue.trim() === "") {
      setFilteredPatients([]);
    } else {
      const filtered = data.filter((patient) =>
        patient.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };


  return (
    <Container maxWidth="xl" sx={{p:3}} >
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add a new search query</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Need this search query later? Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              id="name"
              value={dialogValue.title}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  title: event.target.value,
                })
              }
              label="searchQuery"
              type="text"
              variant="standard"
            />
            <br/>
            
            <TextField
              margin="dense"
              id="name"
              value={dialogValue.year}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  year: event.target.value,
                })
              }
              label="label"
              type="text"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>

        <AppBar
              sx={{ bgcolor: "rgba(0, 0, 0, 0)", mb: 3.5 }}
              position="static"
              color="inherit"
              elevation={0}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <SearchStyle>
                  <React.Fragment>
                    <Autocomplete
                      value={value}
                      onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                          // timeout to avoid instant validation of the dialog's form.
                          setTimeout(() => {
                            toggleOpen(true);
                            setDialogValue({
                              title: newValue,
                              year: '',
                            });
                          });
                        } else if (newValue && newValue.inputValue) {
                          toggleOpen(true);
                          setDialogValue({
                            title: newValue.inputValue,
                            year: '',
                          });
                        } else {
                          setValue(newValue);
                        }
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        if (params.inputValue !== '') {
                          filtered.push({
                            inputValue: params.inputValue,
                            title: <> {params.inputValue + " "} <Label sx={{ml: 2}} color="info"> ADD</Label> </> ,
                          });
                        }

                        return filtered;
                      }}
                      id="free-solo-dialog-demo"
                      options={searchQuerys}
                      getOptionLabel={(option) => {
                        // e.g value selected with enter, right from the input
                        if (typeof option === 'string') {
                          return option;
                        }
                        if (option.inputValue) {
                          return option.inputValue;
                        }
                        return option.title;
                      }}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      renderOption={(props, option) => <li {...props}>{option.title}</li>}
                    
                      freeSolo
                      renderInput={(params) => <StyledTextField {...params} label="Search query" />}
                    />
                  </React.Fragment>
                  </SearchStyle>
                </Grid>
                <Grid item>
                <IconButton
                    variant="contained"
                    color="primary"
                  >
                  <FilterIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </AppBar>
  
      <br />
     
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
  );
}

export default Search;
