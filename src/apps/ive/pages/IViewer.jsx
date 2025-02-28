import React, { useState } from "react";
import { Container, Typography, Grid, AppBar, Stack, Select, MenuItem, IconButton, Paper } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Tiles from "../sections/Dashboard/Tiles";
import { TbDragDrop2 } from "react-icons/tb";

export default function Assignments() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.main.user);

  // State for Tiles disable feature
  const [disabled, setDisabled] = useState(true);

  // State for selected Person and Visit
  const [selectedPerson, setSelectedPerson] = useState(56646);
  const [selectedVisit, setSelectedVisit] = useState(24484444);

  // Sample data for dropdowns
  const persons = [
    { id: 56646, name: "Person 56646" },
    { id: 1564841, name: "Person 1564841" },
    { id: 546515, name: "Person 546515" },
  ];

  const visits = [
    { id: 24484444, name: "Visit 24484444" },
    { id: 549864515, name: "Visit 549864515" },
    { id: 3541308, name: "Visit 3541308" },
  ];

  if (user) {
    return (
      <Container maxWidth="xl">
        <Grid container >
          <Grid item sm={12}>
            <AppBar
              sx={{ mt: 5, mb: 3, pr: 1 }}
              position="static"
              color="inherit"
              elevation={0}
            >
              <Grid container alignItems="center">
                <Grid item xs>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {/* Person Dropdown */}
                    <Select
                      value={selectedPerson}
                      onChange={(e) => setSelectedPerson(e.target.value)}
                      displayEmpty
                      sx={{ minWidth: 120, border: "1px solid transparent",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "transparent"
                        } }}
                    >
                      <MenuItem value="" disabled>Select Person</MenuItem>
                      {persons.map((person) => (
                        <MenuItem key={person.id} value={person.id}>{person.name}</MenuItem>
                      ))}
                    </Select>

                    {/* Visit Dropdown */}
                    <Select
                      value={selectedVisit}
                      onChange={(e) => setSelectedVisit(e.target.value)}
                      displayEmpty
                      sx={{ minWidth: 120 , border: "1px solid transparent",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "transparent"
                        } }}
                      disabled={!selectedPerson} // Enable only if person is selected
                    >
                      <MenuItem value="" disabled>Select Visit</MenuItem>
                      {visits.map((visit) => (
                        <MenuItem key={visit.id} value={visit.id}>{visit.name}</MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() => setDisabled(!disabled)}
                      color={disabled ? "info" : "neutral"}
                    >
                      <TbDragDrop2 />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </AppBar>
          </Grid>
        </Grid>
        <Tiles disabled={disabled} />
      </Container>
    );
  } else {
    return (
      <Container
        sx={{
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          minHeight: "100vh",
          display: "flex",
        }}
      >
        <Typography variant="h3" paragraph>
          There are no data.
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Contact your admin!
        </Typography>
      </Container>
    );
  }
}
