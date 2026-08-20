import React from "react";


import { useEffect, useState } from "react";
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
  Stack,
  IconButton,
  Button,
  Select,
  Box, 
  MenuItem,
  InputLabel,
  Typography,
  Toolbar,
} from "@mui/material";
import {FaEye} from "react-icons/fa";

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
  const [_data, setData] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [fullWidth, setFullWidth] = React.useState(false);
  const [view, setView] = React.useState(1);
  const [classifiers, setClassifiers] = useState(["YES", "NO"]);
const [selectedClassifier, setSelectedClassifier] = useState(null);


  const [selectedStudyId, setSelectedStudyId] = useState(null); 

  const dicomStudies = [
    {
      study_id: 1,
      patient_id: 123,
      modality: 'CT',
      study_date: '2023-06-01',
      study_description: 'Abdominal CT Scan',
      institution_name: 'General Hospital',
      referring_physician: 'Dr. Smith',
      uid: '1.2.840.113619.2.55.3.4137926720.710.1498028584.421',
      study: '1.2.840.113619.2.55.3.4137926720.710.1498028584.421',
    },
    {
      study_id: 2,
      patient_id: 456,
      modality: 'MRI',
      study_date: '2023-06-02',
      study_description: 'Brain MRI',
      institution_name: 'City Medical Center',
      referring_physician: 'Dr. Jones',
      study: '1.2.840.113619.2.55.3.2831164357.780.1666358974.1',
    },
  ];


  const handleSearch = (event: any) => {
    setSearchKey(event.target.value);
  };

  const [age, setAge] = React.useState('');

  const handleChange = (event: any) => {
    setAge(event.target.value);
  };

  const ____handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
  }

  const ____handleRowsPerPageChange = (event: any) => {
    setPageSize(event.target.value);
  }

  const handleAddClassifier = () => {
    const newLabel = prompt("Enter new classification label:");
    if (newLabel && !classifiers.includes(newLabel.toUpperCase())) {
      setClassifiers([...classifiers, newLabel.toUpperCase()]);
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

  const handleInfoClick = (studyId: any) => {
    setSelectedStudyId(studyId); 
  };

  // StoneViewer component defined inline
  const StoneViewer = ( {studyId}: {studyId: any} ) => {
    console.log(studyId.study);

    const orcURL= `http://localhost:8042/stone-webviewer/index.html?study=${studyId.study}`
    const volViewerURL= `http://localhost:8042/volview/index.html?names=[archive.zip]&urls=[../studies/8bfca0a2-ba7ea273-dfd5b60d-7edcb775-1b0d095f/archive]`
    const ohifUrl = `http://localhost:8042/ohif/viewer?StudyInstanceUIDs=${studyId.study}`;

    const viewerUrl = {
      1: orcURL,
      2: volViewerURL,
      3: ohifUrl
    }
    console.log(viewerUrl);
    return (
      <div style={{ width: '100%', height: 'calc(100vh - 50px)'  }}>
        <iframe
          src={viewerUrl[view]}
          title="DICOM Viewer"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    );
  };


  return (
    <>
      {selectedStudyId ? (
        <>
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <Toolbar disableGutters>
              <Box sx={{ minWidth: 200 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    StudyUID
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="StudyUID"
                    onChange={handleChange}
                  >
                    {dicomStudies.map((study) => (
                      <MenuItem key={study.study_id} value={study.study}>
                        {study.study}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ minWidth: 150, ml: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="viewer-select-label">View</InputLabel>
                  <Select
                    labelId="viewer-select-label"
                    id="viewer-select"
                    value={view}
                    label="View"
                    onChange={(e) => setView(e.target.value)}
                  >
                    <MenuItem value={1}>Orth Viewer</MenuItem>
                    <MenuItem value={2}>Vol Viewer</MenuItem>
                    <MenuItem value={3}>OHIF Viewer</MenuItem>
                  </Select>
                </FormControl>
              </Box>


              <div style={{ flex: "1 1 auto" }} />

              <Typography variant="h6" component="div" sx={{ mt: 0, mr: 2 }}>
                PHI?{" "}
              </Typography>
              {classifiers.map((label) => (
                <Button
                  key={label}
                  variant={selectedClassifier === label ? "contained" : "outlined"}
                  size="small"
                  style={{ marginRight: 5 }}
                  onClick={() => setSelectedClassifier(label)}
                >
                  {label}
                </Button>
              ))}

              <Button
                variant="outlined"
                color="secondary"
                size="small"
  sx={{ minWidth: '40px', padding: '3px 4px', ml: 1 }}
                onClick={handleAddClassifier}
              >
                + 
              </Button>

            </Toolbar>
          </Box>
          <StoneViewer studyId={selectedStudyId} />
        </>
      ) : (
        <Container maxWidth={fullWidth ? false : "xl"}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <AppBar
                sx={{ bgcolor: "rgba(0, 0, 0, 0)", mt: 7, mb: 3, pr: 1 }}
                position="static"
                color="inherit"
                elevation={0}
              >
                <Grid container alignItems="center">
                  <Grid size="grow">
                    <Search>
                      <SearchIconWrapper>
                        <BiSearchAlt />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Search by patient ID"
                        value={searchKey}
                        onChange={handleSearch}
                        inputProps={{ "aria-label": "search" }}
                      />
                    </Search>
                  </Grid>
                  <Grid>
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
                  <StyledTableCell>Study ID</StyledTableCell>
                  <StyledTableCell>Patient ID</StyledTableCell>
                  <StyledTableCell>Modality</StyledTableCell>
                  <StyledTableCell>Study Date</StyledTableCell>
                  <StyledTableCell>Study Description</StyledTableCell>
                  <StyledTableCell>Institution Name</StyledTableCell>
                  <StyledTableCell>Referring Physician</StyledTableCell>
                  <StyledTableCell>Study Instance UID</StyledTableCell>
                  <StyledTableCell>Detail</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {dicomStudies.map((study) => (
                  <StyledTableRow key={study.study_id}>
                    <StyledTableCell>{study.study_id}</StyledTableCell>
                    <StyledTableCell>{study.patient_id}</StyledTableCell>
                    <StyledTableCell>{study.modality}</StyledTableCell>
                    <StyledTableCell>{study.study_date}</StyledTableCell>
                    <StyledTableCell>{study.study_description}</StyledTableCell>
                    <StyledTableCell>{study.institution_name}</StyledTableCell>
                    <StyledTableCell>
                      {study.referring_physician}
                    </StyledTableCell>
                    <StyledTableCell>{study.study}</StyledTableCell>
                    <StyledTableCell>
                      <IconButton onClick={() => handleInfoClick(study)}>
                        <FaEye />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      )}
    </>
  );
};

export default PersonTable;
