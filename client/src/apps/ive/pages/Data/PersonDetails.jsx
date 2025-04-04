import React, { useEffect, useState, useCallback } from "react";
import { 
  Container, 
  Typography, 
  CircularProgress,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  Stack, 
  Divider,
  Popover
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom"; 
import { NoData } from "../../common/Nodata";
import { AiOutlineLink } from "react-icons/ai";
import Detail from "./Detail";

// Utility functions
const formatLabel = (key) => key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
const formatDate = (dateString) => new Date(dateString).toISOString().split("T")[0];

const PopoverContent = ({ popoverType, popoverData, selectedValue, loading }) => (
  <div style={{ padding: "12px", maxWidth: "350px" }}>
    {loading ? (
      <CircularProgress size={20} />
    ) : selectedValue && popoverData[selectedValue] ? (
      popoverType === "concept" ? (
        <>
          <Typography variant="body1" sx={{pb: 1}}><strong>{popoverData[selectedValue]?.name}</strong></Typography>
          <Typography variant="body2"><strong>Domain:</strong> {popoverData[selectedValue]?.domainId}</Typography>
          <Typography variant="body2"><strong>Class:</strong> {popoverData[selectedValue]?.conceptClassId}</Typography>
          <Typography variant="body2"><strong>Vocabulary:</strong> {popoverData[selectedValue]?.vocabularyName}</Typography>
          <Typography variant="body2"><strong>Concept Code:</strong> {popoverData[selectedValue]?.conceptCode}</Typography>
          <Typography variant="body2"><strong>Valid Start:</strong> {formatDate(popoverData[selectedValue]?.validStart)}</Typography>
          <Typography variant="body2"><strong>Valid End:</strong> {formatDate(popoverData[selectedValue]?.validEnd)}</Typography>
          <Typography variant="body2"><strong>Status:</strong> {popoverData[selectedValue]?.invalidReason || "N/A"}</Typography>
        </>
      ) : (
        Object.entries(popoverData[selectedValue]).map(([key, value], i) => (
          <Typography key={i} variant="body2" style={{ marginBottom: "6px" }}>
            <strong>{formatLabel(key)}:</strong> {Array.isArray(value) ? value.join(", ") : value || "N/A"}
          </Typography>
        ))
      )
    ) : (
      <Typography variant="body2" color="error">No data available</Typography>
    )}
  </div>
);

const PatientDetails = () => {  
  const { pid } = useParams();
  const [data, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverData, setPopoverData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [popoverType, setPopoverType] = useState(null);

  const handleIconClick = useCallback(async (event, value, type) => {
    setAnchorEl(event.currentTarget);
    setSelectedValue(value);
    setPopoverType(type);

    if (popoverData[value]) return;

    setLoading(true);
    try {
      const response = await fetch(`https://athena.ohdsi.org/api/v1/concepts/${value}`);
      const data = await response.json();
      setPopoverData((prev) => ({ ...prev, [value]: data }));
    } catch (error) {
      console.error(`Error fetching concept details:`, error);
    } finally {
      setLoading(false);
    }
  }, [popoverData]);

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedValue(null);
    setPopoverType(null);
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    axios.get(`/api/omop/person/${parseInt(pid, 10)}`)
      .then((res) => setDetails(res.data))
      .catch((err) => {
        console.error("Error fetching details:", err);
        setError("Failed to fetch details. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [pid]);

  return (
    <Container maxWidth="xl">
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="body1" color="error">{error}</Typography>
      ) : data ? (
        <>
          <AppBar component="div" sx={{ backgroundColor: "transparent", color: "ButtonText" }} position="static" elevation={0}>
            <Toolbar>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs>
                  <Typography color="inherit" variant="h6" component="h2">Patient Detail</Typography>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <PopoverContent popoverType={popoverType} popoverData={popoverData} selectedValue={selectedValue} loading={loading} />
          </Popover>

          <Card sx={{ mx: 2 }}>
            <CardContent>
              <Stack direction="row" useFlexGap spacing={2} divider={<Divider flexItem />} sx={{ flexWrap: 'wrap' }}>
                {Object.entries(data).map(([key, value]) => {
                  const isInteractive = Boolean(value) && (key.endsWith("_concept_id"));

                  return (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Typography variant="body2">
                        {formatLabel(key)}: <strong>{value ?? "-"}</strong> 
                      </Typography>
                      {isInteractive && 
                        <AiOutlineLink
                          size={14}
                          style={{ cursor: "pointer", color: "#1abc9c" }}
                          onClick={(event) => handleIconClick(event, value, "concept")}
                        />
                      }
                    </div>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>

        <Detail table='visit_occurrence' type="person" pid={pid}/>
        </>
      ) : (
        <NoData />
      )}
    </Container>
  );
};

export default PatientDetails;
