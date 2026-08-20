import { useEffect, useState } from "react";
import {
  AppBar,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Paper,
  TablePagination,
  Tabs,
  Tab,
  InputBase,
  FormControl,
  Toolbar,
  Typography,
  Chip,
  Avatar,
  AvatarGroup,
  Tooltip,
  Skeleton,
} from "@mui/material";

import { styled, alpha } from "@mui/material/styles";
import { BiSearchAlt } from "react-icons/bi";

// ----------------------------------------------------------------------

interface ModelUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}

interface M2dModel {
  id: number;
  name: string;
  version: string;
  details: string;
  dataDescription: string;
  users: ModelUser[];
  m2dModelInputType: { name: string } | null;
  m2dModelResultType: { name: string } | null;
}

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------

const mockModels: M2dModel[] = [
  {
    id: 1,
    name: "AFib Detection",
    version: "v1.0",
    details: "Annotation model for detecting atrial fibrillation events from wearable signal segments.",
    dataDescription: "PPG waveform windows annotated for AFib presence or absence.",
    users: [
      { id: 1, firstName: "Ava", lastName: "Thompson", username: "athompson" },
      { id: 2, firstName: "Ethan", lastName: "Cole", username: "ecole" },
    ],
    m2dModelInputType: { name: "PPG Signal" },
    m2dModelResultType: { name: "Binary Label" },
  },
  {
    id: 2,
    name: "PPG Signal Quality",
    version: "v1.2",
    details: "Annotation model for classifying whether a PPG segment is clean, noisy, or unusable.",
    dataDescription: "Short PPG signal clips labeled by signal quality category.",
    users: [
      { id: 3, firstName: "Mia", lastName: "Lopez", username: "mlopez" },
      { id: 4, firstName: "Noah", lastName: "Kim", username: "nkim" },
      { id: 5, firstName: "Sofia", lastName: "Patel", username: "spatel" },
    ],
    m2dModelInputType: { name: "PPG Signal" },
    m2dModelResultType: { name: "Quality Class" },
  },
  {
    id: 3,
    name: "Nutrition Validation",
    version: "v0.9",
    details: "Annotation workflow for validating logged meals against image and metadata evidence.",
    dataDescription: "Meal photos, text entries, timestamps, and reviewer validation labels.",
    users: [
      { id: 6, firstName: "Liam", lastName: "Rivera", username: "lrivera" },
      { id: 7, firstName: "Emma", lastName: "Nguyen", username: "enguyen" },
    ],
    m2dModelInputType: { name: "Meal Record" },
    m2dModelResultType: { name: "Validation Status" },
  },
  {
    id: 4,
    name: "Sleep Stage Review",
    version: "v2.0",
    details: "Annotation model for reviewing and labeling sleep segments into stage categories.",
    dataDescription: "Sensor-derived sleep windows with expert stage annotations.",
    users: [
      { id: 8, firstName: "Olivia", lastName: "Martin", username: "omartin" },
      { id: 9, firstName: "James", lastName: "Hall", username: "jhall" },
      { id: 10, firstName: "Isabella", lastName: "Young", username: "iyoung" },
    ],
    m2dModelInputType: { name: "Sleep Signal" },
    m2dModelResultType: { name: "Stage Label" },
  },
  {
    id: 5,
    name: "Heart Rate Artifact Detection",
    version: "v1.1",
    details: "Annotation model for identifying motion artifacts in heart rate-related signal windows.",
    dataDescription: "Wearable signal snippets labeled for artifact contamination.",
    users: [{ id: 11, firstName: "Benjamin", lastName: "Scott", username: "bscott" }],
    m2dModelInputType: { name: "Sensor Signal" },
    m2dModelResultType: { name: "Artifact Flag" },
  },
  {
    id: 6,
    name: "Glucose Event Tagging",
    version: "v1.0",
    details: "Annotation model for tagging meal, fasting, and anomalous glucose events.",
    dataDescription: "CGM timeline segments with contextual annotation labels.",
    users: [
      { id: 12, firstName: "Charlotte", lastName: "Adams", username: "cadams" },
      { id: 13, firstName: "Lucas", lastName: "Baker", username: "lbaker" },
    ],
    m2dModelInputType: { name: "CGM Series" },
    m2dModelResultType: { name: "Event Label" },
  },
  {
    id: 7,
    name: "ECG Beat Annotation",
    version: "v3.0",
    details: "Annotation model for labeling ECG beats and rhythm abnormalities.",
    dataDescription: "ECG strips with beat-level and rhythm-level expert annotations.",
    users: [
      { id: 14, firstName: "Amelia", lastName: "Perez", username: "aperez" },
      { id: 15, firstName: "Henry", lastName: "Ward", username: "hward" },
      { id: 16, firstName: "Ella", lastName: "Brooks", username: "ebrooks" },
    ],
    m2dModelInputType: { name: "ECG Signal" },
    m2dModelResultType: { name: "Beat Label" },
  },
  {
    id: 8,
    name: "Hydration Log Review",
    version: "v0.8",
    details: "Annotation model for validating hydration logs and identifying incomplete entries.",
    dataDescription: "User hydration logs with review outcomes and quality tags.",
    users: [],
    m2dModelInputType: { name: "Log Entry" },
    m2dModelResultType: { name: "Review Outcome" },
  },
];

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

// ----------------------------------------------------------------------

function initials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

// ----------------------------------------------------------------------

export default function Model() {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchKey, setSearchKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const models = mockModels;

  const filtered = models.filter((m) =>
    JSON.stringify(m).toLowerCase().includes(searchKey.toLowerCase())
  );

  return (
    <div>
      <AppBar component="div" sx={{ px: 1 }} position="static" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid size="grow">
              <Typography color="inherit" variant="h6" component="h1">
                Models
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <AppBar sx={{ pl: 1 }} component="div" position="static" elevation={0}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab disableRipple label="Overview" />
        </Tabs>
      </AppBar>

      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid size={12}>
            <AppBar
              sx={{ bgcolor: "rgba(0,0,0,0)", mt: 7, mb: 3 }}
              position="static"
              color="inherit"
              elevation={0}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid size="grow">
                  <Search>
                    <SearchIconWrapper>
                      <BiSearchAlt />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search models"
                      value={searchKey}
                      onChange={(e) => {
                        setSearchKey(e.target.value);
                        setPage(0);
                      }}
                      inputProps={{ "aria-label": "search" }}
                    />
                  </Search>
                </Grid>
              </Grid>
            </AppBar>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ p: 2 }}>
          <Table size="small" aria-label="models table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Input Type</TableCell>
                <TableCell>Result Type</TableCell>
                <TableCell>Owners</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : filtered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((model) => (
                      <TableRow key={model.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {model.name}
                          </Typography>
                          {model.details && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                              sx={{ maxWidth: 280, display: "block" }}
                            >
                              {model.details}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={model.version || "—"}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {model.m2dModelInputType?.name ?? (
                            <Typography variant="caption" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {model.m2dModelResultType?.name ?? (
                            <Typography variant="caption" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {model.users?.length ? (
                            <AvatarGroup
                              max={4}
                              sx={{ justifyContent: "flex-start" }}
                            >
                              {model.users.map((u) => (
                                <Tooltip
                                  key={u.id}
                                  title={`${u.firstName} ${u.lastName}`}
                                >
                                  <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                                    {initials(u.firstName, u.lastName)}
                                  </Avatar>
                                </Tooltip>
                              ))}
                            </AvatarGroup>
                          ) : (
                            <Typography variant="caption" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
          />
        </TableContainer>
      </Container>
    </div>
  );
}