

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import {
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
  Container
} from "@mui/material";


import { tableCellClasses } from '@mui/material/TableCell';
import { styled, alpha } from "@mui/material/styles";
import { BiSearchAlt } from "react-icons/bi";

const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
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

 
  const measurements = [
    {
      measurement_id: 1,
      person_id: 123,
      measurement_concept_id: 'Weight',
      measurement_date: '2023-06-01',
      measurement_value: '70',
      measurement_type_concept_id: 'Clinical Measurement',
      operator_concept_id: 'N/A',
      unit_concept_id: 'kg',
      measurement_source_value: 'Device A',
    },
    {
      measurement_id: 2,
      person_id: 456,
      measurement_concept_id: 'Height',
      measurement_date: '2023-06-02',
      measurement_value: '170',
      measurement_type_concept_id: 'Clinical Measurement',
      operator_concept_id: 'N/A',
      unit_concept_id: 'cm',
      measurement_source_value: 'Device B',
    },
  ];


  const handleSearch = (event) => {
    setSearchKey(event.target.value);
  };

  return (
    <div >

<Container maxWidth="xl" >
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
              </Grid>
            </AppBar>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
        <Table>
        <TableHead>
        <StyledTableRow>
          <StyledTableCell>Measurement ID</StyledTableCell>
          <StyledTableCell>Person ID</StyledTableCell>
          <StyledTableCell>Measurement Concept ID</StyledTableCell>
          <StyledTableCell>Measurement Date</StyledTableCell>
          <StyledTableCell>Measurement Value</StyledTableCell>
          <StyledTableCell>Measurement Type Concept ID</StyledTableCell>
          <StyledTableCell>Operator Concept ID</StyledTableCell>
          <StyledTableCell>Unit Concept ID</StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {measurements.map((measurement) => (
          <TableRow key={measurement.measurement_id}>
            <StyledTableCell>{measurement.measurement_id}</StyledTableCell>
            <StyledTableCell>{measurement.person_id}</StyledTableCell>
            <StyledTableCell>{measurement.measurement_concept_id}</StyledTableCell>
            <StyledTableCell>{measurement.measurement_date}</StyledTableCell>
            <StyledTableCell>{measurement.measurement_value}</StyledTableCell>
            <StyledTableCell>{measurement.measurement_type_concept_id}</StyledTableCell>
            <StyledTableCell>{measurement.operator_concept_id}</StyledTableCell>
            <StyledTableCell>{measurement.unit_concept_id}</StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
        </Table>
      </TableContainer>
      
      </Container>
    </div>
  );
};

export default PersonTable;


