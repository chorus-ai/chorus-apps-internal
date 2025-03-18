import React, { useEffect, useState } from "react";
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
  Typography,
  TablePagination,
  Toolbar,
  Chip,
  CircularProgress,
  Box, 
  Tabs,
  Tab
} from "@mui/material";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line 
} from "recharts";
import { styled, alpha } from "@mui/material/styles";
import axios from "axios";
import { NoData } from "../common/Nodata";
import { CommonTable } from "../common/Table";
import { BiSearchAlt } from "react-icons/bi";
import { MdFilterList, MdOutlineViewColumn } from "react-icons/md";
import { UtilSidebar } from "../common/UtilSidebar";

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

// -------------- CohortDetail Component ------------------

const CohortDetail = ({ selectedCohort, goBack }) => {
  // Mock statistics data
  const mockStats = {
    totalPersons: 5,
    totalDeaths: 2,
    medications: 24,
    procedures: 40
  };

  return (
    <div>
      <Button onClick={goBack} variant="text" color="primary">
        Back to Cohort List
      </Button>
      <h2>{selectedCohort.title}</h2>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {Object.entries(mockStats).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Card>
              <CardContent>
                <Typography variant="h6">{key.replace(/([A-Z])/g, " $1")}</Typography>
                <Typography variant="h4">{value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

// -------------- CohortList Component ------------------

const CohortList = ({ selectedCohortDef, goBack, showDetails }) => {
  const cohortDetails = [
    { cohort_definition_id: 1, subject_id: 101, cohort_start_date: "2020-01-01", cohort_end_date: "2020-12-31" },
    { cohort_definition_id: 2, subject_id: 102, cohort_start_date: "2019-05-15", cohort_end_date: "2020-05-14" },
    { cohort_definition_id: 3, subject_id: 103, cohort_start_date: "2021-07-01", cohort_end_date: "2022-06-30" },
    { cohort_definition_id: 4, subject_id: 104, cohort_start_date: "2018-03-20", cohort_end_date: "2019-03-19" },
    { cohort_definition_id: 5, subject_id: 105, cohort_start_date: "2022-01-01", cohort_end_date: "2022-12-31" },
  ];
  const [activeTab, setActiveTab] = useState(0);

  // Mock Data
  const cohortData = [{ name: "Diabetes", count: 200 }, { name: "Hypertension", count: 150 }];
  const outcomesData = [{ name: "Mortality", rate: 12 }, { name: "Readmission", rate: 18 }];
  const dataQuality = [{ metric: "Missing Data (%)", value: 5 }, { metric: "Duplicates", value: 2 }];
  const aiModelMetrics = [{ model: "AI-Model-1", auc: 0.89 }, { model: "AI-Model-2", auc: 0.92 }];


  return (
    <div>
      <Button onClick={goBack} variant="text" color="primary">
        Back to Cohort Definitions
      </Button>
      <Box sx={{ maxWidth: "900px", margin: "auto", p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        OMOP Cohort Dashboard
      </Typography>

      {/* MUI Tabs */}
      <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} centered>
        <Tab label="Cohort Explorer" />
        <Tab label="Clinical Outcomes" />
        <Tab label="Data Quality" />
        <Tab label="AI Benchmarking" />
      </Tabs>

      {/* Tab Panels */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6">Cohort Distribution</Typography>
            <BarChart width={500} height={300} data={cohortData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1976D2" />
            </BarChart>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6">Clinical Outcomes</Typography>
            <LineChart width={500} height={300} data={outcomesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#D32F2F" />
            </LineChart>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6">Data Quality & Validation</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Metric</strong></TableCell>
                    <TableCell><strong>Value</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataQuality.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.metric}</TableCell>
                      <TableCell>{item.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="h6">AI Model Performance</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Model</strong></TableCell>
                    <TableCell><strong>AUC Score</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {aiModelMetrics.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.model}</TableCell>
                      <TableCell>{item.auc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Box>
      {cohortDetails.length === 0 ? (
        <NoData />
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <CommonTable 
            headers={Object.keys(cohortDetails[0])} 
            data={cohortDetails} 
            columns={Object.keys(cohortDetails[0])}
            showDetails={showDetails} />
        </TableContainer>
      )}
    </div>
  );
};

// -------------- CohortTable (Main Component) ------------------

const CohortTable = ({ table, total }) => {
  const [searchKey, setSearchKey] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedCohortDef, setSelectedCohortDef] = useState(null); // Stores selected cohort definition
  const [selectedCohort, setSelectedCohort] = useState(null); // Stores selected cohort

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    console.log('here: ');
    setOpenFilter(false);
  };

  const handleSearch = (event) => {
    setSearchKey(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };

  const showCohortList = (cohortDef) => {
    console.log("Selected Cohort Definition:", cohortDef);
    setSelectedCohortDef(cohortDef);
  };

  const showDetails = (cohort) => {
    console.log("Selected Cohort:", cohort);
    setSelectedCohort(cohort);
  };

  const goBackToCohortDefinitions = () => {
    setSelectedCohortDef(null);
  };

  const goBackToCohortList = () => {
    setSelectedCohort(null);
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    let url = `/api/omop/${table}?page=${page}&pageSize=${pageSize}`;
    if (searchKey) {
      url = `/api/omop/${table}?search=${searchKey}&page=${page}&pageSize=${pageSize}`;
    }

    axios
      .get(url)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [page, pageSize, table, searchKey]);

  return (
    <Container maxWidth="xl">
      {selectedCohort ? (
        <CohortDetail selectedCohort={selectedCohort} goBack={goBackToCohortList} />
      ) : selectedCohortDef ? (
        <CohortList selectedCohortDef={selectedCohortDef} goBack={goBackToCohortDefinitions} showDetails={showDetails} />
      ) : (
        <>
          <AppBar component="div" sx={{ backgroundColor: "transparent", color: "ButtonText" }} position="static" elevation={0}>
            <Toolbar>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs>
                  <Typography color="inherit" variant="h6" component="h2">
                    {table.charAt(0).toUpperCase() + table.slice(1)}
                    <Chip color="primary" size="small" sx={{ ml: 1, borderRadius: 3 }} label={total} />
                  </Typography>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <Grid container spacing={2}>
        <Grid item xs={12}>
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
                    <MdOutlineViewColumn onClick={handleOpenFilter }/>
                  </Icon>
                </Stack>
              </Grid>
            </Grid>
          </AppBar>
        </Grid>
      </Grid>
          <TableContainer component={Paper} sx={{ width: "100%", minHeight: "100px" }}>
            {isLoading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: "400px" }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Loading data...
                </Typography>
              </Stack>
            ) : error ? (
              <Typography variant="body1" color="error" sx={{ textAlign: "center", p: 2 }}>
                {error}
              </Typography>
            ) : data.length === 0 ? (
              <NoData />
            ) : (
              <>
              <div style={{ overflow: "auto" }}>
                <UtilSidebar
                  header="Columns"
                  footer="Clear All"
                  data={Object.keys(data[0])}
                  openFilter={openFilter}
                  onCloseFilter={handleCloseFilter} 
                  handleCheckedItem={handleCheckedItem}      
                />
              <CommonTable 
                headers={data.length > 0 ? Object.keys(data[0]) : []} 
                data={data} 
                showDetails={showCohortList} 
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
            </>

            )}
            
          </TableContainer>
        </>
      )}
    </Container>
  );
};

export default CohortTable;
