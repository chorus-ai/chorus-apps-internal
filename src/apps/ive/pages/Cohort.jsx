import React, { useState } from "react";
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
  InputBase,
  FormControl,
  Container,
  Stack,
  Button,
  Card,
  CardContent,
  Typography
} from "@mui/material";
import { tableCellClasses } from '@mui/material/TableCell';
import { styled, alpha } from "@mui/material/styles";
import { BiSearchAlt } from "react-icons/bi";
import { MdOutlineLibraryAdd, MdFilterList } from "react-icons/md";
import { AiOutlineMore } from "react-icons/ai";

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
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const PersonTable = () => {
  const [searchKey, setSearchKey] = React.useState("");
  const [selectedCohort, setSelectedCohort] = useState(null);

  const cohorts = [
    { title: 'Patient with sepsis', tag: ['sepsis', 'infection', 'critical care', 'patient management'] },
    // Additional cohorts here...
  ];

  const handleSearch = (event) => {
    setSearchKey(event.target.value);
  };

  const showDetails = (cohort) => {
    setSelectedCohort(cohort);
  };

  const goBack = () => {
    setSelectedCohort(null);
  };

  // Mock statistics data
  const mockStats = {
    totalPersons: 5,
    totalDeaths: 2,
    medications: 24,
    procedures: 40
  };
  const cohortDetails = [
    { cohort_definition_id: 1, subject_id: 101, cohort_start_date: "2020-01-01", cohort_end_date: "2020-12-31" },
    { cohort_definition_id: 2, subject_id: 102, cohort_start_date: "2019-05-15", cohort_end_date: "2020-05-14" },
    { cohort_definition_id: 3, subject_id: 103, cohort_start_date: "2021-07-01", cohort_end_date: "2022-06-30" },
    { cohort_definition_id: 4, subject_id: 104, cohort_start_date: "2018-03-20", cohort_end_date: "2019-03-19" },
    { cohort_definition_id: 5, subject_id: 105, cohort_start_date: "2022-01-01", cohort_end_date: "2022-12-31" },
  ];

  return (
    <div>
      <Container maxWidth="xl">
        {selectedCohort ? (
          <div>
            <Button onClick={goBack}>Back to Cohort List</Button>
            <h2>{selectedCohort.title}</h2>
            <p>Tags: {selectedCohort.tag.join(", ")}</p>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Persons</Typography>
                    <Typography variant="h4">{mockStats.totalPersons}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Deaths</Typography>
                    <Typography variant="h4">{mockStats.totalDeaths}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Medications</Typography>
                    <Typography variant="h4">{mockStats.medications}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Procedures</Typography>
                    <Typography variant="h4">{mockStats.procedures}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Cohort Definition ID</StyledTableCell>
                    <StyledTableCell>Subject ID</StyledTableCell>
                    <StyledTableCell>Cohort Start Date</StyledTableCell>
                    <StyledTableCell>Cohort End Date</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cohortDetails.map((detail) => (
                    <StyledTableRow key={detail.subject_id}>
                      <StyledTableCell>{detail.cohort_definition_id}</StyledTableCell>
                      <StyledTableCell>{detail.subject_id}</StyledTableCell>
                      <StyledTableCell>{detail.cohort_start_date}</StyledTableCell>
                      <StyledTableCell>{detail.cohort_end_date}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
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
                        placeholder="Search "
                        value={searchKey}
                        onChange={handleSearch}
                        inputProps={{ "aria-label": "search" }}
                      />
                    </Search>
                  </Grid>
                  <Grid item> 
                    <Stack direction="row" spacing={1}>
                      <Icon><MdFilterList /></Icon>
                      <Icon><MdOutlineLibraryAdd /></Icon>
                    </Stack>
                  </Grid>
                </Grid>
              </AppBar>
            </Grid>
          </Grid>
        )}

        {!selectedCohort && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Cohort ID</StyledTableCell>
                  <StyledTableCell>Cohort Name</StyledTableCell>
                  <StyledTableCell>Cohort Description</StyledTableCell>
                  <StyledTableCell>Tags</StyledTableCell>
                  <StyledTableCell>Details</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cohorts.map((row, index) => (
                  <StyledTableRow key={row.title}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{row.title}</StyledTableCell>
                    <StyledTableCell>{row.title}</StyledTableCell>
                    <StyledTableCell>{row.tag.join(", ")}</StyledTableCell>
                    <StyledTableCell>
                      <Icon onClick={() => showDetails(row)}>
                        <AiOutlineMore />
                      </Icon>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </div>
  );
};

export default PersonTable;
