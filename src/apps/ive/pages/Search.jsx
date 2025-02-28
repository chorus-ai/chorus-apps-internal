import React, { useState, useEffect } from "react";
import { 
  Paper, 
  IconButton, 
  FormControl, 
  Table, 
  Grid, 
  AppBar, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TablePagination,
  TableHead, 
  TableRow, 
  Container,
  Icon,
  Badge,
  Box,
  Chip
} from "@mui/material";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled, alpha } from "@mui/material/styles";
import { MdOutlineWidthWide, MdFilterList } from "react-icons/md";
import { tableCellClasses } from '@mui/material/TableCell';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import Label from "../../cada/common/Label";
import FilterSidebar from "../common/FilterSidebar";
import axios from "axios";

// ----------------------------------------------------------------------

export const OPTIONS = {
  'Domain': [
    "Condition",
    "Device",
    "Drug",
    "Gender",
    "Geography",
    "Meas Value",
    "Measurement",
    "Metadata",
    "Observation",
    "Procedure",
    "Condition Status",
    "Condition/Device",
    "Condition/Meas",
    "Condition/Obs",
    "Condition/Procedure",
    "Cost",
    "Currency",
    "Device/Drug",
    "Device/Procedure",
    "Drug/Procedure",
    "Episode",
    "Ethnicity",
    "Language",
    "Meas Value Operator",
    "Meas/Procedure",
    "Note",
    "Obs/Procedure",
    "Payer",
    "Place of Service",
    "Plan",
    "Plan Stop Reason",
    "Provider",
    "Race",
    "Regimen",
    "Relationship",
    "Revenue Code",
    "Route",
    "Spec Anatomic Site",
    "Specimen",
    "Sponsor",
    "Type Concept",
    "Unit",
    "Visit",
  ],
  'Category': [
    "Non-standard",
    "Standard",
    "Classification",
  ],
  'Class': [
    '3-char nonbill code',
    '3-dig nonbill code',
    '4-char billing code',
    '4-dig billing code',
    '5-dig billing code',
    'Clinical Finding',
    'Diagnosis',
    'Disorder',
    'Finding',
    'ICD10 Hierarchy',
    'ICD10 code',
    'KCD7 code',
    'Main Heading',
    'OXMIS',
    'Read',
    '10th level',
    '11-digit NDC',
    '11th level',
    '12th level',
    '2-dig nonbill code',
    '2nd level',
    '3-char billing code',
    '3-dig billing E code',
    '3-dig billing V code',
    '3-dig billing code',
    '3-dig nonbill E code',
    '3-dig nonbill V code',
    '3rd level',
    '4-char nonbill code',
    '4-dig billing E code',
    '4-dig billing V code',
    '4-dig nonbill V code',
    '4-dig nonbill code',
    '4th level',
    '5-char billing code',
    '5-char nonbill code',
    '5-dig billing V code',
    '5th level',
    '6-char billing code',
    '6-char nonbill code',
    '6-dig billing code',
    '6th level',
    '7-char billing code',
    '7th level',
    '8th level',
    '9-digit NDC',
    '9th level',
    'AJCC Category',
    'AJCC Chapter',
    'AMP',
    'AMPP',
    'APC',
    'ATC 1st',
    'ATC 2nd',
    'ATC 3rd',
    'ATC 4th',
    'ATC 5th',
    'AU Qualifier',
    'AU Substance',
    'Admin Concept',
    'Admitting Source',
    'Aggregate Meas',
    'Anatomy',
    'Animal Drug',
    'Answer',
    'Attribute',
    'Benefit',
    'Biobank Flag',
    'Biological Function',
    'Blood Pressure Pos',
    'Body Structure',
    'Brand Name',
    'Branded Dose Group',
    'Branded Drug',
    'Branded Drug Box',
    'Branded Drug Comp',
    'Branded Drug Form',
    'Branded Pack',
    'Branded Pack Box',
    'CAP Header',
    'CAP Protocol',
    'CAP Value',
    'CAP Variable',
    'CDM',
    'CDT',
    'CDT Hierarchy',
    'CPT4',
    'CPT4 Hierarchy',
    'CPT4 Modifier',
    'CVX',
    'Canonical Unit',
    'Category',
    'Cellular Therapy',
    'Chart Availability',
    'Chemical Structure',
    'Claims Attachment',
    'Clinical Dose Group',
    'Clinical Drug',
    'Clinical Drug Box',
    'Clinical Drug Comp',
    'Clinical Drug Form',
    'Clinical Observation',
    'Clinical Pack',
    'Clinical Pack sion/Invasion',
    'Field',
    'Food',
    'Form',
    'Frequency',
    'GCN_SEQNO',
    'GPI',
    'Gemscript',
    'Gemscript THIN',
    'Gender',
    'Gene DNA Variant',
    'Gene Protein Variant',
    'Gene RNA Variant',
    'Gene Variant',
    'Genetic Variation',
    'HCPCS',
    'HCPCS Class',
    'HCPCS Modifier',
    'HLGT',
    'HLT',
    'Hispanic',
    'Histopattern',
    'ICD10 Chapter',
    'ICD10 Histology',
    'ICD10 SubChapter',
    'ICD10PCS',
    'ICD10PCS Hierarchy',
    'ICD9CM code',
    'ICD9Proc Chapter',
    'ICDO Condition',
    'ICDO Histology',
    'ICDO Topography',
    'ISBT Attrib group',
    'ISBT Attrib value',
    'ISBT Category',
    'ISBT Class',
    'ISBT Modifier',
    'ISBT Product',
    'Imaging Material',
    'Inactive Concept',
    'Ind / CI',
    'Indication',
    'Ingredient',
    'LLT',
    'LOINC Class',
    'LOINC Component',
    'LOINC Document Type',
    'LOINC Group',
    'LOINC Hierarchy',
    'LOINC Method',
    'LOINC Property',
    'LOINC Scale',
    'LOINC System',
    'LOINC Time',
    'Lab Test',
    'LabSet',
    'Language',
    'Life circumstance',
    'Linkage Assertion',
    'Linkage Concept',
    'Location',
    'MDC',
    'MS-DRG',
    'Margin',
    'Marketed Product',
    'Meas Class',
    'Meas Type',
    'Measurement',
    'Mechanism of Action',
    'Med Product Pack',
    'Med Product Unit',
    'MedSet',
    'Medical supply',
    'Medicinal Product',
    'Metadata',
    'Metal level',
    'Metastasis',
    'Misc',
    'Misc Order',
    'Modality',
    'Model Comp',
    'Module',
    'Morph Abnormality',
    'Multiple Ingredients',
    'Multum',
    'NAACCR Proc Schema',
    'NAACCR Procedure',
    'NAACCR Schema',
    'NAACCR Value',
    'NAACCR Variable',
    'NFC',
    'Namespace Concept',
    'Navi Concept',
    'Nodes',
    'Non-Stand Allergenic',
    'Note Type',
    'OTC Drug',
    'Obs Period Type',
    'Observable Entity',
    'Observation',
    'Observation Type',
    'Organism',
    'PPI Modifier',
    'PT',
    'Patient Status',
    'Payer',
    'Permissible Range',
    'Pharma Preparation',
    'Pharma/Biol Product',
    'Pharmacokinetics',
    'Pharmacologic Class',
    'Physical Force',
    'Physical Object',
    'Physician Specialty',
    'Physiologic Effect',
    'Plan Stop Reason',
    'Plasma Derivative',
    'Precise Ingredient',
    'Precoordinated pair',
    'Prescription Drug',
    'Proc Group',
    'Proc Hierarchy',
    'Procedure',
    'Procedure Code Type',
    'Procedure Type',
    'Program',
    'Provider',
    'Qualifier Value',
    'Quant Branded Box',
    'Quant Branded Drug',
    'Quant Clinical Box',
    'Quant Clinical Drug',
    'Question',
    'Question source',
    'Race',
    'Radiology',
    'Record Artifact',
    'Regimen',
    'Regimen Class',
    'Relationship',
    'Revenue Code',
    'Route',
    'SMQ',
    'SOC',
    'SPL',
    'SUS',
    'Social Context',
    'Special Concept',
    'Specimen',
    'Specimen Type',
    'Sponsor',
    'Staging / Scales',
    'Staging/Grading',
    'Standard Allergenic',
    'State',
    'Structural Variant',
    'Substance',
    'Summary',
    'Suppl Concept',
    'Supplement',
    'Supplier',
    'Survey',
    'Symptom',
    'Symptom/Finding',
    'Table',
    'Test',
    'Therapeutic Class',
    'Topic',
    'Topography',
    'Trade Product',
    'Trade Product Pack',
    'Trade Product Unit',
    'Treatment',
    'Type Concept',
    'UB04 Point of Origin',
    'UB04 Pri Typ of Adm',
    'UB04 Pt dis status',
    'US Census Division',
    'US Census Region',
    'Undefined',
    'Unit',
    'Units of Measure',
    'VA Class',
    'VA Product',
    'VMP',
    'VMPP',
    'VTM',
    'Vaccine',
    'Vaccine Group',
    'Value',
    'Variable',
    'Variant',
    'Visit',
    'Visit Type',
    'Vital Source',
    'Vocabulary',
    'Workflow',
  ],
  'Vocab': [
    'CIEL',
    'CIM10',
    'ICD10',
    'ICD10CM',
    'ICD10CN',
    'ICD10GM',
    'ICD9CM',
    'KCD7',
    'MeSH',
    'Nebraska Lexicon',
    'OXMIS',
    'Read',
    'SNOMED',
    'ABMS',
    'AMT',
    'APC',
    'ATC',
    'BDPM',
    'CCAM',
    'CDM',
    'CGI',
    'CIViC',
    'CMS Place of Service',
    'CO-CONNECT',
    'CO-CONNECT MIABIS',
    'CO-CONNECT TWINS',
    'CPT4',
    'CTD',
    'CVX',
    'Cancer Modifier',
    'ClinVar',
    'Cohort',
    'Concept Class',
    'Condition Status',
    'Condition Type',
    'Cost',
    'Cost Type',
    'Currency',
    'DPD',
    'DRG',
    'Death Type',
    'Device Type',
    'Domain',
    'Drug Type',
    'EDI',
    'EphMRA ATC',
    'Episode',
    'Episode Type',
    'Ethnicity',
    'GCN_SEQNO',
    'GGR',
    'Gender',
    'HCPCS',
    'HES Specialty',
    'HemOnc',
    'ICD10PCS',
    'ICD9Proc',
    'ICD9ProcCN',
    'ICDO3',
    'JAX',
    'JMDC',
    'KDC',
    'KNHIS',
    'Korean Revenue Code',
    'LOINC',
    'Language',
    'MDC',
    'MMI',
    'Meas Type',
    'Medicare Specialty',
    'Metadata',
    'Multum',
    'NAACCR',
    'NCCD',
    'NCIt',
    'NDC',
    'NDFRT',
    'NFC',
    'NHS Ethnic Category',
    'NHS Place of Service',
    'NUCC',
    'None',
    'Note Type',
    'OMOP Extension',
    'OMOP Genomic',
    'OMOP Invest Drug',
    'OPCS4',
    'OPS',
    'OSM',
    'Obs Period Type',
    'Observation Type',
    'OncoKB',
    'OncoTree',
    'PCORNet',
    'PPI',
    'Plan',
    'Plan Stop Reason',
    'Procedure Type',
    'Provider',
    'Race',
    'Relationship',
    'Revenue Code',
    'RxNorm',
    'RxNorm Extension',
    'SMQ',
    'SNOMED Veterinary',
    'SOPT',
    'SPL',
    'SUS',
    'Specimen Type',
    'Sponsor',
    'Supplier',
    'Type Concept',
    'UB04 Point of Origin',
    'UB04 Pri Typ of Adm',
    'UB04 Pt dis status',
    'UB04 Typ bill',
    'UCUM',
    'UK Biobank',
    'US Census',
    'VA Class',
    'VANDF',
    'Visit',
    'Visit Type',
    'Vocabulary',
    'dm+d',
  ],
  'Validity': [
    'Invalid',
    'Valid'
  ],
};

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

const cohorts = [
  { title: 'Patient with sepsis', tag: ['sepsis', 'infection', 'critical care', 'patient management'] },
  { title: 'Codeblue events 2019', tag: ['codeblue', 'emergency', '2019', 'resuscitation'] },
  { title: 'Female Codeblue', tag: ['codeblue', 'female', 'gender-specific', 'emergency'] },
  { title: 'Sepsis for HuLab', tag: ['sepsis', 'HuLab', 'laboratory'] },
  { title: 'ARDS patient from 2015-2017', tag: ['ARDS', '2015-2017', 'pulmonary', 'critical care'] },
  { title: 'Sepsis Project 2017', tag: ['sepsis', '2017'] },
  { title: 'ICP patient cohort', tag: ['ICP', 'neurology', 'patient cohort', 'brain injury'] },
  { title: 'Diabetes Management 2020', tag: ['diabetes', '2020', 'chronic disease', 'endocrinology'] },
  { title: 'COVID-19 Vaccine Recipients', tag: ['COVID-19', 'vaccine', 'immunization', 'public health'] },
  { title: 'Pediatric Asthma Patients', tag: ['asthma', 'pediatrics', 'respiratory', 'child health'] },
  { title: 'Stroke Recovery Longitudinal Study', tag: ['stroke', 'recovery', 'neurology', 'longitudinal study'] },
  { title: 'Heart Failure Patients 2018-2020', tag: ['heart failure', '2018-2020', 'cardiology', 'patient outcomes'] },
  { title: 'Elderly Hypertension Screening', tag: ['hypertension', 'elderly', 'screening', 'preventive health'] },
  { title: 'Mental Health in University Students', tag: ['mental health', 'university', 'students', 'psychology'] },
  { title: 'Obesity Treatment Trials', tag: ['obesity', 'treatment', 'clinical trial', 'weight management'] },
  { title: 'Breast Cancer Survivors 5-Year Follow-Up', tag: ['breast cancer', 'survivors', '5-year follow-up', 'oncology'] },
  { title: 'NICU Outcomes for Premature Infants', tag: ['NICU', 'premature', 'infants', 'neonatology'] }
];


const dictionary = {
  words: ['All', 'patient', 'with', 'ICD10', 'patient', 'icu', 'pain', 'fall', 'test', 'this', 'that', 'those', 'working', 'is']
};


function Search() {
  const [prefix, setPrefix] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [data, setData] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const [fullWidth, setFullWidth] = React.useState(false);
  const [autocompleteValue, setAutocompleteValue] = React.useState(null);
  const [openDialog, setOpenDailog] = React.useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [checkedFilter, setCheckedFilter] = useState({});

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    console.log('here: ');
    setOpenFilter(false);
  };

  const handleClose = () => {
    setDialogValue({
      title: '',
      tag: [],
    });
    setOpenDailog(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    title: '',
    tag: [],
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setAutocompleteValue({
      title: dialogValue.title,
      tag: [...dialogValue.tag],
    });
    handleClose();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  }

  const handleRowsPerPageChange = (event) => {
    setPageSize(event.target.value);
  }

  const handleCheckboxChange = (category, item) => {
    
       // Create a new object to avoid direct mutation of state
       const categoryUpdates = { ...checkedFilter[category] };
       categoryUpdates[item] = !categoryUpdates[item];
   
       const newCheckedState = {
           ...checkedFilter,
           [category]: categoryUpdates
       };
   
       // Update the state with the new checked state
       setCheckedFilter(newCheckedState);
};

const getActiveFiltersCount = (obj) => {
  let count = 0;
  function countRecursively(subObj) {
      for (let key in subObj) {
          if (typeof subObj[key] === 'object') {
              countRecursively(subObj[key]);
          } else if (subObj[key] === true) {
              count++;
          }
      }
  }
  countRecursively(obj);
  return count;
}


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
    if (autocompleteValue === null) {
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
        url: `/api/omop/person/concept/${[8527, 8532, 8516, 8527][Math.floor(Math.random() * 2)]}`,
      }).then((res) => res.data)
      .then((data) => {
        setData(data);
      });
    }
  }, [page, pageSize, autocompleteValue]);

  console.log('autocompleteValue: ', autocompleteValue);

  return (
    <Container maxWidth={fullWidth ? "fullWidth" : "xl"} sx={{ p: 3 }}>
      <Dialog open={openDialog} onClose={handleClose}>
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
            <br />

            <TextField
              margin="dense"
              id="name"
              value={dialogValue.year}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  tag: [...event.target.value],
                })
              }
              label="tags"
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

      <FilterSidebar
        openFilter={openFilter}
        onCloseFilter={handleCloseFilter}
        OPTIONS={OPTIONS}
        checkedFilter={checkedFilter}
        onChangeCheckbox={handleCheckboxChange}
        activeFiltersCount={getActiveFiltersCount(checkedFilter)}
      />

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
                  value={autocompleteValue}
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      // timeout to avoid instant validation of the dialog's form.
                      setTimeout(() => {
                        setOpenDailog(true);
                        setDialogValue({
                          title: newValue,
                          tag: [],
                        });
                      });
                    } else if (newValue && newValue.inputValue) {
                      setOpenDailog(true);
                      setDialogValue({
                        title: newValue.inputValue,
                        tag: [],
                      });
                    } else {
                      setAutocompleteValue(newValue);
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== "") {
                      filtered.push({
                        inputValue: params.inputValue,
                        title: (
                          <>
                            {" "}
                            {params.inputValue + " "}{" "}
                            <Label sx={{ ml: 2 }} color="info">
                              {" "}
                              ADD
                            </Label>{" "}
                          </>
                        ),
                      });
                    }

                    return filtered;
                  }}
                  id="free-solo-dialog-demo"
                  options={cohorts}
                  getOptionLabel={(option) => {
                    // e.g value selected with enter, right from the input
                    if (typeof option === "string") {
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
                  renderOption={(props, option) => (
                    <li {...props}>{option.title}{" "}
                    <Box sx={{ ml: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'flex-end', fontSize: '0.75rem' }}>
                    {option.tag && Array.isArray(option.tag) ? option.tag.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" color="info" />
                    )) : null}
                    </Box>
                    </li>
                  )}
                  freeSolo
                  renderInput={(params) => (
                    <StyledTextField {...params} label="Search" />
                  )}
                />
              </React.Fragment>
            </SearchStyle>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={1}>
             <Badge badgeContent={getActiveFiltersCount(checkedFilter)} color="primary">
              <Icon>
                <MdFilterList onClick={handleOpenFilter} />
              </Icon>
              </Badge>
              <Icon onClick={() => setFullWidth(!fullWidth)}>
                <MdOutlineWidthWide />
              </Icon>
            </Stack>
          </Grid>
        </Grid>
      </AppBar>

      <Box sx={{ ml: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'flex-star', fontSize: '0.75rem' }}>
                  
      {autocompleteValue && autocompleteValue.tag && Array.isArray(autocompleteValue.tag) ? autocompleteValue.tag.map((tag, index) => (
        <Chip key={index} label={tag} size="small" variant="outlined" color="info" />
      )) : null}
      </Box>
      <br />
            


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
}

export default Search;
