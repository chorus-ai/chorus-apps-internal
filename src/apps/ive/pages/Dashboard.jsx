import React, { useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Tiles from "../sections/Dashboard/Tiles";
export default function Assignments() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.main.user);


  if (user) {
    console.log(user);
    return (
      <Container maxWidth="xl">
        <Tiles/>
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

